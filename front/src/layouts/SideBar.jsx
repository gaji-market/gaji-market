import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PRIMARY_COLOR } from 'components/common/commonColor';
import { AiOutlineClose } from 'react-icons/ai';

export default function SideBar() {
  const navigate = useNavigate();
  const sideBarRef = useRef(null);
  const [focusFirst, setFocusFirst] = useState(null);
  const [focusSecond, setFocusSecond] = useState(null);
  const [focusThird, setFocusThird] = useState(null);

  const sideBarHandler = () => {
    if (sideBarRef) {
      sideBarRef.current.ariaExpanded =
        sideBarRef.current.ariaExpanded === 'true' ? 'false' : 'true';
      setFocusFirst(null);
      setFocusSecond(null);
      setFocusThird(null);
    }
  };

  return (
    <Wrapper id='side-bar-container' aria-expanded={false} ref={sideBarRef}>
      <LeftBar>
        <Header>
          <h2>카테고리</h2>
          <AiOutlineClose color={PRIMARY_COLOR} onClick={sideBarHandler} />
        </Header>
        <Body>
          <CategoryItemGroup
            type='first'
            focused={focusFirst}
            setter={setFocusFirst}
          />
        </Body>
      </LeftBar>
      {focusFirst && (
        <ExpandedLeftBar className='expanded-bar'>
          <CategoryItemGroup
            type='second'
            parent={focusFirst}
            focused={focusSecond}
            setter={setFocusSecond}
          />
        </ExpandedLeftBar>
      )}
      {focusSecond && (
        <ExpandedLeftBar className='expanded-bar'>
          <CategoryItemGroup
            type='third'
            parent={focusSecond}
            focused={focusThird}
            setter={setFocusThird}
            navigator={() => [
              navigate(
                `products/pal?fisrt=${focusFirst}&second=${focusSecond}&third=${focusThird}`,
              ),
              sideBarHandler(),
            ]}
          />
        </ExpandedLeftBar>
      )}
      <Background onClick={sideBarHandler} />
    </Wrapper>
  );
}

const CategoryItemGroup = ({
  type,
  parent = null,
  focused,
  setter,
  navigator = () => {},
}) => {
  const prefix = `${parent ? `${parent}_` : ''}${type}`;
  return Array.from(new Array(10)).map((_, i) => (
    <CategoryItem
      key={`${prefix}_${i}`}
      className={focused === `${prefix}_${i}` ? 'highlight' : ''}
      onMouseEnter={() => setter(`${prefix}_${i}`)}
      onClick={navigator}
    >
      {type}_{i}
    </CategoryItem>
  ));
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  z-index: 100;

  &[aria-expanded='false'] {
    width: 0;

    aside,
    .expanded-bar {
      display: none;
    }
  }
`;

const Background = styled.div`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
`;

const LeftBar = styled.aside`
  min-width: 256px;
  height: 100vh;
  background-color: white;
  border-right: 1px solid ${PRIMARY_COLOR};
  z-index: 101;

  display: flex;
  flex-direction: column;

  transition: ease-in-out 0.4s;
`;

const ExpandedLeftBar = styled.div`
  border-right: 1px solid ${PRIMARY_COLOR};
  z-index: 101;
  background-color: white;
  width: 200px;
`;

const Header = styled.div`
  height: 56px;
  padding: 0 16px 0 24px;
  box-sizing: border-box;
  color: ${PRIMARY_COLOR};
  border-bottom: 1px solid ${PRIMARY_COLOR};

  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-weight: bold;
  }
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

const CategoryItem = styled.li`
  list-style: none;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  &:hover {
    cursor: pointer;
    background-color: ${PRIMARY_COLOR};
    color: white;
  }

  &.highlight {
    background-color: ${PRIMARY_COLOR};
    color: white;
  }
`;
