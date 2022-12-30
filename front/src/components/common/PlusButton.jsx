import { PRIMARY_COLOR } from './commonColor';
import { CgMathPlus } from 'react-icons/cg';
import styled from 'styled-components';

export default function PlusButton({ customSize, onClick }) {
  return (
    <Container>
      <Bg onClick={onClick} customSize={customSize}>
        <Plus customsize={customSize} />
      </Bg>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const Bg = styled.div`
  width: ${({ customSize }) => customSize || '70px'};
  height: ${({ customSize }) => customSize || '70px'};
  border-radius: 160px;
  background: ${PRIMARY_COLOR};
  box-shadow: 1px 3px 4px #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0;
  transition: all 0.2s;

  ${({ customSize }) =>
    !customSize &&
    `
    margin : 0 auto;
    z-index: 1000;
    position: fixed;
    bottom: 50px;
    right : 50px;
  `}

  &:hover {
    background: #843de0;
  }
`;

const Plus = styled(CgMathPlus)`
  color: white;
  text-align: center;
  font-size: ${({ customsize }) => (customsize ? `${parseInt(customsize) - 15}px` : '50px')};
`;
