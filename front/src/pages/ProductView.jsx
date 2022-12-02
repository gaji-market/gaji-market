import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Card from 'components/common/Card';
import PlusButton from 'components/common/PlusButton';
import SkeletonCard from 'components/common/SkeletonCard';

import { useInView } from 'react-intersection-observer';
import { useCallback } from 'react';

// 임시 Mock 데이터
const mockCardDatas = {
  products: [
    {
      id: 0,
      title: '타이틀1',
      price: 123_456,
      area: '서울시 동작구',
      likes: 100,
    },
    {
      id: 1,
      title: '타이틀2',
      price: 2_000,
      area: '서울시 동작구',
      likes: 1,
    },
    {
      id: 2,
      title: '타이틀3',
      price: 440_000,
      area: '서울시 동작구',
      likes: 2000,
    },
    {
      id: 3,
      title: '타이틀4',
      price: 12_000,
      area: '서울시 동작구',
      likes: 10,
    },
    {
      id: 4,
      title: '타이틀5',
      price: 500_000,
      area: '서울시 동작구',
      likes: 10,
    },
    {
      id: 5,
      title: '타이틀6',
      price: 20_000,
      area: '서울시 동작구',
      likes: 10,
    },
    {
      id: 6,
      title: '타이틀7',
      price: 300_000,
      area: '서울시 동작구',
      likes: 2,
    },
    {
      id: 7,
      title: '타이틀8',
      price: 12_000,
      area: '서울시 동작구',
      likes: 5,
    },
    {
      id: 8,
      title: '타이틀9',
      price: '500,000',
      area: '서울시 동작구',
      likes: 10,
    },
    {
      id: 9,
      title: '타이틀10',
      price: 12_000,
      area: '서울시 동작구',
      likes: 10,
    },
    {
      id: 10,
      title: '타이틀12',
      price: 300_000,
      area: '서울시 동작구',
      likes: 2,
    },
    {
      id: 11,
      title: '타이틀13',
      price: 12_000,
      area: '서울시 동작구',
      likes: 5,
    },
  ],
};

const LOADING_CARD_COUNT = 4;

export default function ProductView() {
  const [cards, setCards] = useState(mockCardDatas.products);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cardRef, inView] = useInView();

  const [showSkeletonCard, setShowSkeletonCard] = useState(false);

  const getCards = useCallback(() => {
    // 서버에서 카드 데이터 받아오면 수정하기
    setIsLoading(true);

    setTimeout(() => {
      setShowSkeletonCard(false);
      setCards((prevCards) => [...prevCards, ...mockCardDatas.products]);
    }, 1000);

    setIsLoading(false);
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
    <Container>
      <Header>
        <Title>신규 판매중 상품</Title>
        <SubText>따끈따끈! 판매중인 신규 상품 목록이에요.</SubText>
      </Header>
      <CardContainer>
        {cards.map((product, idx) => {
          const { id, title, price, likes, area } = product;
          return (
            <Card
              key={`임시 키 입니다. id로 바꿀 부분 ${idx}`}
              title={title}
              price={price.toLocaleString()}
              area={area}
              likes={likes.toLocaleString()}
            ></Card>
          );
        })}
        {showSkeletonCard &&
          Array(LOADING_CARD_COUNT)
            .fill()
            .map((_, idx) => {
              return <SkeletonCard key={`SkeletonCard ${idx}`}></SkeletonCard>;
            })}
        <div ref={cardRef}></div>
      </CardContainer>
      <PlusButton />
    </Container>
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
