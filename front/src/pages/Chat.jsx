import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import useToast from 'hooks/toast';

import styled, { css } from 'styled-components';
//import io from 'socket.io-client';

import { RiDeleteBinLine } from 'react-icons/ri';

import {
  useGetChatRoomListMutation,
  useAddChatMessageMutation,
  useAddChatRoomMutation,
  useLazyGetChatRoomQuery,
  useLazyGetUserNoQuery,
  useLazyRemoveChatMessageQuery,
  useLazyRemoveChatRoomQuery,
} from 'services/chatApi';

import { selectUserNo } from 'store/sessionSlice';

import Modal from 'components/common/Modal';

import {
  DARK_GRAY_COLOR,
  GRAY_COLOR,
  PRIMARY_COLOR,
  PRIMARY_VAR_COLOR,
  WHITE_COLOR,
} from 'components/common/commonColor';

const TEMP_SERVER_URL = 'http://localhost:8080';

export default function Chat() {
  const [getChatRoomList] = useGetChatRoomListMutation();
  const [getChatRoom] = useLazyGetChatRoomQuery();
  const [addChatRoom] = useAddChatRoomMutation();
  const [removeChatRoom] = useLazyRemoveChatRoomQuery();
  const { addToast } = useToast();
  // const socket = io.connect(TEMP_SERVER_URL);

  const { id: prodNo } = useParams();

  const modalRef = useRef(null);

  const [target, setTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatRoomInfos, setChatRoomInfos] = useState([]);

  const userNo = useSelector(selectUserNo);

  const getChatRoomListHandler = async () => {
    try {
      const { chatRoomInfos, schPage } = await getChatRoomList({
        // TODO: get userNo from sessionSlice
        userNo: 1,
        currentPage: 1,
        recordCount: 10,
      }).unwrap();
      console.log(chatRoomInfos);
      setChatRoomInfos(chatRoomInfos);
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
      setMessages(infos.chatMessageInfos || []);
    } catch (err) {
      console.log(err);
    } finally {
      setTarget({ id: `${item.userNo}_${item.chatNo}`, ...item });
      setMsg('');
    }
  };

  const addChatRoomHandler = async (prodNo, userNo) => {
    try {
      const res = await addChatRoom({
        prodNo: prodNo,
        userNo: 120,
      }).unwrap();

      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const removeChatRoomHandler = async () => {
    try {
      await removeChatRoom(deleteTarget).unwrap();
      getChatRoomListHandler();

      addToast({
        isToastSuccess: true,
        isMainTheme: true,
        toastMessage: '채팅방이 삭제 되었습니다.',
      });
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const changeHandler = (e) => {
    setMsg(e.target.value);
  };

  const keydownHandler = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      // socket.emit('chat', { id: targetId, msg, time: new Date() });
      setMsg('');
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // socket.emit('chat', { id: targetId, msg, time: new Date() });
    setMsg('');
  };

  // useEffect(() => {
  //   socket.on('chat', (payload) => {
  //     setMessages((prev) => [...prev, payload]);
  //   });
  // }, []);

  useEffect(() => {
    getChatRoomListHandler();
    if (prodNo && userNo) {
      addChatRoomHandler(prodNo, userNo);
    }
  }, []);

  return (
    <>
      <Modal
        ref={modalRef}
        text='정말 삭제 하시겠습니까?'
        leftBtnText='네'
        rightBtnText='아니요'
        confirmHandler={removeChatRoomHandler}
      />
      <Wrapper>
        <ChatList>
          <Header>Chat</Header>
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
                      modalRef.current?.showModal(),
                      setDeleteTarget(item.chatNo),
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
              <Header>{target.nickname}</Header>
              <Body>
                <ChatContent>
                  {messages.map((info, idx) => (
                    <React.Fragment key={`${info.no}_${idx}`}>
                      <h3>{info.nickname}</h3>
                      <Bubble>
                        <div>{info.message}</div>
                        <span>{info.regDate}</span>
                        <span>{info.regTime}</span>
                        <span>
                          {info.checkYn === 'Y' ? '읽음' : '읽지 않음'}
                        </span>
                      </Bubble>
                    </React.Fragment>
                  ))}
                </ChatContent>
              </Body>
              <Footer>
                <Form onSubmit={submitHandler}>
                  <textarea
                    placeholder='보내기: Ctrl + Enter'
                    onChange={changeHandler}
                    value={msg}
                    onKeyDown={keydownHandler}
                  />
                  <button>보내기</button>
                </Form>
              </Footer>
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
  column-gap: 16px;
`;

const Header = styled.h3`
  padding: 16px;
  font-size: 24px;
  font-weight: bold;
`;

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 16px;
`;

const Footer = styled.div`
  padding: 16px;
  font-size: 24px;
  font-weight: bold;
  position: relative;
  bottom: 0;
`;

// chat
const ChatList = styled.div`
  overflow: auto;
  padding: 16px;
  background-color: ${PRIMARY_VAR_COLOR};
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  width: 480px;
  box-shadow: 1px 1px 2px ${GRAY_COLOR};

  .current {
    border: 2px solid ${PRIMARY_COLOR};
    box-shadow: 2px 2px 2px ${GRAY_COLOR};
  }
`;

const ChatItemWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 8px;
  background: ${WHITE_COLOR};
  border-radius: 8px;
  border: 2px solid ${WHITE_COLOR};
  &:hover {
    cursor: pointer;
    border-color: ${PRIMARY_COLOR};
  }
`;

const ChatItem = styled.div`
  display: flex;
  justify-content: space-around;
  flex: 1;
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

const IconButton = styled.div`
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
`;

// message
const LastMsg = styled.div`
  color: ${DARK_GRAY_COLOR};
  margin-top: 8px;
  height: 16px;
  /* margin-left: 32px; */
  /* height: 50%; */
`;

// right - chat message
const ChatMessage = styled.div`
  background-color: #f6f6f6;
  flex: 1;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 2px ${GRAY_COLOR};
  justify-content: center;

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
  display: flex;
  column-gap: 24px;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 4px;
  background-color: ${PRIMARY_VAR_COLOR};

  h3 {
  }

  div {
    flex: 1;
  }
`;

const Form = styled.form`
  display: flex;
  column-gap: 24px;

  textarea {
    flex: 1;
    height: 48px;
  }
`;
