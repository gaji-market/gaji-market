import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useToast from 'hooks/toast';

import styled, { css } from 'styled-components';

import { RiDeleteBinLine } from 'react-icons/ri';

import {
  useGetChatRoomListMutation,
  useAddChatRoomMutation,
  useLazyGetChatRoomQuery,
  useLazyRemoveChatMessageQuery,
  useLazyRemoveChatRoomQuery,
} from 'services/chatApi';

import { selectUserNo } from 'store/sessionSlice';

import Modal from 'components/common/Modal';
import FinishChatModal from 'components/chat/FinishChatModal';
import Button from 'components/common/Button';

import {
  DARK_GRAY_COLOR,
  GRAY_COLOR,
  LIGHT_GRAY_COLOR,
  PRIMARY_COLOR,
  PRIMARY_VAR_COLOR,
  SECONDARY_COLOR,
  WHITE_COLOR,
} from 'components/common/commonColor';

import { AiFillWechat } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { RiSendPlaneFill } from 'react-icons/ri';
import { ReactComponent as GradationLogo } from 'assets/GradationLogo.svg';

export default function Chat() {
  const [getChatRoomList] = useGetChatRoomListMutation();
  const [getChatRoom] = useLazyGetChatRoomQuery();
  const [addChatRoom] = useAddChatRoomMutation();
  const [removeChatRoom] = useLazyRemoveChatRoomQuery();
  const [removeChatMsg] = useLazyRemoveChatMessageQuery();
  const { addToast } = useToast();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUserNo = searchParams.get('target');

  const ws = useRef(null);
  const textareaRef = useRef(null);
  const roomDeleteModalRef = useRef(null);
  const msgDeleteModalRef = useRef(null);
  const finishModalRef = useRef(null);
  const msgRef = useRef(null);

  const [target, setTarget] = useState(null);
  const [deleteRoomTarget, setDeleteRoomTarget] = useState(null);
  const [deleteMsgTarget, setDeleteMsgTarget] = useState(null);
  const [msg, setMsg] = useState('');
  const [chatRoomInfos, setChatRoomInfos] = useState([]);
  const [chatInfo, setChatInfo] = useState({});
  const [chatMsgInfos, setChatMsgInfos] = useState([]);

  const userNo = useSelector(selectUserNo);

  // ================================ api handlers
  const getChatRoomListHandler = async () => {
    try {
      const { chatRoomInfos } = await getChatRoomList({
        userNo: userNo,
        currentPage: 1,
        recordCount: 100,
      }).unwrap();
      setChatRoomInfos(chatRoomInfos);

      if (chatRoomInfos[0]) {
        getChatRoomHandler(chatRoomInfos[0]);
      }
      if (targetUserNo && userNo) {
        addChatRoomHandler(targetUserNo, userNo);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addChatRoomHandler = async (targetUserNo, userNo) => {
    try {
      const res = await addChatRoom({
        targetUserNo: targetUserNo,
        userNo: userNo,
        prodNo: searchParams.get('prodNo'),
      }).unwrap();
      // chatNo: 57, targetUserNo: 225, userNo: 120, tgUserNo: 120
      setChatRoomInfos((prev) => [
        {
          ...res.chatRoomInfo,
          nickname: 'New Chat',
          lastMessage: '대화를 시작하세요',
        },
        ...prev,
      ]);

      setTarget({
        id: `${res.chatRoomInfo.userNo}_${res.chatRoomInfo.chatNo}`,
        ...res.chatRoomInfo,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getChatRoomHandler = async (item) => {
    try {
      const infos = await getChatRoom({
        chatNo: item.chatNo,
        userNo: item.userNo,
      }).unwrap();
      setChatInfo(infos);
      setChatMsgInfos(infos.chatMessageInfos);
      setTimeout(() => {
        if (msgRef.current) {
          msgRef.current.scrollTop = msgRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.log(err);
    } finally {
      setTarget({ id: `${item.userNo}_${item.chatNo}`, ...item });
      setMsg('');
    }
  };

  const removeChatRoomHandler = async () => {
    try {
      await removeChatRoom(deleteRoomTarget).unwrap();
      getChatRoomListHandler();

      addToast({
        isToastSuccess: true,
        isMainTheme: true,
        toastMessage: '채팅방이 삭제 되었습니다.',
      });
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteRoomTarget(null);
    }
  };

  const removeMsgHandler = async () => {
    try {
      await removeChatMsg(deleteMsgTarget).unwrap();
      getChatRoomHandler(target);
      addToast({
        isToastSuccess: true,
        isMainTheme: true,
        toastMessage: '채팅 메시지가 삭제 되었습니다.',
      });
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteMsgTarget(null);
    }
  };

  // ========================================================= websocket (희주님 여기입니다!)
  const sendChatMsg = async () => {
    if (!ws.current) {
      ws.current = new WebSocket('ws://3.39.156.141:8080/socket/chat');
    }

    if (!msg) {
      textareaRef.current.focus();
      addToast({
        isToastSuccess: false,
        isMainTheme: true,
        toastMessage: '메시지를 입력해 주세요.',
      });
      return;
    }
    const [regDate, regTime] = getDateAndTime();
    const data = JSON.stringify({
      userNo: userNo,
      chatNo: target.chatNo,
      msg,
      regDate: regDate,
      regTime: regTime,
    });

    if (ws.current.readyState === 0) {
      ws.current.onopen = () => {
        ws.current.send(data);
      };
    } else {
      ws.current.send(data);
    }

    setMsg('');

    ws.current.onmessage = (message) => {
      const [regDate, regTime] = getDateAndTime();
      const newMsg = {
        no: 2, // temp data
        regDate: regDate, //temp data
        regTime: regTime, // temp data
        messageNo: 17, // temp data
        checkYn: 'N', // temp data
        nickname: 'SYSY', // temp data
        message: message,
      };
      setChatMsgInfos((prev) => [...prev, newMsg]);
      if (msgRef.current) {
        msgRef.current.scrollTop = msgRef.current.scrollHeight;
      }
    };
  };

  // ==========================================================

  useEffect(() => {
    getChatRoomListHandler();
  }, []);

  return (
    <>
      <Modal
        ref={roomDeleteModalRef}
        text='정말 삭제 하시겠습니까?'
        leftBtnText='네'
        rightBtnText='아니요'
        confirmHandler={removeChatRoomHandler}
      />
      <Modal
        ref={msgDeleteModalRef}
        text='정말 삭제 하시겠습니까?'
        leftBtnText='네'
        rightBtnText='아니요'
        confirmHandler={removeMsgHandler}
      />
      <FinishChatModal
        ref={finishModalRef}
        targetUserNo={chatInfo?.chatRoomInfo?.targetUserNo}
        userNo={chatInfo?.chatRoomInfo?.userNo}
      />
      <Wrapper>
        <ChatList>
          <ChatListHeader>
            <AiFillWechat size={32} color={PRIMARY_COLOR} />
            <Header>Chat</Header>
          </ChatListHeader>
          <ChatListBody>
            {chatRoomInfos.length > 0 ? (
              chatRoomInfos.map((item, i) => (
                <ChatItemWrapper
                  key={item.chatNo}
                  className={
                    target?.id === `${item.userNo}_${item.chatNo}`
                      ? 'current'
                      : ''
                  }
                >
                  <ChatItem onClick={() => getChatRoomHandler(item)}>
                    <Box padding='8px' fill='true'>
                      <Username>{item.nickname}</Username>
                      <LastMsg>{item.lastMessage}</LastMsg>
                    </Box>
                    <Box padding='8px' center='true'>
                      <span>{item.regDate}</span>
                    </Box>
                  </ChatItem>
                  <Box padding='8px' center='true'>
                    <IconButton
                      onClick={() => [
                        roomDeleteModalRef.current?.showModal(),
                        setDeleteRoomTarget(item.chatNo),
                      ]}
                    >
                      <RiDeleteBinLine size={22} color={GRAY_COLOR} />
                    </IconButton>
                  </Box>
                </ChatItemWrapper>
              ))
            ) : (
              <FlexBox>
                <h1>아직 대화를 시작하지 않았습니다.</h1>
              </FlexBox>
            )}
          </ChatListBody>
        </ChatList>
        <ChatMessage>
          {target ? (
            <>
              <ChatMsgHeader>
                <Avatar isTarget='true'>
                  <GradationLogo height='36px' />
                </Avatar>
                <Header>{target.nickname}</Header>
                <Button
                  size='sm'
                  padding='0'
                  height='32px'
                  isOutline
                  isDarkColor
                  onClick={() => finishModalRef.current?.showModal()}
                >
                  채팅종료
                </Button>
              </ChatMsgHeader>
              <ChatMsgBody ref={msgRef}>
                {(chatInfo?.chatMessageInfos || []).map((info, idx) => (
                  <Bubble key={`${info.no}_${idx}`}>
                    {info.nickname === target.nickname ? (
                      <Avatar isTarget='true'>
                        <GradationLogo height='36px' />
                      </Avatar>
                    ) : (
                      <Avatar>
                        <FaUserCircle size={32} color={GRAY_COLOR} />
                      </Avatar>
                    )}
                    <div className='msg-container'>
                      <div className='name-and-date'>
                        <div>{info.nickname}</div>
                        <div>
                          <span>{info.regDate}</span>
                          <span>{info.regTime}</span>
                        </div>
                      </div>
                      <div className='msg'>{info.message}</div>
                    </div>
                    <Check>{info.checkYn === 'Y' ? '읽음' : '읽지 않음'}</Check>
                    <IconButton
                      onClick={() => [
                        msgDeleteModalRef.current?.showModal(),
                        setDeleteMsgTarget(info.messageNo),
                      ]}
                    >
                      <RiDeleteBinLine size={22} color={GRAY_COLOR} />
                    </IconButton>
                  </Bubble>
                ))}
              </ChatMsgBody>
              <Form onSubmit={(e) => [e.preventDefault(), sendChatMsg()]}>
                <textarea
                  ref={textareaRef}
                  placeholder='보내기: Ctrl + Enter'
                  onChange={(e) => setMsg(e.target.value)}
                  value={msg}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && e.ctrlKey && sendChatMsg()
                  }
                />
                <button>
                  <RiSendPlaneFill size={24} color={SECONDARY_COLOR} />
                </button>
              </Form>
            </>
          ) : (
            <div className='flexbox'>
              <h1>판매자/구매자와 채팅을 시작하세요</h1>
              <BtnGroup>
                <Button
                  size='lg'
                  padding='0'
                  height='40px'
                  onClick={() => navigate('/products/pal')}
                >
                  팔래요 보러가기
                </Button>
                <Button
                  size='lg'
                  padding='0'
                  height='40px'
                  isOutline
                  onClick={() => navigate('/products/sal')}
                >
                  살래요 보러가기
                </Button>
              </BtnGroup>
            </div>
          )}
        </ChatMessage>
      </Wrapper>
    </>
  );
}

const getDateAndTime = () => {
  const now = new Date();
  const regDate = `${String(now.getFullYear()).slice(2)}-${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const regTime = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return [regDate, regTime];
};

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  margin: 16px;
  height: calc(100vh - 56px - 32px);
  background-color: white;
  box-shadow: 3px 3px 30px ${GRAY_COLOR};
  border-radius: 16px;
  overflow: hidden;

  .flexbox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }
`;

const Header = styled.h3`
  flex: 1;
  font-size: 24px;
  font-weight: bold;
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
`;

// chat
const ChatList = styled.div`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 480px;
  border-right: 3px solid ${LIGHT_GRAY_COLOR};

  .current {
    /* background-color: ${PRIMARY_VAR_COLOR}; */
    border: 2px solid ${PRIMARY_COLOR};
  }
`;

const ChatListHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 32px;
  padding-bottom: 4px;
  column-gap: 16px;
`;

const ChatListBody = styled.div`
  padding: 32px;
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 16px;
`;

const ChatItemWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 8px;
  background: ${WHITE_COLOR};
  border-radius: 8px;
  border: 2px solid ${LIGHT_GRAY_COLOR};

  &:hover {
    cursor: pointer;
    border: 2px solid ${PRIMARY_COLOR};
  }
`;

const ChatItem = styled.div`
  display: flex;
  justify-content: space-around;
  flex: 1;

  div > span {
    color: ${DARK_GRAY_COLOR};
  }
`;

const Box = styled.div`
  padding: ${({ padding }) => padding};
  ${({ fill }) =>
    fill &&
    css`
      flex: 1;
    `}

  ${({ center }) =>
    center === 'true' &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;

const IconButton = styled.span`
  &:hover {
    cursor: pointer;

    svg {
      fill: ${PRIMARY_COLOR};
      transform: scale(1.1);
    }
  }
`;

const Username = styled.div`
  font-weight: bold;
  color: ${PRIMARY_COLOR};
`;

// message
const LastMsg = styled.div`
  color: ${DARK_GRAY_COLOR};
  margin-top: 8px;
  height: 16px;
`;

// right - chat message
const ChatMessage = styled.div`
  width: 100%;
  h1 {
    text-align: center;
  }
`;

const ChatMsgHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 32px;
  column-gap: 16px;
  border-bottom: 2px solid #eee;
`;

const ChatMsgBody = styled.div`
  overflow: auto;
  height: calc(100% - 184px);
  padding: 32px;
  box-sizing: border-box;
  h3 {
    margin-bottom: 16px;
  }
`;

const Bubble = styled.div`
  padding: 16px;
  display: flex;
  column-gap: 16px;
  align-items: center;
  justify-content: space-between;

  border: 1px solid #eee;
  border-radius: 8px;

  & + & {
    margin-top: 16px;
  }

  .msg-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    row-gap: 8px;

    & > div {
      display: flex;
    }
  }

  .name-and-date {
    display: flex;
    column-gap: 16px;
    align-items: center;

    & > div {
      &:first-child {
        font-weight: bold;
        color: ${DARK_GRAY_COLOR};
        width: 80px;
      }
      &:last-child {
        color: ${GRAY_COLOR};
        font-size: 12px;
        display: flex;
        column-gap: 8px;
      }
    }
  }

  .msg {
    padding: 8px 16px;
    background-color: ${LIGHT_GRAY_COLOR};
    border-radius: 4px;
    width: fit-content;
  }
`;

const Avatar = styled.div`
  border-radius: 48px;
  background-color: ${({ isTarget }) => isTarget && PRIMARY_VAR_COLOR};

  svg {
    margin-bottom: -4px;
  }
`;

const Check = styled.div`
  color: ${DARK_GRAY_COLOR};
`;

const Form = styled.form`
  font-size: 24px;
  font-weight: bold;
  position: relative;
  bottom: 0;
  border-top: 3px solid ${LIGHT_GRAY_COLOR};
  display: flex;

  textarea {
    flex: 1;
    height: 48px;
    padding: 16px;
    box-sizing: content-box;
    border: none;
    resize: none;
  }

  button {
    padding: 16px;
    background-color: transparent;
    border: none;
    &:hover {
      cursor: pointer;
      transform: scale(1.4);
    }
  }
`;

const BtnGroup = styled.div`
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  align-items: center;
`;
