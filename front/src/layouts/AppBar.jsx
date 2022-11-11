import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ToggleSwitch from 'components/common/ToggleSwitch';

import { PRIMARY_COLOR } from 'components/common/commonColor';

import { GiHamburgerMenu } from 'react-icons/gi';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';

export default function AppBar() {
  // TODO: ADD LOGIC
  const isLoggedIn = true;

  const navigate = useNavigate();

  return (
    <StyledWrapper>
      <ItemGroup>
        <MenuBtn onClick={menubarHandler}>
          <GiHamburgerMenu size={24} color={PRIMARY_COLOR} />
        </MenuBtn>
        <span>LOGO</span>
      </ItemGroup>
      <ItemGroup>
        <Search type='search' />
        <ToggleSwitch
          on={{ name: '살래요', handler: () => navigate('products/sal') }}
          off={{ name: '팔래요', handler: () => navigate('products/pal') }}
        />
        {isLoggedIn ? (
          <>
            <FaBell size={24} color={PRIMARY_COLOR} />
            <FaUserCircle size={24} color={PRIMARY_COLOR} />
            <span>UserID</span>
          </>
        ) : (
          <>
            <span>로그인</span>
            <span>회원가입</span>
          </>
        )}
        <TempNavigation>
          <summary>
            <FiMoreHorizontal size={24} color={PRIMARY_COLOR} />
          </summary>
          <div>
            <NavLink to='/'>HOME</NavLink>
            <NavLink to='/test'>TEST</NavLink>
            <NavLink to='/test/slice'>STORE</NavLink>
            <NavLink to='/login'>Login</NavLink>
            <NavLink to='/SignUp'>SignUp</NavLink>
          </div>
        </TempNavigation>
      </ItemGroup>
    </StyledWrapper>
  );
}

const menubarHandler = () => {
  console.log('test');
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

const TempNavigation = styled.details`
  z-index: 1000;
  position: relative;
  summary {
    list-style: none;
  }

  > div {
    position: absolute;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    padding: 16px;
    right: 0;
    border: 1px solid ${PRIMARY_COLOR};
    border-radius: 8px;
    background-color: white;
  }
`;
