import React, { useState } from 'react';
import styled from 'styled-components';

import { PRIMARY_VAR_COLOR, WHITE_COLOR } from 'components/common/commonColor';
import { css } from 'styled-components';

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(TEMP_LIST_ITEMS[0].username);

  return (
    <Wrapper>
      <ChatList>
        <Header>Chat</Header>
        <Body>
          {TEMP_LIST_ITEMS.map((item, i) => (
            <ChatItem
              key={item.username}
              className={selectedChat === item.username ? 'current' : ''}
              onClick={() => setSelectedChat(item.username)}
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
        <Body>BODY</Body>
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
  flex-direction: column;
  row-gap: 16px;
`;

// chat
const ChatList = styled.div`
  padding: 16px;
  background-color: #eeeeee;
  height: 100%;
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
`;
