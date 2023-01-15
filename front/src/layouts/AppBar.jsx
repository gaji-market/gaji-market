import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, NavLink, useParams } from 'react-router-dom';

import styled from 'styled-components';

import {
  useGetChatRoomListMutation,
  useAddChatMessageMutation,
  useAddChatRoomMutation,
  useLazyGetChatRoomQuery,
  useLazyGetUserNoQuery,
  useLazyRemoveChatMessageQuery,
  useLazyRemoveChatRoomQuery,
} from 'services/chatApi';

import { selectSession, endSession } from 'store/sessionSlice';

import useToast from 'hooks/toast';

import ToggleSwitch from 'components/common/ToggleSwitch';
import Button from 'components/common/Button';
import Modal from 'components/common/Modal';

import { ReactComponent as GradationLogo } from 'assets/GradationLogo.svg';

import {
  PRIMARY_COLOR,
  GRAY_COLOR,
  PRIMARY_VAR_COLOR,
  DARK_GRAY_COLOR,
  WHITE_COLOR,
} from 'components/common/commonColor';

import { GiHamburgerMenu } from 'react-icons/gi';
import { FaBell, FaUserCircle } from 'react-icons/fa';

export default function AppBar() {
  const { userId, isLoggedIn } = useSelector(selectSession);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { search } = useLocation();
  const { type } = useParams();
  const [getChatRoomList] = useGetChatRoomListMutation();

  const modalRef = useRef(null);
  const searchRef = useRef(null);

  const initToggles = { productSwitch: true, alarm: false, userId: false };
  const [toggles, setToggles] = useState(initToggles);
  const [chatRoomInfos, setChatRoomInfos] = useState([]);

  const keydownHandler = (e) => {
    if (e.key === 'Enter' && searchRef.current.value) {
      navigate(`/search?query=${searchRef.current.value}`);
    }
  };

  const blurHandler = () => {
    setToggles(initToggles);
  };

  const getChatRoomListHandler = async () => {
    try {
      const { chatRoomInfos, schPage } = await getChatRoomList({
        // TODO: get userNo from sessionSlice
        userNo: 1,
        currentPage: 1,
        recordCount: 10,
      }).unwrap();
      setChatRoomInfos(chatRoomInfos);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!location.pathname.includes('/search') && searchRef.current) {
      searchRef.current.value = '';
    }
    if (location.pathname.includes('products')) {
      setToggles((prev) => ({ ...prev, productSwitch: true }));
    } else {
      setToggles((prev) => ({ ...prev, productSwitch: false }));
    }
  }, [location]);

  return (
    <>
      <Modal
        ref={modalRef}
        text='로그아웃 하시겠습니까?'
        leftBtnText='네'
        rightBtnText='아니요'
        confirmHandler={() => {
          dispatch(endSession());
          addToast({
            isToastSuccess: true,
            isMainTheme: true,
            toastMessage: '로그아웃 되었습니다.',
          });
        }}
      />

      <StyledWrapper className='fade-in'>
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
          {toggles.productSwitch && (
            <ToggleSwitch
              defaultValue={type === 'pal'}
              on={{
                name: '팔래요',
                handler: () => navigate(`products/pal${search}`),
              }}
              off={{
                name: '살래요',
                handler: () => navigate(`products/sal${search}`),
              }}
            />
          )}
          <Search
            type='search'
            ref={searchRef}
            placeholder='상품명을 입력하세요'
            onKeyDown={keydownHandler}
          />
          {isLoggedIn ? (
            <>
              {(toggles.alarm || toggles.userId) && (
                <BlurContainer onClick={blurHandler} />
              )}
              <Alarm aria-expanded={toggles.alarm}>
                <Toggle
                  onClick={() => [
                    getChatRoomListHandler(),
                    setToggles((prev) => ({ ...prev, alarm: !prev.alarm })),
                  ]}
                >
                  <FaBell size={24} color={PRIMARY_COLOR} />
                </Toggle>
                {toggles.alarm && (
                  <AlarmContainer id='app-alarm-container'>
                    <NavLink to='/chat'>CHAT PAGE</NavLink>
                    {chatRoomInfos.map((item, idx) => (
                      <ChatItem key={idx}>
                        <span>{item.nickname}</span>
                        <span>{item.lastMessage}</span>
                        <span>{item.regDate}</span>
                        <span>{item.regTime}</span>
                      </ChatItem>
                    ))}
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
                  <span>{userId || ''}</span>
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
                        modalRef.current?.showModal(),
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
              <Button
                size='sm'
                padding='0'
                height='32px'
                isOutline
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
              <Button
                size='sm'
                padding='0'
                height='32px'
                onClick={() => navigate('/signup')}
              >
                회원가입
              </Button>
            </>
          )}
        </ItemGroup>
      </StyledWrapper>
      <Spacer />
    </>
  );
}

const menubarHandler = () => {
  const $sideBar = document.getElementById('side-bar-container');
  if ($sideBar) {
    $sideBar.ariaExpanded = $sideBar.ariaExpanded === 'true' ? 'false' : 'true';
  }
};

const Spacer = styled.div`
  height: 56px;
`;

const StyledWrapper = styled.div`
  position: fixed;
  width: 100vw;
  top: 0;
  z-index: 10000000;
  display: flex;
  column-gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  height: 56px;
  box-sizing: border-box;
  border-bottom: 2px solid ${PRIMARY_COLOR};
  background-color: ${WHITE_COLOR};
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

  a {
    display: block;
    height: 48px; // temp
  }
`;

const ChatItem = styled.div`
  display: flex;
  height: 36px;

  span {
    flex: 1;
  }
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
