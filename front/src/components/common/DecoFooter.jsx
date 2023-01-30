import styled from 'styled-components';

const TEMP_URL =
  'https://raw.githubusercontent.com/gaji-market/gaji-market/f2d195cf3cf5c1fff12f6cb141cf7385696b36df/front/src/assets/bg_bottom.png';

export default function DecoFooter() {
  return (
    <>
      <Deco className='bottom-deco' src={TEMP_URL} alt='deco' />
    </>
  );
}

const Deco = styled.img`
  position: absolute;
  left: -250px;
  bottom: -20px;
  opacity: 0.5;
`;
