import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useGetSellAllQuery } from 'services/productApi';
import styled from 'styled-components';

import Card from 'components/common/Card';
import PlusButton from 'components/common/PlusButton';
import SkeletonCard from 'components/common/SkeletonCard';
import Loading from 'components/common/Loading';
import Modal from 'components/common/Modal';
import { Error } from './index';

import { LOADING_CARD_COUNT, TITLE, SUB_TITLE } from 'constants/productView';
import { SELL, BUY } from 'constants/params';

const IMG_PREFIX_URL = 'https://gajimarket.s3.ap-northeast-2.amazonaws.com/';

export default function ProductView() {
  const { type } = useParams();

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState('');
  const [cards, setCards] = useState([]);
  const [showSkeletonCard, setShowSkeletonCard] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    if (type === BUY) {
      setCurrentPage(BUY);
    }
    if (type === SELL) {
      setCurrentPage(SELL);
    }
  }, [type]);

  const [cardRef, inView] = useInView();
  const [pageQueryParams, setPageQueryParams] = useState({
    recordCount: 8, // 게시글 몇 개 보여줄지
    currentPage: 1,
    sort: 'default',
  });

  const { data: products, isLoading, isSuccess, isError } = useGetSellAllQuery(pageQueryParams);

  let lastPage = useRef(0);
  if (products) {
    lastPage.current = products.schPage.totalPageCount;
    // TODO : 백엔드한테 마지막 페이지가 totalPageCount가 맞는지 물어보기
  }

  const getCards = useCallback(() => {
    setPageQueryParams((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
    }));

    setTimeout(() => {
      setShowSkeletonCard(false);
    }, 500);
  }, [pageQueryParams.currentPage]);

  useEffect(() => {
    if (products && isSuccess) {
      const { sellInfos } = products;

      sellInfos.forEach((product) => {
        setCards((prev) => [...prev, product]);
      });
    }
  }, [products]);

  console.log(products);

  useEffect(() => {
    if (isLoading) {
      return setShowSkeletonCard(true);
    }

    if (lastPage.current > pageQueryParams.currentPage && inView && !isLoading) {
      getCards();
    }
  }, [inView, isLoading]);

  const moveProductDetail = (prodNo) => (e) => {
    const className = e.target.className;
    if (className.includes('empty-heart') || className.includes('fill-heart')) return;

    navigate(`/products/${type}/detail/${prodNo}`);
  };

  if (isError) {
    return <Error />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Modal
        ref={modalRef}
        text='등록하기 페이지로 이동할까요?'
        leftBtnText='네! 좋아요.'
        rightBtnText='아니요, 괜찮아요!'
      />

      <Container>
        <Header>
          <Title>{currentPage === BUY ? TITLE.sal : TITLE.pal}</Title>
          <SubText>{currentPage === BUY ? SUB_TITLE.sal : SUB_TITLE.pal}</SubText>
        </Header>
        <CardContainer>
          {cards.length > 0 &&
            cards.map((product) => {
              const { address, dbFileName, interestCnt, prodName, prodNo, prodPrice, tradState } =
                product;
              return (
                <Card
                  key={prodNo}
                  productImage={dbFileName ? `${IMG_PREFIX_URL}${dbFileName}` : null}
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
          <div className='cardRef' ref={cardRef}></div>
        </CardContainer>
        <AddButtonContainer>
          <PlusButton onClick={() => modalRef.current?.showModal()} />
        </AddButtonContainer>
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
  position: relative;

  .cardRef {
    width: 250px;
    height: 250px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

const AddButtonContainer = styled.div`
  heigth: 100px;
  position: relative;
  background: #eee;
`;
