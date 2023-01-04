import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styled from 'styled-components';

import { useGetSellAllQuery } from 'services/productApi';

import Card from 'components/common/Card';

import { GRAY_COLOR } from 'components/common/commonColor';

const IMG_PREFIX_URL = 'https://gajimarket.s3.ap-northeast-2.amazonaws.com/';

export default function Home() {
  const { type } = useParams();
  const navigate = useNavigate();

  const { data: products, isSuccess } = useGetSellAllQuery({
    recordCount: 8,
    currentPage: 1,
    sort: 'default',
  });

  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (products && isSuccess) {
      const { sellInfos } = products;

      sellInfos.forEach((product) => {
        setCards((prev) => [...prev, product]);
      });

      setCards((prev) => [...new Set(prev)]);
    }
  }, [products]);

  const moveProductDetail = (prodNo) => (e) => {
    const className = e.target.className;
    if (className.includes('empty-heart') || className.includes('fill-heart'))
      return;

    navigate(`/products/${type}/detail/${prodNo}`);
  };
  return (
    <>
      <Container>
        <Intro>
          <img
            src='https://us.123rf.com/450wm/tanyaknyazeva/tanyaknyazeva1611/tanyaknyazeva161100003/68779291-%EC%95%BC%EC%B1%84-%EA%B0%80%EC%A7%80-%EB%B2%A1%ED%84%B0-%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8-eps-1.jpg'
            alt='eggplant.jpg'
          />
          <Header>
            <Title>당신 근처의 가지마켓</Title>
            <SubText>중고 거래로 가깝고 따뜻한 당신의 근처를 만들어요.</SubText>
          </Header>
        </Intro>
        <Divider />
        <Header>
          <Title>오늘의 상품 추천</Title>
          <SubText>
            동네 주민들과 가깝고 따뜻한 거래를 지금 경험해보세요.
          </SubText>
        </Header>
        <CardContainer>
          {cards.length > 0 &&
            cards.map((product) => {
              const {
                address,
                dbFileName,
                interestCnt,
                prodName,
                prodNo,
                prodPrice,
                tradState,
              } = product;
              return (
                <Card
                  key={prodNo}
                  productImage={
                    dbFileName ? `${IMG_PREFIX_URL}${dbFileName}` : null
                  }
                  title={prodName}
                  price={prodPrice.toLocaleString()}
                  area={address}
                  likes={interestCnt.toLocaleString()}
                  state={tradState}
                  onClick={moveProductDetail(prodNo)}
                />
              );
            })}
        </CardContainer>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 1200px;
  position: relative;
`;

const Intro = styled.div`
  margin-top: 48px;
  display: flex;
  align-items: center;

  img {
    width: 720px;
  }
`;

const Header = styled.div`
  width: 1024px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: 900;
  margin-top: 5px;
  margin-bottom: 5px;
  text-indent: 5px;
`;

const SubText = styled.p`
  font-size: 16px;
  padding-top: 7px;
  text-indent: 7px;
`;

const Divider = styled.div`
  border: 1px solid ${GRAY_COLOR};
  width: 100%;
  height: 1px;
  margin: 24px 0;
`;

const CardContainer = styled.div`
  width: 1024px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 0 auto;
  position: relative;

  .cardRef {
    width: 250px;
    height: 250px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;
