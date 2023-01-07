import React, { useState, useEffect, useRef } from 'react';
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

  const [currentPageParam, setCurrentPageParam] = useState('');

  const [saleCards, setSaleCards] = useState([]);
  const [purchaseCards, setPurchaseCards] = useState([]);

  const [showSkeletonCard, setShowSkeletonCard] = useState(false);
  const [skeletonCardCount, setSkeletonCardCount] =
    useState(LOADING_CARD_COUNT);

  const modalRef = useRef(null);

  const [cardRef, inView] = useInView();

  const [pageQueryForPurchase, setPageQueryForPurchase] = useState({
    recordCount: 8, // 게시글 몇 개 보여줄지
    currentPage: 1,
    sort: 'default',
  });

  const [pageQueryForSale, setPageQueryForSale] = useState({
    recordCount: 8, // 게시글 몇 개 보여줄지
    currentPage: 1,
    sort: 'default',
  });

  const sellAllOption = { skip: type !== SELL };
  const getSellAll = useGetSellAllQuery(pageQueryForSale, sellAllOption);

  const buyAllOption = { skip: type !== BUY };
  const getBuyAll = useGetBuyAllQuery(pageQueryForPurchase, buyAllOption);

  const [products, setProducts] = useState(null);

  // TODO: 중복되는 코드 리팩토링
  useEffect(() => {
    if (type === BUY) {
      setCurrentPageParam(BUY);
    }
    if (type === SELL) {
      setCurrentPageParam(SELL);
    }
  }, [type]);

  let lastPage = useRef(0);

  useEffect(() => {
    if (type !== SELL) return;

    if (getSellAll.data && getSellAll.isSuccess) {
      setProducts(getSellAll.data.sellInfos);
    }
  }, [getSellAll.isSuccess, type]);

  useEffect(() => {
    if (type !== BUY) return;

    if (getBuyAll.data && getBuyAll.isSuccess) {
      setProducts(getBuyAll.data.buyInfos);
    }
  }, [getBuyAll.isSuccess, type]);

  if (products) {
    if (type === BUY) {
      lastPage.current = getBuyAll.data?.schPage.totalPageCount;
    }

    if (type === SELL) {
      lastPage.current = getSellAll.data?.schPage.totalPageCount;
    }
  }

  const getCards = () => {
    if (products && type === SELL) {
      setPageQueryForSale((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }

    if (products && type === BUY) {
      setPageQueryForPurchase((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }
  };

  // 팔래요
  useEffect(() => {
    if (type !== SELL) return;

    if (products && getSellAll.isSuccess) {
      let productsOfCurrentParam;
      if (type === SELL) {
        const { sellInfos } = getSellAll.data;
        productsOfCurrentParam = sellInfos;
      }

      const cardCount =
        products?.schPage?.totalRecordCount % LOADING_CARD_COUNT;

      if (cardCount) {
        setSkeletonCardCount(LOADING_CARD_COUNT - cardCount);
      }

      productsOfCurrentParam.forEach((product) => {
        if (type === SELL) {
          setSaleCards((prev) => [...prev, product]);
          setSaleCards((prev) => {
            return [...new Set(prev.map(JSON.stringify))].map(JSON.parse);
          });
        }
      });
    }
  }, [products, type]);

  // TODO: 중복 코드 리팩토링

  // 살래요
  useEffect(() => {
    if (type !== BUY) return;

    if (products && getBuyAll.isSuccess) {
      let productsOfCurrentParam;
      if (type === BUY) {
        const { buyInfos } = getBuyAll.data;
        productsOfCurrentParam = buyInfos;
      }

      const cardCount =
        products?.schPage?.totalRecordCount % LOADING_CARD_COUNT;

      if (cardCount) {
        setSkeletonCardCount(LOADING_CARD_COUNT - cardCount);
      }

      productsOfCurrentParam.forEach((product) => {
        if (type === BUY) {
          setPurchaseCards((prev) => [...prev, product]);
          setPurchaseCards((prev) => {
            return [...new Set(prev.map(JSON.stringify))].map(JSON.parse);
          });
        }
      });
    }
  }, [products, type]);

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
      type === BUY &&
      inView &&
      lastPage.current > pageQueryForPurchase.currentPage &&
      !getSellAll.isFetching
    ) {
      getCards();
    }

    if (
      type === SELL &&
      inView &&
      lastPage.current > pageQueryForSale.currentPage &&
      !getBuyAll.isFetching
    ) {
      getCards();
    }
  }, [inView, getCards, pageQueryForPurchase, pageQueryForSale]);

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
        confirmHandler={() => {
          if (type === SELL) {
            navigate('/write/pal');
          }

          if (type === BUY) {
            navigate('/write/sal');
          }
        }}
      />

      <Container>
        <Header>
          <Title>{currentPageParam === BUY ? TITLE.sal : TITLE.pal}</Title>
          <SubText>
            {currentPageParam === BUY ? SUB_TITLE.sal : SUB_TITLE.pal}
          </SubText>
        </Header>
        <CardContainer>
          {type === SELL &&
            saleCards.length > 0 &&
            saleCards.map((product) => {
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
                    dbFileName
                      ? `${process.env.REACT_APP_IMG_PREFIX_URL}${dbFileName}`
                      : null
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

          {type === BUY &&
            purchaseCards.length > 0 &&
            purchaseCards.map((product) => {
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
                    dbFileName
                      ? `${process.env.REACT_APP_IMG_PREFIX_URL}${dbFileName}`
                      : null
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
