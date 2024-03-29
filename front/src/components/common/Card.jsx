import React, { useState } from 'react';
import styled from 'styled-components';

import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

import { useChangeInterestCountMutation } from 'services/productApi';

import StateBadge from './StateBadge';
import { WHITE_COLOR } from './commonColor';

const PRODUCT_STATE = {
  0: '판매중',
  1: '구매중',
  2: '거래중',
  3: '거래완료',
};

const ADDRESS = {
  start: 0,
  end: 3,
};

const TEMP_IMG_URL =
  'https://png.pngtree.com/element_our/20190528/ourlarge/pngtree-cartoon-eggplant-image_1128846.jpg';

export default function Card({
  productImage,
  isInterest,
  title,
  price,
  prodNo,
  userNo,
  area,
  likes,
  state,
  onClick,
}) {
  const [interestState, setIsInterestState] = useState(isInterest);
  const [likesState, setLikesState] = useState(likes);
  const [changeInterestCountMutation] = useChangeInterestCountMutation();

  const clickInterest = async () => {
    try {
      const res = await changeInterestCountMutation({
        prodNo,
        userNo,
      }).unwrap();

      setIsInterestState(() => res.interestInfo.interestYN);
      setLikesState(() => res.interestInfo.interestCnt);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CardContainer onClick={onClick}>
      <CardHead>
        <div className='imgContainer'>
          {productImage ? (
            <img alt={title} src={productImage} />
          ) : (
            <>
              <img
                alt='이미지 미등록 상품'
                style={{
                  // 임시 스타일
                  opacity: '10%',
                }}
                src={TEMP_IMG_URL}
              />
              <NoImage />
            </>
          )}
        </div>
        <StateBadge productState={PRODUCT_STATE[Number(state)]} />
      </CardHead>
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardContent>
          <PriceText>{price}원</PriceText>
          <SubContent>
            <AreaText>
              {area.split(' ').slice(ADDRESS.start, ADDRESS.end).join(' ')}
            </AreaText>
            <LikesWrapper>
              {interestState ? (
                <FillHeartIcon onClick={clickInterest} className='fillHeart' />
              ) : (
                <HeartIcon onClick={clickInterest} className='emptyHeart' />
              )}
              <LikesCount>{likesState}</LikesCount>
            </LikesWrapper>
          </SubContent>
        </CardContent>
      </CardBody>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  width: 240px;
  height: 320px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f4eeff;
  overflow: hidden;
  color: #7353ab;
  margin: 8px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    scale: 1.02;
  }
`;

const CardHead = styled.div`
  position: relative;

  .imgContainer {
    overflow: hidden;
    width: 240px;
    height: 220px;
    background: #f4eeff;
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
  }

  .imgContainer img {
    display: block;
    width: auto;
    height: 100%;
    margin: 0 auto;
  }
`;

const CardTitle = styled.h2`
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 5px;
  white-space: nowrap;
`;

const CardBody = styled.div`
  padding: 15px;
  position: relative;
  background: ${WHITE_COLOR};
`;

const CardContent = styled.div`
  margin-bottom: 5px;
`;

const PriceText = styled.h3`
  font-size: 20px;
  font-weight: 900;
  padding-top: 2px;
`;

const SubContent = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
`;

const AreaText = styled.p`
  font-size: 13px;
`;

const LikesWrapper = styled.div`
  display: flex;
  gap: 5px;
`;

const HeartIcon = styled(AiOutlineHeart)`
  cursor: pointer;
`;

const FillHeartIcon = styled(AiFillHeart)`
  cursor: pointer;
`;

const LikesCount = styled.p`
  font-size: 13px;
`;

const NoImage = styled.p`
  color: #fff;
  font-weight: 700;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  z-index: 5;
  text-align: center;

  &::after {
    content: '이미지 미등록';
    width: 100%;
    height: 100%;
    background: #e9dcff;
    position: relative;
  }
`;
