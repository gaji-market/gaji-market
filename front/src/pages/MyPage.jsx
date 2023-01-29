import { PRIMARY_COLOR } from 'components/common/commonColor';
import styled from 'styled-components';
import basicLogo from 'assets/BasicLogo.svg';
import StarRate from 'components/common/StarRate';
import Button from 'components/common/Button';
import { usePostUserMyPageMutation } from 'services/signUpApi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MyPageCard from 'components/Mypage/MyPageCard';
import Loading from 'components/common/Loading';
const TITLE = ['좋아요 목록', '구매 목록', '판매 목록'];
export default function MyPage() {
  const [cardData, setCardData] = useState();
  const [getMyPage, { isLoading }] = usePostUserMyPageMutation();
  const nav = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [isFirst, setIsFirst] = useState(true);
  async function getUserData() {
    try {
      const res = await getMyPage().unwrap();
      setUserInfo(res.userInfo);
      setCardData([
        [res.interestProdList, res.interestProdListCnt, 'interest'],
        [res.buyProdList, res.buyProdListCnt, 'buyProduct'],
        [res.sellProdList, res.sellProdListCnt, 'sellProduct'],
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
              닉네임: {userInfo?.userNickName}
            </TextBox>
            <TextBox>주소: {userInfo?.userAddress}</TextBox>
            <TextBox>
              <StarRate vote_average={3} width={'20'}>
                매너지수:
              </StarRate>
            </TextBox>
          </RightSection>
        </UserInfoBox>
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
      </TopSection>

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
  border: 3px solid ${PRIMARY_COLOR};
  border-radius: 30px;
  width: 35%;
  display: flex;
  padding: 15px 0px;
`;
const LeftSection = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 100px;
  margin-left: 10px;
  margin-right: 10px;
`;
const RightSection = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const TextBox = styled.div`
  margin-bottom: ${({ marginBottom }) => marginBottom};
`;
const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
