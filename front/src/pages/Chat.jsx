import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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

const URL = '3.39.156.141:8080';

export default function Chat() {
  const [getChatRoomList] = useGetChatRoomListMutation();
  const [getChatRoom] = useLazyGetChatRoomQuery();
  const [addChatRoom] = useAddChatRoomMutation();
  const [removeChatRoom] = useLazyRemoveChatRoomQuery();
  const [removeChatMsg] = useLazyRemoveChatMessageQuery();
  const { addToast } = useToast();

  const { id: prodNo } = useParams();

  const ws = useRef(null);
  const textareaRef = useRef(null);
  const roomDeleteModalRef = useRef(null);
  const msgDeleteModalRef = useRef(null);
  const finishModalRef = useRef(null);

  const [target, setTarget] = useState(null);
  const [deleteRoomTarget, setDeleteRoomTarget] = useState(null);
  const [deleteMsgTarget, setDeleteMsgTarget] = useState(null);
  const [msg, setMsg] = useState('');
  const [chatRoomInfos, setChatRoomInfos] = useState([]);
  const [chatInfo, setChatInfo] = useState({});

  const userNo = useSelector(selectUserNo);

  // ================================ api handlers
  const getChatRoomListHandler = async () => {
    try {
      const { chatRoomInfos, schPage } = await getChatRoomList({
        // TODO: get userNo from sessionSlice
        userNo: userNo,
        currentPage: 1,
        recordCount: 100,
      }).unwrap();
      setChatRoomInfos(chatRoomInfos);

      if (chatRoomInfos[0]) {
        getChatRoomHandler(chatRoomInfos[0]);
      }
      if (prodNo && userNo) {
        addChatRoomHandler(prodNo, userNo);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addChatRoomHandler = async (prodNo, userNo) => {
    try {
      const res = await addChatRoom({
        prodNo: prodNo,
        userNo: userNo,
      }).unwrap();
      // chatNo: 57, prodNo: 225, userNo: 120, tgUserNo: 120
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

  // ================================ websocket
  const send = () => {
    if (!msg) {
      textareaRef.current.focus();
      addToast({
        isToastSuccess: false,
        isMainTheme: true,
        toastMessage: '메시지를 입력해 주세요.',
      });
      return;
    }

    ws.current = new WebSocket(`ws://${URL}/socket/chat`);
    ws.current.onmessage = (message) => {
      const parsedData = JSON.parse(message.data);
      console.log('message: ', parsedData);
    };

    const data = JSON.stringify({
      userNo: target.userNo,
      chatNo: target.chatNo,
      msg,
      date: new Date().toLocaleString(),
    });

    if (ws.current.readyState === 0) {
      ws.current.onopen = () => {
        ws.current.send(data);
      };
    } else {
      ws.current.send(data);
    }

    setMsg('');
  };

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
        prodNo={chatInfo?.chatRoomInfo?.prodNo}
        userNo={chatInfo?.chatRoomInfo?.userNo}
      />
      <Wrapper>
        <ChatList>
          <FlexBox>
            <AiFillWechat size={32} color={PRIMARY_COLOR} />
            <Header>Chat</Header>
          </FlexBox>
          <Body>
            {chatRoomInfos.map((item, i) => (
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
            ))}
          </Body>
        </ChatList>
        <ChatMessage>
          {target ? (
            <>
              <FlexBox>
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
              </FlexBox>
              <Body>
                <ChatContent>
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
                      <Check>
                        {info.checkYn === 'Y' ? '읽음' : '읽지 않음'}
                      </Check>
                      <IconButton
                        onClick={() => [
                          msgDeleteModalRef.current?.showModal(),
                          setDeleteMsgTarget(info.no),
                        ]}
                      >
                        <RiDeleteBinLine size={22} color={GRAY_COLOR} />
                      </IconButton>
                    </Bubble>
                  ))}
                </ChatContent>
              </Body>
              <Form onSubmit={(e) => [e.preventDefault(), send()]}>
                <textarea
                  ref={textareaRef}
                  placeholder='보내기: Ctrl + Enter'
                  onChange={(e) => setMsg(e.target.value)}
                  value={msg}
                  onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && send()}
                />
                <button>
                  <RiSendPlaneFill size={24} color={SECONDARY_COLOR} />
                </button>
              </Form>
            </>
          ) : (
            <h1>채팅을 시작하세요</h1>
          )}
        </ChatMessage>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  margin: 16px;
  height: calc(100% - 32px);
  background-color: white;
  box-shadow: 3px 3px 30px ${GRAY_COLOR};
  border-radius: 16px;
`;

const Header = styled.h3`
  flex: 1;
  font-size: 24px;
  font-weight: bold;
`;

const Body = styled.div`
  padding: 32px;
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 16px;
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  padding: 32px;
  padding-bottom: 4px;
  column-gap: 16px;
`;

// chat
const ChatList = styled.div`
  overflow: auto;
  padding: 16px;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 16px;

  h1 {
    text-align: center;
  }
`;

const ChatContent = styled.div`
  h3 {
    margin-bottom: 16px;
  }
`;

const Bubble = styled.div`
  padding: 16px 0;
  display: flex;
  column-gap: 16px;
  align-items: center;
  justify-content: space-between;

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
