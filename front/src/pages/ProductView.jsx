import React, { useState, useEffect, useRef } from 'react';
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
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

// 백엔드에서 받아오는 key값 이름
const itemsKeyName = Object.freeze({
  pal: 'sellInfos',
  sal: 'buyInfos',
});

export default function ProductView() {
  const { type: param } = useParams();
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [currentPageParam, setCurrentPageParam] = useState('');

  const [saleCards, setSaleCards] = useState([]);
  const [purchaseCards, setPurchaseCards] = useState([]);

  const [showSkeletonCard, setShowSkeletonCard] = useState(false);
  const [skeletonCardCount, setSkeletonCardCount] =
    useState(LOADING_CARD_COUNT);

  const modalRef = useRef(null);
  const lastPage = useRef(null);

  const [cardRef, inView] = useInView();

  const [getItemsPayload, setGetItemsPayload] = useState({
    recordCount: 8, // 게시글 불러오기 개수
    currentPage: 1,
    sort: 'default',
  });

  const [pageQueryForSale, setPageQueryForSale] = useState(getItemsPayload);
  const sellAllOption = { skip: param !== SELL };
  const getSellAll = useGetSellAllQuery(pageQueryForSale, sellAllOption);

  const [pageQueryForPurchase, setPageQueryForPurchase] =
    useState(getItemsPayload);
  const buyAllOption = { skip: param !== BUY };
  const getBuyAll = useGetBuyAllQuery(pageQueryForPurchase, buyAllOption);

  const [products, setProducts] = useState(null);
  const [currentParamItems, setCurrentParamItems] = useState();

  const getAllProducts = {
    pal: getSellAll,
    sal: getBuyAll,
  };

  const setQuery = {
    pal: setPageQueryForSale,
    sal: setPageQueryForPurchase,
  };

  const pageQuery = {
    pal: pageQueryForSale,
    sal: pageQueryForPurchase,
  };

  const cards = {
    pal: saleCards,
    sal: purchaseCards,
  };

  const setCard = {
    pal: setSaleCards,
    sal: setPurchaseCards,
  };

  const getCards = () => {
    setQuery[param]((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
    }));
  };

  useEffect(() => {
    setCurrentPageParam(param);

    if (getAllProducts[param]?.isSuccess) {
      setCurrentParamItems((prev) => ({
        ...prev,
        pal: {
          data: getSellAll?.data,
          infos: getSellAll?.data?.sellInfos,
          isSuccess: getSellAll?.isSuccess,
        },
        sal: {
          data: getBuyAll?.data,
          infos: getBuyAll?.data?.buyInfos,
          isSuccess: getBuyAll?.isSuccess,
        },
      }));
    }
  }, [param, getSellAll.isSuccess, getBuyAll.isSuccess]);

  useEffect(() => {
    const salOrPal = param;
    if (
      currentParamItems?.[salOrPal]?.data &&
      currentParamItems?.[salOrPal]?.isSuccess
    ) {
      setProducts(currentParamItems[salOrPal]?.infos);
    }
  }, [param, currentParamItems]);

  if (products) {
    lastPage.current = getAllProducts[param].data?.schPage.totalPageCount;
  }

  useEffect(() => {
    if (products && getAllProducts?.[param]?.isSuccess) {
      const productsOfParam =
        getAllProducts?.[param]?.data?.[itemsKeyName[param]];

      const cardCount =
        getAllProducts?.[param]?.data?.schPage?.totalRecordCount %
        LOADING_CARD_COUNT;

      if (cardCount) {
        setSkeletonCardCount(LOADING_CARD_COUNT - cardCount);
      }

      productsOfParam.forEach((product) => {
        setCard[param]((prev) => [...prev, product]);
      });

      setCard[param]((prev) => {
        return [...new Set(prev.map((prodNo) => JSON.stringify(prodNo)))].map(
          JSON.parse
        );
      });
    }
  }, [products, param]);

  useEffect(() => {
    return () => {
      setQuery[param]((prev) => ({
        ...prev,
        currentPage: 1,
        cateCode: '',
      }));
    };
  }, [param]);

  useEffect(() => {
    if (searchParams?.get('category')) {
      setQuery[param]((prev) => ({
        ...prev,
        currentPage: 1,
        cateCode: searchParams.get('category'),
      }));
    }

    return () => {
      setCard[param](() => []);
    };
  }, [location]);

  useEffect(() => {
    if (getAllProducts?.[param]?.isFetching) {
      return setShowSkeletonCard(true);
    } else {
      setTimeout(() => {
        return setShowSkeletonCard(false);
      }, 500);
    }
  }, [getAllProducts]);

  useEffect(() => {
    if (getAllProducts[param]?.isFetching) return;

    if (inView && lastPage.current >= pageQuery[param].currentPage) {
      getCards();
    }
  }, [inView, getCards, param]);

  const moveProductDetail = (prodNo) => (e) => {
    const tagName = e.target.tagName;
    const interestIconTag = ['path', 'svg'];

    if (interestIconTag.includes(tagName)) return;
    navigate(`/products/${param}/detail/${prodNo}`);
  };

  if (getAllProducts?.[param]?.isError) {
    return <Error />;
  }

  if (getAllProducts?.[param]?.isLoading) {
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
          navigate(`/write/${param}`);
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
          {cards[param].length > 0 &&
            cards[param].map((product) => {
              const {
                address,
                dbFileName,
                interestCnt,
                interestYN,
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
                  prodNo={prodNo}
                  area={address}
                  likes={interestCnt.toLocaleString()}
                  isInterest={interestYN}
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
  grid-template-columns: repeat(4, 1fr);
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
