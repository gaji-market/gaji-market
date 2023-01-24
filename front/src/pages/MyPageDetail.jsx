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
    currentPage: 1,
    totalPage: 1,
  });
  const nav = useNavigate();
  const { addToast } = useToast();
  const [endCard, inView] = useInView();

  const [getCard, { isLoading }] = usePostUserCardMutation('');
  const [cards, setCards] = useState([]);
  const { type: param } = useParams();

  async function getCardData() {
    try {
      console.log(pageInfo);

      const res = await getCard({ type: param, pageInfo }).unwrap();
      setPageInfo((prev) => ({
        ...prev,
        currentPage: pageInfo.currentPage + 1,
        totalPage: res.shcPage.totalPageCount,
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
    } else {
      getCardData();
    }
  }, [param]);

  useEffect(() => {
    console.log(cards);
  }, [cards]);
  useEffect(() => {
    if (inView) {
      getCardData();
    }
  }, [inView]);

  useEffect(() => {
    console.log(pageInfo);
  }, [pageInfo]);
  const moveProductDetail = (prodNo) => (e) => {
    const tagName = e.target.tagName;
    const interestIconTag = ['path', 'svg'];

    if (interestIconTag.includes(tagName)) return;
    nav(`/products/${param}/detail/${prodNo}`);
  };

  return (
    <Container>
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
      </CardContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 1200px;
`;
const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  .endDiv {
    width: 500px;
    height: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: -5;
    background-color: black;
  }
`;
