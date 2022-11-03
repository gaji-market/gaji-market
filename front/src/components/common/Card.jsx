import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import StateBadge from './StateBadge';

const TEMP_IMG_URL =
  'https://png.pngtree.com/element_our/20190528/ourlarge/pngtree-cartoon-eggplant-image_1128846.jpg';

export default function Card({ productImage, title, price, area, likes }) {
  const [fillHeart, setFillHeart] = useState(false);

  const onClickHeart = () => {
    setFillHeart((prevState) => {
      return !prevState;
    });
  };

  return (
    <CardContainer>
      <CardHead>
        {productImage ? (
          <CardImage alt='상품 이미지' src='url' />
        ) : (
          <>
            <CardImage
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
        <StateBadge text='판매중' />
      </CardHead>
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardContent>
          <PriceText>{price}원</PriceText>
          <SubContent>
            <AreaText>{area}</AreaText>
            <LikeContainer>
              {fillHeart ? (
                <FillHeartIcon onClick={onClickHeart} />
              ) : (
                <HeartIcon onClick={onClickHeart} />
              )}
              <LikeCount>{likes}</LikeCount>
            </LikeContainer>
          </SubContent>
        </CardContent>
      </CardBody>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  width: 240px;
  height: 320px;
  border-radius: 10px;
  background: #f4eeff;
  overflow: hidden;
  color: #7353ab;
  margin: 8px;
  transition: all 0.2s;

  &:hover {
    scale: 1.02;
  }
`;

const CardHead = styled.div`
  position: relative;
`;

const CardImage = styled.img`
  width: 100%;
  height: 220px;
  background: #e9dcff;
`;

const CardTitle = styled.h2`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 5px;
`;

const CardBody = styled.div`
  padding: 15px;
  position: relative;
`;

const CardContent = styled.div`
  margin-bottom: 5px;
`;

const PriceText = styled.h3`
  font-size: 18px;
  font-weight: 700;
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

const LikeContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const HeartIcon = styled(AiOutlineHeart)`
  cursor: pointer;
`;

const FillHeartIcon = styled(AiFillHeart)`
  cursor: pointer;
`;

const LikeCount = styled.p`
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
