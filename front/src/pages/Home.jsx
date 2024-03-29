import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useGetSellAllQuery, useGetBuyAllQuery } from 'services/productApi';

import Card from 'components/common/Card';
import Button from 'components/common/Button';

import { GRAY_COLOR } from 'components/common/commonColor';

import mainImg from 'assets/gaji-market_home.png';

export default function Home() {
  const navigate = useNavigate();

  const payload = {
    recordCount: 8,
    currentPage: 1,
    sort: 'interestHigh',
  };

  const { data: sellProducts } = useGetSellAllQuery(payload);
  const { data: buyProducts } = useGetBuyAllQuery(payload);

  const moveProductDetail = (prodNo) => (e) => {
    const className = e.target.className;
    if (className.includes('empty-heart') || className.includes('fill-heart'))
      return;

    navigate(`/products/pal/detail/${prodNo}`);
  };

  return (
    <>
      <Container className='fade-in'>
        <Intro>
          <img src={mainImg} alt='gaji-market_home.png' />
          <Header>
            <Title>우리들의 가지마켓</Title>
            <SubText>중고거래, 어디로 가지~? 여기로 가지!</SubText>
            <BtnGroup>
              <Button
                size='lg'
                padding='0'
                height='40px'
                onClick={() => navigate('/products/pal')}
              >
                팔래요
              </Button>
              <Button
                size='lg'
                padding='0'
                height='40px'
                isOutline
                onClick={() => navigate('/products/sal')}
              >
                살래요
              </Button>
            </BtnGroup>
          </Header>
        </Intro>
        <Divider />
        <Header>
          <Title>팔래요</Title>
          <SubText>오늘의 인기 상품을 추천합니다!</SubText>
        </Header>
        <CardContainer>
          {sellProducts?.sellInfos?.map((product) => (
            <Card
              key={product.prodNo}
              productImage={
                product.dbFileName
                  ? `${process.env.REACT_APP_IMG_PREFIX_URL}${product.dbFileName}`
                  : null
              }
              title={product.prodName}
              price={product.prodPrice.toLocaleString()}
              area={product.address}
              likes={product.interestCnt.toLocaleString()}
              state={product.tradState}
              onClick={moveProductDetail(product.prodNo)}
            />
          ))}
        </CardContainer>
        <Header>
          <Title>살래요</Title>
          <SubText>오늘의 인기 상품을 추천합니다!</SubText>
        </Header>
        <CardContainer>
          {buyProducts?.buyInfos?.map((product) => (
            <Card
              key={product.prodNo}
              productImage={
                product.dbFileName
                  ? `${process.env.REACT_APP_IMG_PREFIX_URL}${product.dbFileName}`
                  : null
              }
              title={product.prodName}
              price={product.prodPrice.toLocaleString()}
              area={product.address}
              likes={product.interestCnt.toLocaleString()}
              state={product.tradState}
              onClick={moveProductDetail(product.prodNo)}
            />
          ))}
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

const BtnGroup = styled.div`
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
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
