import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useGetBuyAllQuery, useGetSellAllQuery } from 'services/productApi';

import styled from 'styled-components';

import Card from 'components/common/Card';
import PlusButton from 'components/common/PlusButton';
import SkeletonCard from 'components/common/SkeletonCard';
import Loading from 'components/common/Loading';
import Modal from 'components/common/Modal';

import { Error } from './index';

import { LOADING_CARD_COUNT, TITLE, SUB_TITLE } from 'constants/productView';
import { SELL, BUY } from 'constants/params';

export default function ProductView() {
  const { type } = useParams();

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState('');
  const [cards, setCards] = useState([]);
  const [showSkeletonCard, setShowSkeletonCard] = useState(false);
  const [skeletonCardCount, setSkeletonCardCount] = useState(LOADING_CARD_COUNT);

  const modalRef = useRef(null);

  const [cardRef, inView] = useInView();
  const [pageQueryParams, setPageQueryParams] = useState({
    recordCount: 8, // 게시글 몇 개 보여줄지
    currentPage: 1,
    sort: 'default',
  });

  const sellAllOption = { skip: type !== SELL };
  const getSellAll = useGetSellAllQuery(pageQueryParams, sellAllOption);

  const buyAllOption = { skip: type !== BUY };
  const getBuyAll = useGetBuyAllQuery(pageQueryParams, buyAllOption);

  const [products, setProducts] = useState(null);

  // TODO: 중복되는 코드 리팩토링
  useEffect(() => {
    if (type === BUY) {
      setCurrentPage(BUY);
    }
    if (type === SELL) {
      setCurrentPage(SELL);
    }
  }, [type]);

  let lastPage = useRef(0);

  useEffect(() => {
    if (type !== SELL) return;

    if (getSellAll.data && getSellAll.isSuccess) {
      setProducts(getSellAll.data.sellInfos);
    }
  }, [getSellAll.isSuccess]);

  useEffect(() => {
    if (type !== BUY) return;

    if (getBuyAll.data && getBuyAll.isSuccess) {
      setProducts(getBuyAll.data.buyInfos);
    }
  }, [getBuyAll.isSuccess]);

  console.log(products);

  if (products) {
    if (type === BUY) lastPage.current = getBuyAll.data.schPage.totalPageCount;
    if (type === SELL) lastPage.current = getSellAll.data.schPage.totalPageCount;
  }

  const getCards = () => {
    if (products) {
      setPageQueryParams((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }
  };

  useEffect(() => {
    if (products && (getSellAll.isSuccess || getBuyAll.isSuccess)) {
      let infos;
      if (type === SELL) {
        const { sellInfos } = getSellAll.data;
        infos = sellInfos;
      }
      if (type === BUY) {
        const { buyInfos } = getBuyAll.data;
        infos = buyInfos;
      }

      const cardCount = products?.schPage?.totalRecordCount % LOADING_CARD_COUNT;
      if (cardCount) {
        setSkeletonCardCount(LOADING_CARD_COUNT - cardCount);
      }

      infos.forEach((product) => {
        setCards((prev) => [...prev, product]);
      });

      setCards((prev) => [...new Set(prev)]);
    }
  }, [products, getSellAll.isSuccess, getSellAll.data, getBuyAll.isSuccess, getBuyAll.data]);

  useEffect(() => {
    if (getSellAll.isFetching || getBuyAll.isFetching) {
      return setShowSkeletonCard(true);
    }

    if (!getSellAll.isFetching || !getBuyAll.isFetching) {
      setTimeout(() => {
        return setShowSkeletonCard(false);
      }, 500);
    }

    if (
      inView &&
      lastPage.current > pageQueryParams.currentPage &&
      (!getSellAll.isFetching || !getBuyAll.isFetching)
    ) {
      getCards();
    }
  }, [inView, getCards, pageQueryParams]);

  const moveProductDetail = (prodNo) => (e) => {
    const tagName = e.target.tagName;
    if (tagName === 'svg' || tagName === 'path') return;

    navigate(`/products/${type}/detail/${prodNo}`);
  };

  if (getSellAll.isError || getBuyAll.isError) {
    return <Error />;
  }

  if (getSellAll.isLoading || getBuyAll.isLoading) {
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
                  productImage={
                    dbFileName ? `${process.env.REACT_APP_IMG_PREFIX_URL}${dbFileName}` : null
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
          {showSkeletonCard &&
            Array(skeletonCardCount)
              .fill()
              .map((_, idx) => {
                return <SkeletonCard key={`SkeletonCard ${idx}`} />;
              })}
          <div className='card-ref' ref={cardRef}></div>
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

  .card-ref {
    width: 250px;
    height: 250px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: -5;
  }
`;

const AddButtonContainer = styled.div`
  heigth: 100px;
  position: relative;
  background: #eee;
`;
