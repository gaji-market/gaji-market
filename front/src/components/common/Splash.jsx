import styled from 'styled-components';

import bgImg from 'assets/gaji-market_bg.png';

export default function Splash({ refObj }) {
  return (
    <Container>
      <img
        // className='fade-in'
        src={bgImg}
        alt='gaji-market_bg.png'
        ref={refObj}
      />
    </Container>
  );
}

const Container = styled.div`
  z-index: 10000000000;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;

  img {
    width: 100vw;
    height: 100vh;
  }
`;
