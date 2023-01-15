import styled, { keyframes, css } from 'styled-components';
import gajiImg from 'assets/BasicLogo.svg';
export default function Loading() {
  return (
    <Container>
      <LoadingIMG left='60px'></LoadingIMG>
      <LoadingIMG left='0px'></LoadingIMG>
      <LoadingIMG left='-60px'></LoadingIMG>
    </Container>
  );
}

// 로딩 될 때 보여질 스피너 또는 화면 구상하기

const moveImageFirst = keyframes`
    0%{
      transform:translateX(-55px)  rotate(0deg) 
    }
    50%{
      transform:translateX(40px)  rotate(360deg) 
    }  
    100%{
      transform:translateX(-55px)  rotate(0deg) 
    }    
`;
const moveImageMiddle = keyframes`
      0%{
      transform: rotate(0deg) 
    }
    50%{
      transform: rotate(360deg) 
    }  
    100%{
      transform:  rotate(0deg) 
    }    
`;
const moveImageLast = keyframes`
    0%{
      transform:translateX(55px)  rotate(0deg) 
    }
    50%{
      transform:translateX(-40px)  rotate(360deg) 
    }  
    100%{
      transform:translateX(55px)  rotate(0deg) 
    }    
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  div {
    &:first-child {
      animation: ${moveImageFirst} 2s infinite;
    }
    &:nth-child(2) {
      animation: ${moveImageMiddle} 2s infinite;
    }
    &:last-child {
      animation: ${moveImageLast} 2s infinite;
    }
  }
`;

const LoadingIMG = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  background-image: url(${gajiImg});
  transform-origin: 50% 50%;
  left: ${({ left }) => left};
`;
