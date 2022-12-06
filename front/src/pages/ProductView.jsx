import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Card from 'components/common/Card';
import PlusButton from 'components/common/PlusButton';
import SkeletonCard from 'components/common/SkeletonCard';

import { useInView } from 'react-intersection-observer';
import { useCallback } from 'react';

import { useGetSellAllQuery } from 'services/productApi';
import Loading from 'components/common/Loading';

const LOADING_CARD_COUNT = 4;
const TITLE = Object.freeze({
  sal: '신규 구매중 상품',
  pal: '신규 판매중 상품',
});
const SUB_TITLE = Object.freeze({
  sal: '구매하고 싶은 상품이 있다면 직접 구매글을 올려보세요!',
  pal: '따끈따끈! 신규 등록된 판매중인 상품 목록이에요.',
});

export default function ProductView() {
  const { type } = useParams();

  const [currentPage, setCurrentPage] = useState('');
  const [cards, setCards] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [showSkeletonCard, setShowSkeletonCard] = useState(false);

  const [cardRef, inView] = useInView();

  const {
    data: datas,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSellAllQuery();

  useEffect(() => {
    if (type === 'sal') {
      setCurrentPage('sal');
    }
    if (type === 'pal') {
      setCurrentPage('pal');
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
    }, 1000);
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

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Container>
          <Header>
            <Title>{currentPage === 'sal' ? TITLE.sal : TITLE.pal}</Title>
            <SubText>
              {currentPage === 'sal' ? SUB_TITLE.sal : SUB_TITLE.pal}
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
                  ></Card>
                );
              })}
            {showSkeletonCard &&
              Array(LOADING_CARD_COUNT)
                .fill()
                .map((_, idx) => {
                  return (
                    <SkeletonCard key={`SkeletonCard ${idx}`}></SkeletonCard>
                  );
                })}
            <div ref={cardRef}></div>
          </CardContainer>
          <PlusButton />
        </Container>
      )}
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
