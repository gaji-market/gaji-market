/* eslint-disable indent */
import { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { BsCheckCircle } from 'react-icons/bs';
import { RiForbid2Line } from 'react-icons/ri';

import { PRIMARY_COLOR } from './commonColor';

export default function Toast({ toast, setToast, durationTime = 5000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, isToastAppear: false }));
    }, durationTime);
    console.log(toast);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <ToastBox
      isToastSuccess={toast.isToastSuccess}
      isMainTheme={toast.isMainTheme}
      toastPosition={toast.position}
    >
      {toast.isToastSuccess ? (
        <BsCheckCircle className='Check' size='35' />
      ) : (
        <RiForbid2Line className='Check' size='35' />
      )}
      {toast.toastTitle}
      {toast.toastMessage}
    </ToastBox>
  );
}

const toastFadeIn = keyframes`
from{
  opacity:0;
  transform:translate(100px,0px)

}

to{
  opacity:1;
  transform:translate(0px,0px)
  }
`;

const toastFadeOut = keyframes`
from{
  opacity:1;
  transform:translate(0px,0px)

}

to{
      opacity:0;
      transform:translate(500px,0px)
  }
`;
const ToastBox = styled.div`
  position: absolute;
  overflow: hidden;

  right: 3%;

  background-color: #fcccd3;
  border-radius: 10px;
  width: 400px;
  display: flex;
  align-items: center;
  word-wrap: break-word;
  color: red;

  animation: ${toastFadeIn} 1s 0s linear forwards, ${toastFadeOut} 2s 3s linear forwards;

  .Check {
    margin-right: 15px;
  }

  &::before {
    content: '';
    width: 15px;
    height: 80px;
    background: #ff7e92;
    margin-right: 50px;
  }

  ${({ toastPosition }) => css`
    top: ${toastPosition === 'top' ? '5%' : toastPosition === 'center' ? '40%' : '85%'};
  `}

  ${({ isMainTheme }) =>
    isMainTheme &&
    css`
      color: white;
      &::before {
        background: #ff1c3e;
      }
      background: #fc5c74;
    `}

  ${({ isToastSuccess }) =>
    isToastSuccess &&
    css`
      color: ${PRIMARY_COLOR};
      &::before {
        background: #7307ff;
      }
      background: #ececece2;
    `}

  ${({ isToastSuccess, isMainTheme }) =>
    isToastSuccess &&
    isMainTheme &&
    css`
      color: white;
      &::before {
        background: #7307ff;
      }
      background: ${PRIMARY_COLOR};
    `}
`;
