import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { useScoreSaveMutation } from 'services/productApi';

import Button from '../common/Button';

import {
  DARK_GRAY_COLOR,
  GRAY_COLOR,
  PRIMARY_COLOR,
  WHITE_COLOR,
} from '../common/commonColor';
import { ReactComponent as GradationLogo } from 'assets/GradationLogo.svg';
import { AiFillStar } from 'react-icons/ai';

const INIT_RATES = {
  promise: 3,
  kind: 3,
  product: 3,
};

const RATELIST = [
  {
    key: 'promise',
    label: '약속을 잘 지켜요',
  },
  {
    key: 'kind',
    label: '친절해요',
  },
  {
    key: 'product',
    label: '물건이 좋아요',
  },
];

const FinishChatModal = forwardRef(({ prodNo, userNo }, ref) => {
  const [scoreSave] = useScoreSaveMutation();

  const textareaRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [rates, setRates] = useState(INIT_RATES);

  useImperativeHandle(ref, () => ({
    showModal() {
      setVisible(true);
    },

    closeModal(e) {
      if (e.target !== e.currentTarget) return;
      setVisible(false);
    },
  }));

  const onClickHandler = async () => {
    try {
      await scoreSave({
        userNo: userNo,
        prodNo: prodNo,
        score1: rates.promise,
        score2: rates.kind,
        score3: rates.product,
        tradeReview: textareaRef.current.value || '',
      }).unwrap();
      setRates(INIT_RATES);
      setVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {visible && (
        <Bg className='modalBg' onClick={ref.current.closeModal} ref={ref}>
          <Card>
            <h3>
              <GradationLogo height='36px' />
              소중한 후기를 남겨 주세요!
            </h3>
            <Reviews>
              {RATELIST.map((item) => (
                <Review key={item.key}>
                  <p>{item.label}</p>
                  {Array.from(new Array(rates[item.key])).map((_, idx) => (
                    <AiFillStar
                      size={24}
                      color={PRIMARY_COLOR}
                      key={`${item.key}_fill_${idx}`}
                      onClick={() =>
                        setRates((prev) => ({
                          ...prev,
                          [item.key]: idx + 1,
                        }))
                      }
                    />
                  ))}
                  {Array.from(new Array(5 - rates[item.key])).map((_, idx) => (
                    <AiFillStar
                      size={24}
                      color={GRAY_COLOR}
                      key={`${item.key}_empty_${idx}`}
                      onClick={() =>
                        setRates((prev) => ({
                          ...prev,
                          [item.key]: prev[item.key] + idx + 1,
                        }))
                      }
                    />
                  ))}
                </Review>
              ))}
            </Reviews>
            <Textarea ref={textareaRef} placeholder='이번 거래 어떠셨나요?' />
            <ButtonWrapper>
              <Button onClick={onClickHandler}>후기 등록</Button>
              <Button isDarkColor isOutline onClick={ref.current.closeModal}>
                취소
              </Button>
            </ButtonWrapper>
          </Card>
        </Bg>
      )}
    </>
  );
});

export default FinishChatModal;

const Bg = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: #00000050;
  overflow: hidden;
  position: fixed;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: ${WHITE_COLOR};
  width: 500px;
  padding: 32px 32px 16px 32px;
  border-radius: 10px;
  z-index: 999;
  box-shadow: 3px 3px 30px #9747ff41;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 3px solid ${PRIMARY_COLOR};
  font-size: 18px;

  h3 {
    font-weight: bold;
    display: flex;
    align-items: center;
  }

  div {
    width: 100%;
    color: ${DARK_GRAY_COLOR};
  }
`;

const Reviews = styled.div`
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

const Review = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    width: 160px;
  }

  svg:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

const Textarea = styled.textarea`
  width: 320px;
  height: 52px;
  padding: 16px;
  margin-top: 10px;
  margin-bottom: 24px;
  box-sizing: border-box;
  resize: none;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;
