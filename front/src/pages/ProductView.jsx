import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useCallback } from 'react';
import { useGetSellAllQuery } from 'services/productApi';
import styled from 'styled-components';

import Card from 'components/common/Card';
import PlusButton from 'components/common/PlusButton';
import SkeletonCard from 'components/common/SkeletonCard';
import Loading from 'components/common/Loading';
import { Error } from './index';

import {
  LOADING_CARD_COUNT,
  TITLE,
  SUB_TITLE,
  SELL,
  BUY,
} from 'constants/productView';

export default function ProductView() {
  const { type } = useParams();

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState('');
  const [cards, setCards] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [showSkeletonCard, setShowSkeletonCard] = useState(false);

  const [cardRef, inView] = useInView();

  const { data: datas, isLoading, isSuccess, isError } = useGetSellAllQuery();

  useEffect(() => {
    if (type === BUY) {
      setCurrentPage(BUY);
    }
    if (type === SELL) {
      setCurrentPage(SELL);
    }
  }, [type]);

  useEffect(() => {
    if (datas) {
      const { sellInfos } = datas;
      sellInfos.forEach((data) => {
        setCards((prev) => [...prev, data]);
      });
    }
  }, [datas]);

  const getCards = useCallback(() => {
    // 서버에서 카드 데이터 받아오면 수정하기
    setTimeout(() => {
      setShowSkeletonCard(false);
    }, 500);
  }, [pageNumber]);

  useEffect(() => {
    return () => {
      getCards();
      setShowSkeletonCard(true);
    };
  }, [getCards]);

  useEffect(() => {
    if (inView && !isLoading) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  }, [inView, isLoading]);

  const moveProductDetail = (prodNo) => (e) => {
    const className = e.target.className;
    if (className.includes('empty-heart') || className.includes('fill-heart'))
      return;

    navigate(`/products/${type}/detail/${prodNo}`);
  };

  if (isError) {
    return <Error />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const addProduct = () => {
    navigate('/write');
  };

  return (
    <>
      <Container>
        <Header>
          <Title>{currentPage === BUY ? TITLE.sal : TITLE.pal}</Title>
          <SubText>
            {currentPage === BUY ? SUB_TITLE.sal : SUB_TITLE.pal}
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
          {showSkeletonCard &&
            Array(LOADING_CARD_COUNT)
              .fill()
              .map((_, idx) => {
                return <SkeletonCard key={`SkeletonCard ${idx}`} />;
              })}
          <div ref={cardRef}></div>
        </CardContainer>
        <PlusButton onClick={addProduct} />
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 1200px;
  position: relative;
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

const CardContainer = styled.div`
  width: 1024px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 0 auto;
`;
