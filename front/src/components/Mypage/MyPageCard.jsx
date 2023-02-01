import styled from 'styled-components';
import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';
import { GRAY_COLOR } from '../common/commonColor';
import useToast from 'hooks/toast';

export default function MyPageCard({ title, cardList, totalCount, detail }) {
  const nav = useNavigate();
  const { addToast } = useToast();

  const moveProductDetail = (prodNo, tradeKind) => () => {
    if (tradeKind === '0') {
      nav(`/products/pal/detail/${prodNo}`);
    } else {
      nav(`/products/sal/detail/${prodNo}`);
    }
  };

  function onClickHanlder() {
    if (totalCount === 0) {
      addToast({
        isToastSuccess: false,
        isMainTheme: true,
        toastTitle: '페이지 이동 실패',
        toastMessage: '리스트가 없습니다.',
      });
    } else {
      nav(detail);
    }
  }
  function CardComponent({ cards }) {
    return (
      <>
        {cards?.length > 0 &&
          cards.map((product) => {
            const {
              address,
              dbFileName,
              likeCnt,
              prodName,
              prodNo,
              prodPrice,
              tradState,
              tradeKind,
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
                area={address}
                likes={likeCnt}
                isInterest={1}
                state={tradState}
                onClick={moveProductDetail(prodNo, tradeKind)}
              />
            );
          })}
      </>
    );
  }
  return (
    <>
      <ProductHead>
        <ProductHeadTitle>{title}</ProductHeadTitle>
        <ProductHeadSubtext onClick={onClickHanlder}>
          더보기({totalCount})
        </ProductHeadSubtext>
      </ProductHead>
      <ProductSection>
        {totalCount === 0 ? (
          <NoProduct>리스트가 없습니다.</NoProduct>
        ) : (
          <ProductCard>
            <CardComponent cards={cardList} />
          </ProductCard>
        )}
      </ProductSection>
    </>
  );
}

const ProductHead = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
`;

const ProductCard = styled.div`
  display: flex;
  margin-bottom: 25px;
`;

const NoProduct = styled.span`
  width: 100%;
  margin: 40px 0px;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  color: ${GRAY_COLOR};
`;

const ProductHeadTitle = styled.div`
  margin-top: 20px;
  font-size: 24px;
  font-weight: 700;
  padding-left: 7px;
`;

const ProductHeadSubtext = styled.div`
  margin-left: 15px;
  margin-right: 15px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ProductSection = styled.div`
  display: flex;
`;
