import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PRIMARY_COLOR } from 'components/common/commonColor';
import { AiOutlineClose } from 'react-icons/ai';

import { useGetCategoriesQuery } from 'services/productApi';

export default function SideBar() {
  const navigate = useNavigate();
  const sideBarRef = useRef(null);
  const [focusFirst, setFocusFirst] = useState(null);
  const [focusSecond, setFocusSecond] = useState(null);
  const [focusThird, setFocusThird] = useState(null);

  const { data: categories = { categoryInfos: [] } } = useGetCategoriesQuery();

  // filtering
  const firstCategories = categories.categoryInfos.filter(
    (cat) => cat.tier === 1,
  );
  const secondCategories = categories.categoryInfos.filter(
    (cat) => cat.tier === 2 && cat.cateParent === focusFirst,
  );
  const thirdCategories = categories.categoryInfos.filter(
    (cat) => cat.tier === 3 && cat.cateParent === focusSecond,
  );

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
        <Body onMouseEnter={() => setFocusThird(null)}>
          <CategoryItemGroup items={firstCategories} setter={setFocusFirst} />
          <Spacer
            onMouseEnter={() => [
              setFocusFirst(null),
              setFocusSecond(null),
              setFocusThird(null),
            ]}
          />
        </Body>
      </LeftBar>
      {focusFirst && secondCategories.length > 0 && (
        <ExpandedLeftBar className='expanded-bar'>
          <CategoryItemGroup
            items={secondCategories}
            focused={focusSecond}
            setter={setFocusSecond}
            navigator={() => {
              if (thirdCategories.length === 0) {
                navigate(`products/pal?category=${focusSecond}`);
                sideBarHandler();
              }
            }}
          />
          <Spacer
            onMouseEnter={() => [setFocusSecond(null), setFocusThird(null)]}
          />
        </ExpandedLeftBar>
      )}
      {focusSecond && thirdCategories.length > 0 && (
        <ExpandedLeftBar className='expanded-bar'>
          <CategoryItemGroup
            items={thirdCategories}
            focused={focusThird}
            setter={setFocusThird}
            navigator={() => [
              navigate(`products/pal?category=${focusThird}`),
              sideBarHandler(),
            ]}
          />
          <Spacer onMouseEnter={() => setFocusThird(null)} />
        </ExpandedLeftBar>
      )}
      <Background
        onClick={sideBarHandler}
        onMouseEnter={() => [
          setFocusFirst(null),
          setFocusSecond(null),
          setFocusThird(null),
        ]}
      />
    </Wrapper>
  );
}

const CategoryItemGroup = ({
  focused,
  setter,
  items = [],
  navigator = () => {},
}) => {
  return items.map((item, i) => (
    <CategoryItem
      key={item.cateCode}
      className={focused === item.cateCode ? 'highlight' : ''}
      onMouseEnter={() => setter(item.cateCode)}
      onClick={navigator}
    >
      {item.cateName}
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
  display: flex;
  flex-direction: column;
  margin-top: 56px;
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
  display: flex;
  flex-direction: column;
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

const Spacer = styled.div`
  flex: 1;
`;
