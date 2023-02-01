import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import basicLogo from 'assets/BasicLogo.svg';

import StarRate from 'components/common/StarRate';
import Button from 'components/common/Button';
import MyPageCard from 'components/Mypage/MyPageCard';
import Loading from 'components/common/Loading';

import { usePostUserMyPageMutation } from 'services/signUpApi';

const TITLE = ['좋아요 목록', '구매 목록', '판매 목록'];

export default function MyPage() {
  const [userInfo, setUserInfo] = useState({});
  const [isFirst, setIsFirst] = useState(true);
  const [cardData, setCardData] = useState();

  const [getMyPage, { isLoading }] = usePostUserMyPageMutation();

  const nav = useNavigate();

  async function getUserData() {
    try {
      const res = await getMyPage().unwrap();
      setUserInfo(res.userInfo);
      setCardData([
        [res.interestProdList, res.interestProdListCnt, 'interest'],
        [res.buyProdList, res.buyProdListCnt, 'buy'],
        [res.sellProdList, res.sellProdListCnt, 'sell'],
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (isFirst) {
      getUserData();
      setIsFirst(false);
    }
    getUserData();
  }, [isFirst]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Container>
      <TopSection>
        <UserInfoBox>
          <LeftSection
            src={
              userInfo?.dbFileName
                ? `${process.env.REACT_APP_IMG_PREFIX_URL}${userInfo.dbFileName}`
                : basicLogo
            }
          ></LeftSection>
          <RightSection>
            <TextBox marginBottom={'15px'}>
              닉네임: <span> {userInfo?.userNickName}</span>
            </TextBox>
            <TextBox>
              주소:
              <span>
                {userInfo?.userAddress?.split(' ').slice(0, 3).join(' ')}
              </span>
            </TextBox>
            <TextBox>
              <StarRate vote_average={3} width={'15'}>
                매너지수:
              </StarRate>
            </TextBox>
          </RightSection>

          <ButtonWrapper>
            <Button
              customSize='250px'
              onClick={() => {
                nav('edit', { state: userInfo });
              }}
            >
              내 정보 설정
            </Button>
            <Button isOutline={true} customSize='250px'>
              알람 설정
            </Button>
          </ButtonWrapper>
        </UserInfoBox>
      </TopSection>
      <DividingLine />
      {cardData?.map((card, i) => {
        return (
          <MyPageCard
            key={i}
            title={TITLE[i]}
            cardList={card[0]}
            totalCount={card[1]}
            detail={card[2]}
          />
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  padding: 15px 90px;
`;

const UserInfoBox = styled.div`
  width: 100%;
  border-radius: 10px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  align-items: center;
`;

const LeftSection = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 200px;
  margin-right: 25px;
`;

const RightSection = styled.div`
  width: 60%;
  display: flex;
  padding-top: 10px;
  gap: 10px;
  flex-direction: column;
`;

const TextBox = styled.div`
  font-weight: 900;

  > span {
    font-weight: 500;
  }
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonWrapper = styled.div`
  width: 200px;
  display: flex;
  flex-grow: 1;
  gap: 10px;
  position: relative;
  justify-content: flex-end;
  flex-wrap: wrap;

  button {
    width: 150px;
  }
`;

const DividingLine = styled.div`
  width: 100%;
  border-bottom: 1px solid #eee;
  padding-top: 15px;
  margin-bottom: 35px;
`;
