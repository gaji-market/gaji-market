import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ToggleSwitch from 'components/common/ToggleSwitch';

import { PRIMARY_COLOR } from 'components/common/commonColor';

import { GiHamburgerMenu } from 'react-icons/gi';
import { HiBellAlert } from 'react-icons/hi2';
import { HiUserCircle } from 'react-icons/hi2';
import { FiMoreHorizontal } from 'react-icons/fi';

export default function AppBar() {
  // TODO: ADD LOGIC
  const isLoggedIn = true;

  const navigate = useNavigate();

  return (
    <StyledWrapper>
      <ItemGroup>
        <GiHamburgerMenu size={24} color='var(--color-primary)' />
        <span>LOGO</span>
      </ItemGroup>
      <ItemGroup>
        <Search type='search' />
        <ToggleSwitch
          on={{ name: '살래요', handler: () => navigate('/sal') }}
          off={{ name: '팔래요', handler: () => navigate('/pal') }}
        />

        {isLoggedIn ? (
          <>
            <HiBellAlert size={24} color='var(--color-primary)' />
            <HiUserCircle size={24} color='var(--color-primary)' />
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
            <FiMoreHorizontal size={24} color='var(--color-primary)' />
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

const Search = styled.input`
  width: 240px;
  height: 32px;
  border-radius: 16px;
  padding: 0 8px 0 16px;
  border: 1px solid ${PRIMARY_COLOR};
`;

const TempNavigation = styled.details`
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
