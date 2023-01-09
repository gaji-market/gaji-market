import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { GRAY_COLOR, PRIMARY_COLOR, SUB_COLOR, WHITE_COLOR } from 'components/common/commonColor';
import Button from 'components/common/Button';

import { AiOutlineAlert, AiOutlineEye, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { RiTimerLine } from 'react-icons/ri';

import { useGetProductQuery } from 'services/productApi';
import { Error } from './index';
import { SELL } from 'constants/params';

const NEXT_X = 400;

export default function ProductDetailView() {
  const slideRef = useRef();

  const { type: param, id: prodNo } = useParams();
  const { data: product, isError, isLoading, isSuccess } = useGetProductQuery(prodNo);

  const [productDate, setProductDate] = useState('');
  const [slideX, setSlideX] = useState(0);

  const clickPrevImg = () => {
    setSlideX(slideX - 1);
  };

  const clickNextImg = () => {
    setSlideX(slideX + 1);
  };

  useEffect(() => {
    if (product) {
      setProductDate(new Date(product.productInfo.regDt));
    }
  }, [product]);

  useEffect(() => {
    const { current } = slideRef;
    if (!current) return;

    if (slideX < 0) {
      setSlideX(product?.fileInfos.length - 1);
      current.style.transform = `translateX(${NEXT_X * slideX}px)`;
      return;
    }

    if (slideX > product?.fileInfos.length - 1) {
      setSlideX(0);
      current.style.transform = 'translateX(0px)';
      return;
    }

    if (slideX >= 0) {
      current.style.transform = `translateX(-${NEXT_X * slideX}px)`;
    }
  }, [slideX, product?.fileInfos]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      {isSuccess && (
        <Container>
          <Categories>
            {product.categoryInfos.map((category, i) => {
              if (category) {
                return (
                  <span key={`${category.cateCode} ${i}`} className='category-depth'>
                    {category?.cateName}
                  </span>
                );
              }
            })}
          </Categories>

          <ProductTop>
            <div className='img-container'>
              <ul ref={slideRef} className='img-list'>
                {product.fileInfos.length > 0 &&
                  product.fileInfos.map((image) => {
                    return (
                      <li key={`${image.fileOrder} ${image.dbFileName}`}>
                        <img
                          className='product-image'
                          src={`${process.env.REACT_APP_IMG_PREFIX_URL}${image.dbFileName}`}
                          alt='product_img'
                        />
                      </li>
                    );
                  })}
              </ul>
              {product.fileInfos.length > 1 && (
                <div className='slide-btns'>
                  <span className='arrow arrow-left' role='button' onClick={clickPrevImg}></span>
                  <span className='arrow arrow-right' onClick={clickNextImg} role='button'></span>
                </div>
              )}
            </div>

            <ProductSummary>
              <Watcher>
                <WatcherIcon />
                <WatcherCount>{product.productInfo.viewCnt}</WatcherCount>
              </Watcher>
              <ProductState>{param === SELL ? '판매중' : '구매중'}</ProductState>
              <Title>{product.productInfo.prodName}</Title>
              <Price>{product.productInfo.prodPrice.toLocaleString()}원</Price>
              <StatusWrapper>
                <Status>
                  <Report>
                    <ReportIcon />
                    <span>신고 {product.productInfo.reportCnt}회</span>
                    <VerticalBar>|</VerticalBar>
                    <span className='report-btn'>신고하기</span>
                  </Report>
                  <Location>
                    <LocationIcon />
                    <span>{product.productInfo.address}</span>
                  </Location>
                  <DateCreated>
                    <DateIcon />
                    <span>{productDate.toLocaleString()}</span>
                  </DateCreated>
                </Status>
                <LikesWrapper>
                  <HeartIcon />
                  <LikesCount>{product.interestInfo.interestCnt}</LikesCount>
                </LikesWrapper>
              </StatusWrapper>

              <ButtonWrapper>
                <Button customSize='50%'>채팅하기</Button>
                <Button isOutline isDarkColor customSize='50%'>
                  가격 제안하기
                </Button>
              </ButtonWrapper>
              <HashTags>
                {product.hashTagInfos.length > 0 &&
                  product.hashTagInfos.map((hashtag, idx) => {
                    return <HashTag key={`${hashtag.tagName}${idx}`}>#{hashtag.tagName}</HashTag>;
                  })}
              </HashTags>
            </ProductSummary>
          </ProductTop>

          <ProductMid>
            <UserInfo>
              <UserInfoTitle>판매자 정보</UserInfoTitle>
              <ProfileWrapper>
                <ProfileImg />
                <div>
                  <UserNickName>{product.userInfo.nickname}</UserNickName>
                  <UserArea>{product.userInfo.address}</UserArea>
                </div>
              </ProfileWrapper>
              <Button isDarkColor>정보보기</Button>
            </UserInfo>
          </ProductMid>

          <ProductBottom>
            <ProductInfoTitle>상품정보</ProductInfoTitle>
            <p>{product.productInfo.prodExplain}</p>
          </ProductBottom>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  width: 1200px;
  padding-top: 30px;
  padding-left: 50px;
  padding-right: 50px;
  position: relative;
  color: ${GRAY_COLOR};
`;

const Categories = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 23px;

  .category-depth {
    margin-right: 5px;

    &:not(:last-child)::after {
      content: ' >';
    }
  }
`;

const ProductTop = styled.div`
  height: 480px;
  display: flex;
  border-bottom: 1px solid #ddd;
  align-items: center;
  justify-content: space-around;

  .img-container {
    width: 400px;
    height: 400px;
    overflow: hidden;
    position: relative;
  }

  .img-container ul {
    display: flex;
    height: 100%;
  }

  .img-list {
    align-items: center;
    transition: all 0.4s;
  }

  .product-images li {
    width: 400px;
    height: 400px;
  }

  .product-image {
    width: 400px;
    display: block;
  }

  .slide-btns {
    position: absolute;
    width: 50px;
    height: 50px;
    top: 46%;
    z-index: 10;

    .arrow {
      position: absolute;
      left: 0;
      top: 0;
      content: '';
      width: 25px;
      height: 25px;
      border-top: 5px solid ${WHITE_COLOR};
      border-right: 5px solid ${WHITE_COLOR};
      border-radius: 0px;
      border-top-right-radius: 10px;
      cursor: pointer;
    }

    .arrow-left {
      transform: rotate(225deg);
      left: 15px;
      background: linear-gradient(
        to bottom,
        #00000050,
        transparent,
        transparent,
        transparent,
        transparent
      );
    }

    .arrow-right {
      transform: rotate(45deg);
      left: 355px;
      background: linear-gradient(
        to left,
        #00000050,
        transparent,
        transparent,
        transparent,
        transparent
      );
    }
  }
`;

const ProductSummary = styled.div`
  width: 50%;
  height: 400px;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-end;
  padding-bottom: 10px;
`;

const Watcher = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
`;

const WatcherIcon = styled(AiOutlineEye)`
  font-size: 23px;
`;

const WatcherCount = styled.div``;

const ProductState = styled.p`
  font-size: 18px;
  color: ${PRIMARY_COLOR};
  font-weight: 700;
`;

const Title = styled.h2`
  font-size: 35px;
  font-weight: 900;
  color: ${SUB_COLOR};
  margin-top: 5px;
  margin-bottom: 5px;
`;

const Price = styled.p`
  font-size: 35px;
  font-weight: 700;
  color: ${PRIMARY_COLOR};
`;

const StatusWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 5px;
  color: ${SUB_COLOR};
`;

const Status = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LikesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const HeartIcon = styled(AiOutlineHeart)`
  cursor: pointer;
  font-size: 45px;
`;

const FillHeartIcon = styled(AiFillHeart)`
  cursor: pointer;
  font-size: 36px;
`;

const LikesCount = styled.div``;

const Report = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 5px;

  .report-btn {
    cursor: pointer;
  }
`;

const VerticalBar = styled.span`
  margin-left: 5px;
  margin-right: 5px;
`;

const ReportIcon = styled(AiOutlineAlert)`
  font-size: 23px;
  margin-right: 5px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const LocationIcon = styled(HiOutlineLocationMarker)`
  font-size: 23px;
  margin-right: 5px;
`;

const DateCreated = styled.div`
  display: flex;
  align-items: center;
`;

const DateIcon = styled(RiTimerLine)`
  font-size: 23px;
  margin-right: 5px;
`;

const HashTags = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const HashTag = styled.span`
  color: #aaa;
  margin-right: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ProductMid = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 20px;
`;

const UserInfo = styled.div`
  width: 200px;
  margin: 20px;
`;

const UserInfoTitle = styled.h4`
  font-size: 18px;
  font-weight: 900;
  color: ${SUB_COLOR};
  margin-bottom: 20px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const ProfileImg = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 100px;
  background: #ddd;
`;

const UserNickName = styled.p`
  color: ${SUB_COLOR};
  font-weight: 700;
  margin-bottom: 5px;
`;

const UserArea = styled.p`
  color: ${SUB_COLOR};
`;

const ProductBottom = styled.div`
  height: 500px;
  padding: 20px;
  margin: 20px;
`;

const ProductInfoTitle = styled.h4`
  font-size: 18px;
  font-weight: 900;
  color: ${SUB_COLOR};
  margin-bottom: 20px;
`;
