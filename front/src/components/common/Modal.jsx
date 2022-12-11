import { useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from './Button';
import { PRIMARY_COLOR, WHITE_COLOR } from './commonColor';
import { SELL, BUY } from 'constants/params';

const Modal = forwardRef(({ text, leftBtnText, rightBtnText }, ref) => {
  const { type } = useParams();
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    showModal() {
      setVisible(true);
    },

    closeModal(e) {
      if (e.target !== e.currentTarget) return;
      setVisible(false);
    },

    movePage() {
      if (type === SELL) {
        navigate('/write/pal');
      }

      if (type === BUY) {
        navigate('/write/sal');
      }
    },
  }));

  return (
    <>
      {visible && (
        <Bg className='modalBg' onClick={ref.current.closeModal} ref={ref}>
          <Card>
            <p>{text}</p>
            <ButtonWrapper>
              <Button onClick={ref.current.movePage}>{leftBtnText}</Button>
              <Button isDarkColor isOutline onClick={ref.current.closeModal}>
                {rightBtnText}
              </Button>
            </ButtonWrapper>
          </Card>
        </Bg>
      )}
    </>
  );
});

export default Modal;

const Bg = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: #4949491f;
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
  height: 200px;
  border-radius: 10px;
  z-index: 999;
  box-shadow: 3px 3px 30px #9747ff41;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  border: 3px solid ${PRIMARY_COLOR};
  font-size: 18px;

  p {
    margin-top: 15px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;
