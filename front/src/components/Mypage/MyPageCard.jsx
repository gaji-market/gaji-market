import styled from 'styled-components';
import PlusButton from 'components/common/PlusButton';
import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';
import { PRIMARY_COLOR } from '../common/commonColor';
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
        <ProductHeadSubtext>더보기({totalCount})</ProductHeadSubtext>
        <PlusButton customSize='35px' onClick={onClickHanlder} />
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
`;
const NoProduct = styled.div`
  margin: 40px 0px;
  font-weight: 700;
  font-size: 30px;
  color: ${PRIMARY_COLOR};
`;
const ProductHeadTitle = styled.div`
  margin-top: 20px;
  font-size: 30px;
  font-weight: 800;
`;
const ProductHeadSubtext = styled.div`
  margin-left: 15px;
  margin-right: 15px;
`;
const ProductSection = styled.div`
  display: flex;
  justify-content: center;
`;
