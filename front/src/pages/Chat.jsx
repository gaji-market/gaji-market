import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { PRIMARY_VAR_COLOR, WHITE_COLOR } from 'components/common/commonColor';
import { css } from 'styled-components';

import io from 'socket.io-client';

const TEMP_SERVER_URL = 'http://localhost:8080';

export default function Chat() {
  const socket = io.connect(TEMP_SERVER_URL);

  const [targetId, setTargetId] = useState(TEMP_LIST_ITEMS[0].username);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat', (payload) => {
      setMessages((prev) => [...prev, payload]);
    });
  }, []);

  const changeHandler = (e) => {
    setMsg(e.target.value);
  };

  const keydownHandler = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      socket.emit('chat', { id: targetId, msg, time: new Date() });
      setMsg('');
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit('chat', { id: targetId, msg, time: new Date() });
    setMsg('');
  };

  return (
    <Wrapper>
      <ChatList>
        <Header>Chat</Header>
        <Body>
          {TEMP_LIST_ITEMS.map((item, i) => (
            <ChatItem
              key={item.username}
              className={targetId === item.username ? 'current' : ''}
              onClick={() => [
                setTargetId(item.username),
                setMessages([]),
                setMsg(''),
              ]}
            >
              <Box padding='8px' center='true'>
                <ProductImg>
                  {item.product && <img src={item.product} alt='product.jpg' />}
                </ProductImg>
              </Box>
              <Box padding='8px' fill='true'>
                <UserInfo>
                  <Avatar>
                    {item.avatar && <img src={item.avatar} alt='avatar.jpg' />}
                  </Avatar>
                  <Username>{item.username}</Username>
                </UserInfo>
                <LastMsg>{item.lastMsg}</LastMsg>
              </Box>
              <Box padding='8px' center='true'>
                <UpdatedTime>{item.updatedAt}</UpdatedTime>
              </Box>
            </ChatItem>
          ))}
        </Body>
      </ChatList>
      <ChatMessage>
        <Header>TITLE</Header>
        <Body>
          <ChatContent>
            {messages.map(({ id, msg, time }, index) => (
              <Bubble key={index}>
                <h3>{id}</h3>
                <div>{msg}</div>
                <span>{time}</span>
              </Bubble>
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
      </ChatMessage>
    </Wrapper>
  );
}

const TEMP_LIST_ITEMS = [
  {
    product: null,
    avatar: null,
    username: 'user1',
    unread: 0,
    lastMsg: 'hello, there',
    updatedAt: '6:29 PM',
  },
  {
    product: null,
    avatar: null,
    username: 'user2',
    unread: 0,
    lastMsg: 'hello, there',
    updatedAt: '6:29 PM',
  },
  {
    product: null,
    avatar: null,
    username: 'user3',
    unread: 0,
    lastMsg: 'hello, there',
    updatedAt: '6:29 PM',
  },
  {
    product: null,
    avatar: null,
    username: 'user4',
    unread: 0,
    lastMsg: 'hello, there',
    updatedAt: '6:29 PM',
  },
  {
    product: null,
    avatar: null,
    username: 'user5',
    unread: 0,
    lastMsg: 'hello, there',
    updatedAt: '6:29 PM',
  },
];

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
  padding: 16px;
  background-color: #eeeeee;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  width: 480px;

  .current {
    background-color: ${PRIMARY_VAR_COLOR};
  }
`;

const ChatItem = styled.div`
  display: flex;
  justify-content: space-around;
  background: ${WHITE_COLOR};
  border-radius: 8px;
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

//product
const ProductImg = styled.div`
  border: 1px solid gray;
  width: 48px;
  height: 48px;
`;

// userinfo
const UserInfo = styled.div`
  display: flex;
  column-gap: 8px;
  align-items: center;

  div:last-child {
    flex: 1;
  }
`;

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 24px;
  background-color: lightgray;
`;

const Username = styled.div`
  font-weight: bold;
`;

// message
const LastMsg = styled.div`
  margin-top: 8px;
  height: 50%;
`;

const UpdatedTime = styled.div`
  color: gray;
`;

// right - chat message
const ChatMessage = styled.div`
  background-color: #eeeeee;
  flex: 1;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const ChatContent = styled.div``;

const Bubble = styled.div`
  display: flex;
  column-gap: 24px;
  justify-content: space-between;
  margin-bottom: 16px;

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
