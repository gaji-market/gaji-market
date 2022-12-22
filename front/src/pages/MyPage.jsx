import { PRIMARY_COLOR } from 'components/common/commonColor';
import styled from 'styled-components';
import basicLogo from 'assets/BasicLogo.svg';
import StarRate from 'components/common/StarRate';
import Button from 'components/common/Button';
import { useGetSellAllQuery } from 'services/productApi';
import { usePostUserMyPageMutation } from 'services/signUpApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Card from 'components/common/Card';
import PlusButton from 'components/common/PlusButton';

function CardComponent({ cards, moveProductDetail }) {
  return (
    <>
      {cards.length > 0 &&
        cards.slice(0, 4).map((product) => {
          const { address, dbFileName, interestCnt, prodName, prodNo, prodPrice, tradState } =
            product;
          return (
            <Card
              key={prodNo}
              // productImage={dbFileName}
              title={prodName}
              price={prodPrice.toLocaleString()}
              area={address}
              likes={interestCnt.toLocaleString()}
              state={tradState}
              onClick={moveProductDetail(prodNo)}
            />
          );
        })}
    </>
  );
}

export default function MyPage() {
  const { data: datas, isLoading, isSuccess, isError } = useGetSellAllQuery();
  const [getMyPage, data] = usePostUserMyPageMutation();
  const navigate = useNavigate();
  const { type } = useParams();
  const [cards, setCards] = useState([]);
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    if (datas) {
      const { sellInfos } = datas;
      sellInfos.forEach((data) => {
        setCards((prev) => [...prev, data]);
      });
    }
  }, [datas]);
  async function getUserData() {
    const res = await getMyPage().unwrap();
    setUserInfo(res.userInfo);
  }
  useEffect(() => {
    getUserData();
  }, []);

  const moveProductDetail = (prodNo) => (e) => {
    navigate(`/products/${type}/detail/${prodNo}`);
  };

  return (
    userInfo && (
      <Container>
        <TopSection>
          <UserInfoBox>
            <LeftSection src={basicLogo}></LeftSection>
            <RightSection>
              <TextBox marginBottom={'15px'}>닉네임: {userInfo.userNickName}</TextBox>
              <TextBox>주소: {userInfo.userAddress}</TextBox>
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
                navigate('edit', { state: userInfo.userPwd });
              }}
            >
              내 정보 설정
            </Button>
            <Button isOutline={true} customSize='250px'>
              알람 설정
            </Button>
          </ButtonWrapper>
        </TopSection>
        <ProductHead>
          <ProductHeadTitle>좋아요 한 게시글</ProductHeadTitle>
          <ProductHeadSubtext>더보기(52)</ProductHeadSubtext>
          <PlusButton customSize='35px' />
        </ProductHead>
        <ProductSection>
          <ProductCard>
            <CardComponent cards={cards} moveProductDetail={moveProductDetail} />
          </ProductCard>
        </ProductSection>
        <ProductHead>
          <ProductHeadTitle>구매내역</ProductHeadTitle>
          <ProductHeadSubtext>더보기(25)</ProductHeadSubtext>
          <PlusButton customSize='35px' />
        </ProductHead>
        <ProductSection>
          <ProductCard>
            <CardComponent cards={cards} moveProductDetail={moveProductDetail} />
          </ProductCard>
        </ProductSection>
        <ProductHead>
          <ProductHeadTitle>판매내역</ProductHeadTitle>
          <ProductHeadSubtext>더보기(60)</ProductHeadSubtext>
          <PlusButton customSize='35px' />
        </ProductHead>
        <ProductSection>
          <ProductCard>
            <CardComponent cards={cards} moveProductDetail={moveProductDetail} />
          </ProductCard>
        </ProductSection>
      </Container>
    )
  );
}

const Container = styled.div`
  padding: 15px 90px;
`;
const ProductHead = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
`;
const ProductCard = styled.div`
  display: flex;
`;
const ProductHeadTitle = styled.div`
  margin-top: 20px;
  font-size: 30px;
  font-weight: 800;
`;
const ProductHeadSubtext = styled.div`
  margin-left: 15px;
  margin-right: 15px;
`;
const UserInfoBox = styled.div`
  border: 3px solid ${PRIMARY_COLOR};
  border-radius: 30px;
  width: 35%;
  display: flex;
  padding: 15px 0px;
`;
const LeftSection = styled.img`
  width: 40%;
  height: 100px;
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
const ProductSection = styled.div`
  display: flex;
`;
