import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import 'react-tooltip/dist/react-tooltip.css';
import styled from 'styled-components';

import {
  useGetCheckCntQuery,
  useGetNotifiListMutation,
  useLazyCheckNotifiQuery,
} from 'services/alarmApi';

import { selectSession, endSession } from 'store/sessionSlice';

import useToast from 'hooks/toast';

import ToggleSwitch from 'components/common/ToggleSwitch';
import CountBadge from 'components/common/CountBadge';
import Button from 'components/common/Button';
import Modal from 'components/common/Modal';

import { ReactComponent as GradationLogo } from 'assets/GradationLogo.svg';

import {
  PRIMARY_COLOR,
  GRAY_COLOR,
  PRIMARY_VAR_COLOR,
  DARK_GRAY_COLOR,
  LIGHT_GRAY_COLOR,
  WHITE_COLOR,
  RED_COLOR,
} from 'components/common/commonColor';

import { GiHamburgerMenu } from 'react-icons/gi';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { AiFillMessage } from 'react-icons/ai';

export default function AppBar() {
  const { userId, userNo, isLoggedIn } = useSelector(selectSession);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { search } = useLocation();
  const { type } = useParams();

  const [getNotiList] = useGetNotifiListMutation();
  const [checkNoti] = useLazyCheckNotifiQuery();
  const { data: counts = { intstCheckCnt: 0, chatCheckCnt: 0 } } =
    useGetCheckCntQuery(userNo, {
      pollingInterval: 5000,
    });

  const modalRef = useRef(null);
  const searchRef = useRef(null);

  const initToggles = { productSwitch: true, alarm: false, userId: false };
  const [toggles, setToggles] = useState(initToggles);
  const [currentTab, setCurrentTab] = useState('채팅');
  const [notificationInfos, setNotificationInfos] = useState([]);
  const [prevCounts, setPrevCounts] = useState(null);

  const keydownHandler = (e) => {
    if (e.key === 'Enter' && searchRef.current.value) {
      navigate(`/search?query=${searchRef.current.value}`);
    }
  };

  const blurHandler = () => {
    setToggles(initToggles);
  };

  const getNotiListHandler = async (tab = '채팅') => {
    try {
      const { notificationInfos } = await getNotiList({
        // TODO: get userNo from sessionSlice
        gubun: tab === '채팅' ? 1 : 2,
        userNo: userNo,
      }).unwrap();
      setNotificationInfos(notificationInfos);
      setPrevCounts(counts);
    } catch (err) {
      console.log(err);
    }
  };

  const checkNotiHandler = async (notiNo) => {
    try {
      await checkNoti(notiNo).unwrap();
    } catch (e) {
      console.log(e);
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

  useEffect(() => {
    if (JSON.stringify(counts) !== JSON.stringify(prevCounts)) {
      getNotiListHandler(currentTab);
    }
  }, [counts]);

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
                    getNotiListHandler(),
                    setToggles((prev) => ({ ...prev, alarm: !prev.alarm })),
                  ]}
                >
                  <FaBell size={24} color={PRIMARY_COLOR} />
                  {counts.intstCheckCnt + counts.chatCheckCnt > 0 && (
                    <CountBadge
                      count={counts.intstCheckCnt + counts.chatCheckCnt}
                      style={{ marginLeft: '-16px' }}
                    />
                  )}
                </Toggle>
                {toggles.alarm && (
                  <AlarmContainer id='app-alarm-container'>
                    <Title>알림</Title>
                    <Tabs>
                      <Tab
                        aria-current={currentTab === '채팅' && 'page'}
                        onClick={() => [
                          setCurrentTab('채팅'),
                          getNotiListHandler(),
                        ]}
                      >
                        <span>채팅</span>
                        {counts.chatCheckCnt > 0 && (
                          <CountBadge
                            count={counts.chatCheckCnt}
                            style={{ marginLeft: '8px' }}
                          />
                        )}
                      </Tab>
                      <Tab
                        aria-current={currentTab === '좋아요' && 'page'}
                        onClick={() => [
                          setCurrentTab('좋아요'),
                          getNotiListHandler('좋아요'),
                        ]}
                      >
                        <span>좋아요</span>
                        {counts.intstCheckCnt > 0 && (
                          <CountBadge
                            count={counts.intstCheckCnt}
                            style={{ marginLeft: '8px' }}
                          />
                        )}
                      </Tab>
                    </Tabs>
                    <AlarmBody>
                      <FloatRight>
                        <span
                          onClick={() => [
                            navigate(
                              currentTab === '채팅' ? '/chat' : '/myPage',
                            ),
                            blurHandler(),
                          ]}
                        >
                          전체보기
                        </span>
                      </FloatRight>
                      {notificationInfos.length === 0 && (
                        <EmptyMsg>알림이 없습니다.</EmptyMsg>
                      )}
                      {notificationInfos.map((item, idx) => (
                        <NotiItem key={idx} aria-checked={item.checkYn === 'Y'}>
                          <div className='strong-text'>{item.message}</div>
                          <div>{item.nickname}</div>
                          <span>{item.regDate.split('T')[0]}</span>
                          <AiFillMessage
                            id={item.notifiNo}
                            className='msg-icon'
                            aria-checked={item.checkYn === 'Y'}
                            color={
                              item.checkYn === 'Y' ? GRAY_COLOR : RED_COLOR
                            }
                            onClick={() =>
                              item.checkYn === 'N' && [
                                checkNotiHandler(item.notifiNo),
                                getNotiListHandler(currentTab),
                              ]
                            }
                          />
                          {item.checkYn === 'N' && (
                            <ReactTooltip
                              anchorId={item.notifiNo}
                              place='top'
                              content='읽음으로 표시'
                            />
                          )}
                        </NotiItem>
                      ))}
                    </AlarmBody>
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
  display: flex;
  flex-direction: column;
  z-index: 100000;
  position: absolute;
  width: 480px;
  height: 720px;
  top: 38px;
  right: -16px;
  border-radius: 8px;
  border: 3px solid ${PRIMARY_COLOR};
  background-color: white;
  box-shadow: 3px 3px 30px ${GRAY_COLOR};
  padding: 16px;

  a {
    display: block;
    height: 48px; // temp
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bolder;
  margin: 16px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px;
`;

const Tab = styled.div`
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  &[aria-current='page'] {
    border-bottom: 4px solid ${PRIMARY_COLOR};
  }

  &:hover {
    cursor: pointer;

    span {
      font-size: 24px;
      color: ${PRIMARY_COLOR};
    }
  }
`;

const AlarmBody = styled.div`
  flex: 1;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
`;

const FloatRight = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 24px;
  margin-bottom: 16px;

  span {
    color: ${PRIMARY_COLOR};
    text-decoration: underline;
    &:hover {
      cursor: pointer;
      font-weight: bold;
    }
  }
`;

const EmptyMsg = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotiItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 16px;
  border-radius: 4px;

  div {
    flex: 1;
    color: ${GRAY_COLOR};
  }

  span {
    color: ${GRAY_COLOR};
  }

  &:hover {
    /* cursor: pointer; */
    /* background-color: ${LIGHT_GRAY_COLOR}; */
  }

  .msg-icon {
    cursor: pointer;
    margin: 0 8px;

    &[aria-checked='true'] {
      cursor: default;
    }
  }

  .strong-text {
    font-weight: bold;
    color: ${DARK_GRAY_COLOR};
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
  top: 53px;
  right: 4px;
  border: 3px solid ${PRIMARY_COLOR};
  background-color: white;
  box-shadow: 3px 3px 30px ${GRAY_COLOR};
  border-radius: 8px;
  overflow: hidden;
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
