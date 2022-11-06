import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { PRIMARY_COLOR } from 'components/common/commonColor';
import { AiOutlineClose } from 'react-icons/ai';

export default function SideBar() {
  const sideBarRef = useRef(null);
  const [[focusedFirst, focusedSecond], setFocusedItems] = useState([
    null,
    null,
  ]);
  const [secondItems, setSecondItems] = useState(null);
  const [thirdItems, setThirdItems] = useState(null);

  const sideBarHandler = () => {
    if (sideBarRef) {
      sideBarRef.current.ariaExpanded = 'false';
      setFocusedItems([null, null]);
      setSecondItems(null);
      setThirdItems(null);
    }
  };

  const setSecond = (id, thirdNull) => {
    if (thirdNull) {
      setThirdItems(null);
    }
    setFocusedItems(([_, sec]) => [id, sec]);
    setSecondItems(
      Array.from(new Array(10)).map((_, i) => (
        <CategoryItem
          key={`${id}_second_${i}`}
          className={focusedSecond === `${id}_second_${i}` ? 'highlight' : ''}
          onMouseEnter={() => setThird(`${id}_second_${i}`)}
        >
          second_{i}
        </CategoryItem>
      )),
    );
  };

  const setThird = (id) => {
    setFocusedItems(([fir, _]) => [fir, id]);
    setThirdItems(
      Array.from(new Array(10)).map((_, i) => (
        <CategoryItem
          key={`${id}_third_${i}`}
          onClick={() => console.log(`${id}_third_${i}`)}
        >
          third_{i}
        </CategoryItem>
      )),
    );
  };

  useEffect(() => {
    if (focusedSecond) {
      setSecond(focusedFirst);
    }
  }, [focusedSecond]);

  return (
    <Wrapper id='side-bar-container' aria-expanded={false} ref={sideBarRef}>
      <LeftBar>
        <Header>
          <h2>카테고리</h2>
          <AiOutlineClose color={PRIMARY_COLOR} onClick={sideBarHandler} />
        </Header>
        <Body>
          {Array.from(new Array(10)).map((_, i) => (
            <CategoryItem
              key={`first_${i}`}
              className={focusedFirst === `first_${i}` ? 'highlight' : ''}
              onMouseEnter={() => setSecond(`first_${i}`, true)}
            >
              first_{i}
            </CategoryItem>
          ))}
        </Body>
      </LeftBar>
      {secondItems && <ExpandedLeftBar>{secondItems}</ExpandedLeftBar>}
      {thirdItems && <ExpandedLeftBar>{thirdItems}</ExpandedLeftBar>}
      <div></div>
      <Background onClick={sideBarHandler} />
    </Wrapper>
  );
}

function Category({ type, setter }) {
  const [focused, setFocused] = useState(null);

  const childrenHandler = (id) => {
    setFocused(id);
    setter && setter(id);
  };

  return Array.from(new Array(10)).map((_, i) => (
    <CategoryItem
      key={`${type}_${i}`}
      className={focused === `${type}_${i}` ? 'highlight' : ''}
      onMouseEnter={() => childrenHandler(`${type}_${i}`)}
    >
      {type}_{i}
    </CategoryItem>
  ));
}

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

    aside {
      min-width: 0;
    }
    div,
    li {
      opacity: 0;
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
