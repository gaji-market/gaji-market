/* eslint-disable indent */
import styled, { css, keyframes } from 'styled-components';
import { BsCheckCircle } from 'react-icons/bs';
import { TiWarning } from 'react-icons/ti';

import { PRIMARY_COLOR, WHITE_COLOR } from './commonColor';
import useToast from 'hooks/toast';
import { useSelector } from 'react-redux';

export default function Toast() {
  const toasts = useSelector((state) => state.toast.toasts);

  const { deleteToast } = useToast();

  return (
    <ToastContainer>
      {toasts.map((toast) => {
        return (
          <ToastBox
            key={toast.id}
            isToastSuccess={toast.isToastSuccess}
            isMainTheme={toast.isMainTheme}
            toastPosition={toast.position}
            onClick={() => deleteToast(toast.id)}
          >
            {toast.isToastSuccess ? (
              <CheckCircleIcon className='Check' size='35' />
            ) : (
              <WarningIcon className='Check' size='40' />
            )}
            <div className='toast-messages'>
              <h3>{toast.toastTitle}</h3>
              <Blank />
              {toast.toastMessage}
            </div>
          </ToastBox>
        );
      })}
    </ToastContainer>
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
const ToastContainer = styled.div`
  z-index: 1000000000;
  position: absolute;
  right: 3%;
  top: 7%;
`;

const ToastBox = styled.div`
  min-width: 300px;
  font-size: 15px;
  position: relative;
  margin-bottom: 15px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  padding: 15px 25px 15px 0;
  display: flex;
  align-items: center;
  word-wrap: break-word;
  color: red;
  animation: ${toastFadeIn} 0.3s 0s linear forwards,
    ${toastFadeOut} 0.5s 3s linear forwards;

  .Check {
    margin-right: 15px;
  }

  .toast-messages {
    font-weight: 500;

    > h3 {
      font-weight: 900;
    }
  }

  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 300px;
    background: #ff7e92;
  }

  ${({ isMainTheme }) =>
    isMainTheme &&
    css`
      color: ${WHITE_COLOR};
      &::before {
        background: #f8f1f1;
        position: absolute;
      }
      background: #cc3636;
    `}

  ${({ isToastSuccess }) =>
    isToastSuccess &&
    css`
      color: #6418ba;
      &::before {
        background: #6418ba;
        position: absolute;
      }
      background: ${WHITE_COLOR};
    `}

  ${({ isToastSuccess, isMainTheme }) =>
    isToastSuccess &&
    isMainTheme &&
    css`
      color: ${WHITE_COLOR};
      &::before {
        background: #6418ba;
      }
      background: ${PRIMARY_COLOR};
    `}
`;

const Blank = styled.div`
  margin-top: 5px;
  width: 100px;
`;

const WarningIcon = styled(TiWarning)`
  font-size: 23px;
  margin-left: 30px;
`;

const CheckCircleIcon = styled(BsCheckCircle)`
  margin-left: 30px;
`;
