import { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { BsCheckCircle, BsXLg } from 'react-icons/bs';

export default function Toast({ toast, setToast, durationTime = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, isToastAppear: false }));
    }, durationTime);

    return () => {
      clearTimeout(timer);
    };
  });
  return (
    <ToastBox isToastSuccess={toast.isToastSuccess}>
      {toast.isToastSuccess ? (
        <BsCheckCircle className='Check' size='35' color='#51ff00' />
      ) : (
        <BsXLg className='Check' size='35' color='#fa95a4' />
      )}
      {toast.toastMessage}
    </ToastBox>
  );
}
const toastFadeIn = keyframes`
    from{
        opacity:0;
    }
    to{
        opacity:1;
    }
`;

const ToastBox = styled.div`
  position: absolute;
  top: 1px;
  left: 50%;
  padding: 30px 30px;
  background-color: #ffb6c1;
  border-radius: 20px;
  width: 400px;
  transform: translate(-50%, 0%);
  display: flex;
  justify-content: center;
  align-items: center;

  word-wrap: break-word;
  box-shadow: 0px -5px 3px 1px #fa95a4 inset;
  animation: ${toastFadeIn} 1s 0s linear forwards;

  .Check {
    margin-right: 15px;
  }

  ${({ isToastSuccess }) =>
    isToastSuccess &&
    css`
      background: #a6fcd2;
      box-shadow: 0px -5px 3px 1px #a3f1ca inset;
    `}
`;
