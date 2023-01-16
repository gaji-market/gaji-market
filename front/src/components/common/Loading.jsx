import styled, { keyframes, css } from 'styled-components';
import gajiImg from 'assets/BasicLogo.svg';
import { PRIMARY_COLOR } from './commonColor';
const TEXT_DELAY = [
  ['L', '0.1s'],
  ['o', '0.2s'],
  ['a', '0.3s'],
  ['d', '0.4s'],
  ['i', '0.5s'],
  ['n', '0.6s'],
  ['g', '0.7s'],
  ['.', '0.8s'],
  ['.', '0.9s'],
  ['.', '1.0s'],
  ['.', '1.1s'],
];
export default function Loading() {
  return (
    <Container>
      <IMG>
        <LoadingIMG animationName={moveImageFirst} left='60px'></LoadingIMG>
        <LoadingIMG animationName={moveImageMiddle} left='0px'></LoadingIMG>
        <LoadingIMG animationName={moveImageLast} left='-60px'></LoadingIMG>
      </IMG>
      <Text>
        {TEXT_DELAY.map((v) => {
          return <LoadingText delay={v[1]}>{v[0]}</LoadingText>;
        })}
      </Text>
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
const TextAnimation = keyframes`
  0%{
    transform:translateY(0px) 
  }
  50%{
    transform:translateY(30px) 
  }
  100%{
    transform:translateY(0px) 
  }
`;
const IMG = styled.div`
  display: flex;
`;
const Text = styled.div`
  font-size: 50px;
  color: ${PRIMARY_COLOR};
  font-weight: 800;
  display: flex;
`;
const LoadingText = styled.div`
  margin-left: 5px;
  animation: ${TextAnimation} 2s infinite;
  animation-delay: ${(props) => props.delay};
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const LoadingIMG = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  background-image: url(${gajiImg});
  left: ${({ left }) => left};
  animation: ${(props) => props.animationName} 2s infinite;
`;
