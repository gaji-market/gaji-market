import styled from 'styled-components';

import { PRIMARY_COLOR, SUB_COLOR } from '../components/common/commonColor';
import Button from '../components/common/Button';

import {
  AiOutlineAlert,
  AiOutlineEye,
  AiOutlineHeart,
  AiFillHeart,
} from 'react-icons/ai';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { RiTimerLine } from 'react-icons/ri';

// 백엔드한테 데이터 받으면 바꾸기
const PREFIX = '#';
const HASH_TAGS = ['여러가지', '나뭇가지', '손모가지', '모가지', '가지'];

const TEMP_COLOR = '#aaa';

export default function ProductDetailView({ reportCount = 0 }) {
  return (
    <Container>
      <Categories>{'카테고리 > 카테고리2 > 카테고리3'}</Categories>
      <ProductTop>
        <ProductImg />
        <ProductSummary>
          <Watcher>
            <WatcherIcon />
            <WatcherCount>1,000</WatcherCount>
          </Watcher>
          <ProductState>판매중</ProductState>
          <Title>상품명</Title>
          <Price>99,000원</Price>
          <StatusWrapper>
            <Status>
              <Report>
                <ReportIcon />
                <span>신고 {reportCount}회</span>
                <VerticalBar>|</VerticalBar>
                <span>신고하기</span>
              </Report>
              <Location>
                <LocationIcon />
                <span>경기도 부천시 중동</span>
              </Location>
              <DateCreated>
                <DateIcon />
                <span>2022.11.25 AM 12:49</span>
              </DateCreated>
            </Status>
            <LikesWrapper>
              <HeartIcon />
              <LikesCount>444</LikesCount>
            </LikesWrapper>
          </StatusWrapper>

          <ButtonWrapper>
            <Button customSize='50%'>채팅하기</Button>
            <Button isOutline isDarkColor customSize='50%'>
              가격 제안하기
            </Button>
          </ButtonWrapper>
          <HashTags>
            {HASH_TAGS.map((tag, idx) => {
              return (
                <HashTag key={`임시 key ${idx}`}>
                  {PREFIX}
                  {tag}
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
              <UserNickName>유토</UserNickName>
              <UserArea>경기도 부천시</UserArea>
            </div>
          </ProfileWrapper>
          <Button isDarkColor>정보보기</Button>
        </UserInfo>
      </ProductMid>
      <ProductBottom>
        <ProductInfoTitle>상품정보</ProductInfoTitle>
        <p>🍆팔아요</p>
      </ProductBottom>
    </Container>
  );
}

const Container = styled.div`
  width: 1200px;
  padding-top: 30px;
  padding-left: 50px;
  padding-right: 50px;
  position: relative;
  color: ${TEMP_COLOR};
`;

const Categories = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 23px;
`;

const ProductTop = styled.div`
  height: 480px;
  display: flex;
  border-bottom: 1px solid #ddd;
  align-items: center;
  justify-content: space-around;
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

const ProductImg = styled.div`
  width: 40%;
  height: 400px;
  background: #ddd;
  border-radius: 10px;
`;

const ProductState = styled.p`
  font-size: 18px;
  color: ${PRIMARY_COLOR};
  font-weight: 700;
`;

const Title = styled.h2`
  font-size: 35px;
  font-weight: 700;
  color: ${SUB_COLOR};
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
`;

const VerticalBar = styled.span`
  margin-left: 5px;
  margin-right: 5px;
`;

const ReportIcon = styled(AiOutlineAlert)`
  font-size: 23px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const LocationIcon = styled(HiOutlineLocationMarker)`
  font-size: 23px;
`;

const DateCreated = styled.div`
  display: flex;
  align-items: center;
`;

const DateIcon = styled(RiTimerLine)`
  font-size: 23px;
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
  font-weight: 700;
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
  font-weight: 700;
  color: ${SUB_COLOR};
  margin-bottom: 20px;
`;
