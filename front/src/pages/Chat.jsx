import React from 'react';
import styled from 'styled-components';

import { PRIMARY_VAR_COLOR } from 'components/common/commonColor';
import { css } from 'styled-components';

export default function Chat() {
  return (
    <FlexBox colGap='8px' padding='8px'>
      <Container width='480px'>
        <Header>
          <h3>Chat</h3>
        </Header>
        <Body>
          <ChatRoomItem>
            <FlexBox xCenter={true} yCenter={true} padding='8px'>
              <span>IMAGE</span>
            </FlexBox>
            <ChatContent>
              <div>
                <span>AVATAR</span>
                <span>USER_ID</span>
              </div>
              <span>last message</span>
            </ChatContent>
            <FlexBox xCenter={true} yCenter={true} padding='8px'>
              <span>2022-11-11</span>
            </FlexBox>
          </ChatRoomItem>
        </Body>
        <FlexBox direction='column'>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
        </FlexBox>
      </Container>
      <Container>TEST</Container>
    </FlexBox>
  );
}

const FlexBox = styled.div`
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  row-gap: ${({ rowGap }) => rowGap || 0};
  column-gap: ${({ colGap }) => colGap || 0};
  margin: ${(margin) => margin || 0};
  padding: ${(padding) => padding || 0};

  ${(xCenter) =>
    xCenter &&
    css`
      justify-content: center;
    `};
  ${(yCenter) =>
    yCenter &&
    css`
      align-items: center;
    `};
`;

const Container = styled.div`
  background-color: ${PRIMARY_VAR_COLOR};
  flex: 1;
  max-width: ${(width) => width || 'fit-content'};
  height: 100%;
  border-radius: 4px;
`;

const Header = styled.div``;

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

const ChatRoomItem = styled.div`
  background-color: pink;
  display: flex;
  justify-content: space-around;
`;

const ProductImg = styled.div`
  border: 1px solid gray;
  width: 48px;
  height: 48px;
`;

const ChatContent = styled.div`
  flex: 1;
  background-color: orange;
  display: flex;
  flex-direction: column;

  div,
  span {
    flex: 1;
  }
`;

const LastMsgTime = styled.div``;
