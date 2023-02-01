import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { GrFormPrevious } from 'react-icons/gr';

import { WHITE_COLOR } from './commonColor';

export default function PrevButton({ navi = -1 }) {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate(navi);
  };

  return <Prev onClick={clickHandler} />;
}

const moveUpDown = keyframes`
  0% {
    transform : translateY(0px);
  }

  50% {
    transform : translateY(5px);
  }

  100%{
    transform : translateY(0px);
  }
`;

const Prev = styled(GrFormPrevious)`
  position: absolute;
  left: calc(50% - 320px);
  top: 185px;
  font-size: 50px;
  z-index: 10;
  transition: all 0.3s;
  cursor: pointer;

  animation: ${moveUpDown} 1s linear infinite;

  &:hover {
    scale: 1.2;
  }

  polyline {
    stroke: ${WHITE_COLOR};
  }
`;
