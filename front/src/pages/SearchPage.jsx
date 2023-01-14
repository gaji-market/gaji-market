import React, { useState, useEffect } from 'react';
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import styled from 'styled-components';

import { PRIMARY_COLOR, DARK_GRAY_COLOR } from 'components/common/commonColor';

import {
  useLazyGetBuyAllQuery,
  useLazyGetSellAllQuery,
} from 'services/productApi';

import Card from 'components/common/Card';

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [getBuyAll] = useLazyGetBuyAllQuery();
  const [getSellAll] = useLazyGetSellAllQuery();

  const [sellProducts, setSellProducs] = useState([]);
  const [buyProducts, setBuyProducts] = useState([]);

  const getBuyAllHandler = async (payload) => {
    try {
      const data = await getBuyAll(payload).unwrap();
      data.buyInfos && setBuyProducts(data.buyInfos);
    } catch (e) {
      console.log(e);
    }
  };

  const getSellAllHandler = async (payload) => {
    try {
      const data = await getSellAll(payload).unwrap();
      data.sellInfos && setSellProducs(data.sellInfos);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (searchParams.get('query')) {
      const payload = {
        search: searchParams.get('query'),
        recordCount: 8,
        currentPage: 1,
        sort: 'default',
      };
      getBuyAllHandler(payload);
      getSellAllHandler(payload);
    }
  }, [location]);

  return (
    <Container>
      <SubText>
        <span>{searchParams.get('query')}</span>의 검색결과: 총{' '}
        <span>{sellProducts.length + buyProducts.length}</span>개의 상품을
        찾았습니다.
      </SubText>
      <Header>
        <Title>팔래요 ({sellProducts.length})</Title>
        <NavLink to='/products/pal'>전체보기</NavLink>
      </Header>
      <CardContainer>
        {sellProducts.map((prod) => (
          <Card
            key={prod.prodNo}
            productImage={
              prod.dbFileName
                ? `${process.env.REACT_APP_IMG_PREFIX_URL}${prod.dbFileName}`
                : null
            }
            title={prod.prodName}
            price={prod.prodPrice.toLocaleString()}
            area={prod.address}
            likes={prod.interestCnt.toLocaleString()}
            state={prod.tradState}
            onClick={(e) => {
              if (!['svg', 'path'].includes(e.target.tagName)) {
                navigate(`/products/sal/detail/${prod.prodNo}`);
              }
            }}
          />
        ))}
      </CardContainer>
      <Header>
        <Title>살래요 ({sellProducts.length})</Title>
        <NavLink to='/products/sal'>전체보기</NavLink>
      </Header>
      <CardContainer>
        {buyProducts.map((prod) => (
          <Card
            key={prod.prodNo}
            productImage={
              prod.dbFileName
                ? `${process.env.REACT_APP_IMG_PREFIX_URL}${prod.dbFileName}`
                : null
            }
            title={prod.prodName}
            price={prod.prodPrice.toLocaleString()}
            area={prod.address}
            likes={prod.interestCnt.toLocaleString()}
            state={prod.tradState}
            onClick={(e) => {
              if (!['svg', 'path'].includes(e.target.tagName)) {
                navigate(`/products/pal/detail/${prod.prodNo}`);
              }
            }}
          />
        ))}
      </CardContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 1200px;
`;

const Header = styled.div`
  width: 1024px;
  margin: 32px auto 16px auto;
  display: flex;
  column-gap: 16px;
  align-items: center;

  a {
    color: ${DARK_GRAY_COLOR};
    height: fit-content;
  }
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bolder;
`;

const SubText = styled.div`
  width: 1024px;
  margin: 32px auto 16px auto;
  font-size: 16px;

  span {
    color: ${PRIMARY_COLOR};
    font-weight: bolder;
  }
`;

const CardContainer = styled.div`
  width: 1024px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 0 auto;
  position: relative;
`;
