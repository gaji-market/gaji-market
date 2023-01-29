import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams, useNavigate } from 'react-router-dom';

import useToast from 'hooks/toast';

import { usePostUserCardMutation } from 'services/signUpApi';

import Card from 'components/common/Card';
import { TITLE, LIST_NAME, VALID_PAGE } from 'constants/mypage';

export default function MyPageDetail() {
  const [pageInfo, setPageInfo] = useState({
    totalPage: 1,
    currentPage: 1,
  });
  const nav = useNavigate();
  const { addToast } = useToast();
  const [endCard, inView] = useInView();

  const [getCard] = usePostUserCardMutation('');
  const [cards, setCards] = useState([]);
  const { type: param } = useParams();

  async function getCardData() {
    try {
      const res = await getCard({
        type: param,
        pageInfo,
      }).unwrap();

      setPageInfo((prev) => ({
        ...prev,
        totalPage: res.shcPage.totalPageCount,
        currentPage: prev.currentPage + 1,
      }));

      setCards((prev) => [...prev, ...res[LIST_NAME[param]]]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!VALID_PAGE.includes(param)) {
      addToast({
        isToastSuccess: false,
        isMainTheme: true,
        toastTitle: '잘못된 접근!',
        toastMessage: '정상적이지 않은 페이지에 접속하셨습니다.',
      });
      nav('/mypage');
    }
  }, [param]);

  useEffect(() => {
    if (pageInfo.currentPage > pageInfo.totalPage && pageInfo.currentPage !== 1)
      return;
    if (inView) {
      getCardData();
    }
  }, [inView, pageInfo.currentPage]);

  const moveProductDetail = (prodNo) => (e) => {
    const tagName = e.target.tagName;
    const interestIconTag = ['path', 'svg'];

    if (interestIconTag.includes(tagName)) return;
    nav(`/products/${param}/detail/${prodNo}`);
  };

  return (
    <Container>
      <Title>{TITLE[param]}</Title>
      <CardContainer>
        {cards.length > 0 &&
          cards.map((product) => {
            const {
              address,
              dbFileName,
              likeCnt,
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
                price={prodPrice?.toLocaleString()}
                prodNo={prodNo}
                area={address}
                likes={likeCnt?.toLocaleString()}
                state={tradState}
                onClick={moveProductDetail(prodNo)}
              />
            );
          })}
        <div className='endDiv' ref={endCard}></div>
      </CardContainer>
    </Container>
  );
}
const Title = styled.div`
  margin-top: 50px;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 15px;
  padding-left: 5px;
`;
const Container = styled.div`
  width: 1200px;
`;
const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0 auto;
  position: relative;
  margin-bottom: 50px;

  .endDiv {
    width: 250px;
    height: 250px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: -5;
  }
`;
