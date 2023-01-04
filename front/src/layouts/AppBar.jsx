import { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import styled from 'styled-components';

import ToggleSwitch from 'components/common/ToggleSwitch';
import Button from 'components/common/Button';

import { ReactComponent as GradationLogo } from 'assets/GradationLogo.svg';

import {
  PRIMARY_COLOR,
  GRAY_COLOR,
  PRIMARY_VAR_COLOR,
  DARK_GRAY_COLOR,
} from 'components/common/commonColor';

import { GiHamburgerMenu } from 'react-icons/gi';
import { FaBell, FaUserCircle } from 'react-icons/fa';

export default function AppBar() {
  const navigate = useNavigate();
  const { search } = useLocation();

  // TODO: ADD LOGIC
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const initToggles = { alarm: false, userId: false };
  const [toggles, setToggles] = useState(initToggles);

  const blurHandler = () => {
    setToggles(initToggles);
  };

  return (
    <StyledWrapper>
      <ItemGroup>
        <MenuBtn onClick={menubarHandler}>
          <GiHamburgerMenu size={24} color={PRIMARY_COLOR} />
        </MenuBtn>
        <GradationLogo
          height='60px'
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </ItemGroup>
      <ItemGroup>
        <Search type='search' />
        <ToggleSwitch
          on={{
            name: '살래요',
            handler: () => navigate(`products/sal${search}`),
          }}
          off={{
            name: '팔래요',
            handler: () => navigate(`products/pal${search}`),
          }}
        />
        {isLoggedIn ? (
          <>
            {Object.values(toggles).includes(true) && (
              <BlurContainer onClick={blurHandler} />
            )}
            <Alarm aria-expanded={toggles.alarm}>
              <Toggle
                onClick={() =>
                  setToggles((prev) => ({ ...prev, alarm: !prev.alarm }))
                }
              >
                <FaBell size={24} color={PRIMARY_COLOR} />
              </Toggle>
              {toggles.alarm && (
                <AlarmContainer id='app-alarm-container'>
                  <h1>TEST</h1>
                </AlarmContainer>
              )}
            </Alarm>
            <UserItem>
              <Toggle
                onClick={() =>
                  setToggles((prev) => ({ ...prev, userId: !prev.userId }))
                }
              >
                <FaUserCircle size={24} color={GRAY_COLOR} />
                <span>UserID</span>
              </Toggle>
              {toggles.userId && (
                <UserIdDropdown>
                  <DropdownItem
                    onClick={() => [
                      navigate('/mypage'),
                      setToggles(initToggles),
                    ]}
                  >
                    마이페이지
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => [
                      console.log('logout'),
                      setToggles(initToggles),
                    ]}
                  >
                    로그아웃
                  </DropdownItem>
                </UserIdDropdown>
              )}
            </UserItem>
          </>
        ) : (
          <>
            <Button size='sm' isOutline onClick={() => navigate('/login')}>
              로그인
            </Button>
            <Button size='sm' onClick={() => navigate('/signup')}>
              회원가입
            </Button>
          </>
        )}
        <TestToggle onClick={() => setIsLoggedIn((prev) => !prev)}>
          test
        </TestToggle>
      </ItemGroup>
    </StyledWrapper>
  );
}

const menubarHandler = () => {
  const $sideBar = document.getElementById('side-bar-container');
  if ($sideBar) {
    $sideBar.ariaExpanded = $sideBar.ariaExpanded === 'true' ? 'false' : 'true';
  }
};

const StyledWrapper = styled.div`
  display: flex;
  column-gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  height: 56px;
  box-sizing: border-box;
  border-bottom: 2px solid ${PRIMARY_COLOR};
`;

const ItemGroup = styled.div`
  display: flex;
  column-gap: 16px;
  align-items: center;
`;

const MenuBtn = styled.button`
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
  }
`;

const Search = styled.input`
  width: 240px;
  height: 32px;
  border-radius: 16px;
  padding: 0 8px 0 16px;
  border: 1px solid ${PRIMARY_COLOR};
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;

  &:hover {
    cursor: pointer;
  }
`;

const Alarm = styled.div`
  position: relative;
`;

const AlarmContainer = styled.div`
  z-index: 100000;
  position: absolute;
  width: 480px;
  height: 720px;
  top: 40px;
  right: -16px;
  border-radius: 4px;
  border: 1px solid ${PRIMARY_VAR_COLOR};
  background-color: white;
  box-shadow: 2px 2px 4px ${GRAY_COLOR};
  padding: 16px;
`;

const BlurContainer = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const UserItem = styled.div`
  span {
    color: ${DARK_GRAY_COLOR};
  }
`;

const UserIdDropdown = styled.div`
  z-index: 100000;
  position: fixed;
  width: 160px;
  top: 56px;
  right: 4px;
  border: 1px solid ${PRIMARY_VAR_COLOR};
  background-color: white;
  box-shadow: 2px 2px 4px ${GRAY_COLOR};
  border-radius: 8px;
`;

const DropdownItem = styled.li`
  list-style-type: none;
  height: 52px;
  display: flex;
  align-items: center;
  width: 100%;
  text-align: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: ${PRIMARY_VAR_COLOR};
  }
`;

const TestToggle = styled.div`
  color: white;
`;
