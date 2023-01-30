import styled from 'styled-components';
import { GRAY_COLOR } from './commonColor';

export default function Footer() {
  return (
    <Container className='footer-contents'>
      <h3>GAJI-MARKET</h3>
      <p>2023 © GajiMarket All Rights Reserved.</p>
    </Container>
  );
}

const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
  margin-top: 50px;

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: ${GRAY_COLOR};
  }

  p {
    font-size: 14px;
    color: ${GRAY_COLOR};
    padding-bottom: 20px;
  }
`;
