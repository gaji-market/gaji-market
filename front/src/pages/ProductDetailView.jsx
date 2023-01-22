import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  DARK_GRAY_COLOR,
  GRAY_COLOR,
  PRIMARY_COLOR,
  SUB_COLOR,
  WHITE_COLOR,
} from 'components/common/commonColor';
import Button from 'components/common/Button';
import Modal from 'components/common/Modal';

import {
  AiOutlineAlert,
  AiOutlineEye,
  AiOutlineHeart,
  AiFillHeart,
} from 'react-icons/ai';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { RiTimerLine } from 'react-icons/ri';

import {
  useGetProductQuery,
  useChangeInterestCountMutation,
  useChangeReportCountMutation,
  useDeleteProductMutation,
} from 'services/productApi';
import { Error } from './index';
import { SELL } from 'constants/params';

const NEXT_X = 400;
const ADDRESS = {
  start: 0,
  end: 2,
};

export default function ProductDetailView() {
  const slideRef = useRef();
  const modalRef = useRef(null);

  const navigate = useNavigate();

  const { type: param, id: prodNo } = useParams();

  const { data, isError, isLoading, isSuccess } = useGetProductQuery(prodNo);
  const [isCreatedUser, setIsCreatedUser] = useState(false);

  useEffect(() => {
    if (data) {
      const { loginUserNo: loggedInUserNo, userNo: CreatedUserNo } =
        data?.userInfo;

      if (loggedInUserNo === CreatedUserNo) setIsCreatedUser(true);
    }
  }, [data]);

  const [changeInterestCountMutation] = useChangeInterestCountMutation();
  const [changeReportCountMutation] = useChangeReportCountMutation();
  const [deleteProductMutation] = useDeleteProductMutation();

  const [productDate, setProductDate] = useState('');
  const [slideX, setSlideX] = useState(0);

  const clickPrevImg = () => {
    setSlideX(slideX - 1);
  };

  const clickNextImg = () => {
    setSlideX(slideX + 1);
  };

  useEffect(() => {
    if (data) {
      setProductDate(new Date(data.productInfo.regDt));
    }
  }, [data]);

  useEffect(() => {
    const { current } = slideRef;
    if (!current) return;

    if (slideX < 0) {
      setSlideX(data?.fileInfos.length - 1);
      current.style.transform = `translateX(${NEXT_X * slideX}px)`;
      return;
    }

    if (slideX > data?.fileInfos.length - 1) {
      setSlideX(0);
      current.style.transform = 'translateX(0px)';
      return;
    }

    if (slideX >= 0) {
      current.style.transform = `translateX(-${NEXT_X * slideX}px)`;
    }
  }, [slideX, data?.fileInfos]);

  const changeInterestCountHandler = async () => {
    try {
      await changeInterestCountMutation(prodNo);
    } catch (error) {
      console.error(error);
    }
  };

  const changeReportCountHandler = async () => {
    try {
      await changeReportCountMutation(prodNo);
    } catch (error) {
      console.error(error);
    }
  };

  const modifyHandler = () => () => {
    modalRef.current?.showModal();
    // TODO: Editor 페이지 재사용
  };

  const deleteHandler = async () => {
    try {
      const result = await deleteProductMutation(prodNo).unwrap();
      console.log(result);
      // TODO: 삭제 완료 토스트 띄우고 네비게이트
    } catch (error) {
      console.error(error);
      // TODO: 삭제 실패 토스트 띄우고 네비게이트
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Modal
        ref={modalRef}
        text='수정하기 페이지로 이동할까요?'
        leftBtnText='네! 좋아요.'
        rightBtnText='아니요, 괜찮아요!'
        confirmHandler={() => {
          navigate(`/modify/${param}/${prodNo}`);
          console.log(`/modify/${param}/${prodNo}`);
        }}
      />

      {isSuccess && (
        <Container>
          <Categories>
            {data.categoryInfos.map((category, i) => {
              if (category) {
                return (
                  <span
                    key={`${category.cateCode} ${i}`}
                    className='category-depth'
                  >
                    {category?.cateName}
                  </span>
                );
              }
            })}
          </Categories>

          <ProductTop>
            <div className='img-container'>
              <ul ref={slideRef} className='img-list'>
                {data.fileInfos.length > 0 &&
                  data.fileInfos.map((image) => {
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
              {data.fileInfos.length > 1 && (
                <div className='slide-btns'>
                  <span
                    className='arrow arrow-left'
                    role='button'
                    onClick={clickPrevImg}
                  ></span>
                  <span
                    className='arrow arrow-right'
                    onClick={clickNextImg}
                    role='button'
                  ></span>
                </div>
              )}
            </div>

            <ProductSummary>
              <Watcher>
                <WatcherIcon />
                <WatcherCount>{data.productInfo.viewCnt}</WatcherCount>
              </Watcher>
              <ProductState>
                {param === SELL ? '판매중' : '구매중'}
              </ProductState>
              <Title>{data.productInfo.prodName}</Title>
              <Price>{data.productInfo.prodPrice.toLocaleString()}원</Price>
              <StatusWrapper>
                <Status>
                  <Report>
                    <ReportIcon />
                    <span>신고 {data.productInfo.reportCnt}회</span>
                    <VerticalBar>|</VerticalBar>
                    <span
                      className='report-btn'
                      role='button'
                      onClick={changeReportCountHandler}
                    >
                      신고하기
                    </span>
                  </Report>
                  <Location>
                    <LocationIcon />
                    <span>{data.productInfo.address}</span>
                  </Location>
                  <DateCreated>
                    <DateIcon />
                    <span>{productDate.toLocaleString()}</span>
                  </DateCreated>
                </Status>
                <LikesWrapper>
                  {!data.interestInfo.interestYN ? (
                    <HeartIcon onClick={changeInterestCountHandler} />
                  ) : (
                    <FillHeartIcon onClick={changeInterestCountHandler} />
                  )}
                  <LikesCount>{data.interestInfo.interestCnt}</LikesCount>
                </LikesWrapper>
              </StatusWrapper>

              <ButtonWrapper>
                {isCreatedUser && (
                  <>
                    <Button customSize='50%' onClick={modifyHandler(data)}>
                      수정하기
                    </Button>
                    <Button
                      isOutline
                      isDarkColor
                      customSize='50%'
                      onClick={deleteHandler}
                    >
                      삭제하기
                    </Button>
                  </>
                )}
                {!isCreatedUser && (
                  <>
                    <Button customSize='100%'>채팅하기</Button>
                    {/* <Button isOutline isDarkColor customSize='50%'>
                      가격 제안하기
                    </Button> */}
                  </>
                )}
              </ButtonWrapper>
              <HashTags>
                {data.hashTagInfos.length > 0 &&
                  data.hashTagInfos.map((hashtag, idx) => {
                    return (
                      <HashTag key={`${hashtag.tagName}${idx}`}>
                        #{hashtag.tagName}
                      </HashTag>
                    );
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
                  <UserNickName>{data.userInfo.nickname}</UserNickName>
                  <UserArea>
                    {data.userInfo.address
                      .split(' ')
                      .slice(ADDRESS.start, ADDRESS.end)
                      .join(' ')}
                  </UserArea>
                </div>
              </ProfileWrapper>
              <Button
                isDarkColor
                customSize={'215px'}
                height={'35px'}
                padding={0}
              >
                정보보기
              </Button>
            </UserInfo>
          </ProductMid>

          <ProductBottom>
            <ProductInfoTitle>상품정보</ProductInfoTitle>
            <p>{data.productInfo.prodExplain}</p>
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
  font-size: 45px;
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
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const UserInfoTitle = styled.h4`
  font-size: 18px;
  font-weight: 900;
  color: ${SUB_COLOR};
  margin-bottom: 23px;
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
  margin-bottom: 3px;
  margin-right: 5px;
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

  p {
    color: ${DARK_GRAY_COLOR};
  }
`;

const ProductInfoTitle = styled.h4`
  font-size: 18px;
  font-weight: 900;
  color: ${SUB_COLOR};
  margin-bottom: 20px;
`;
