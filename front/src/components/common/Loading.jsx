import styled from 'styled-components';

export default function Loading() {
  return (
    <Container>
      <LoadingText>Loading...</LoadingText>
    </Container>
  );
}

// 로딩 될 때 보여질 스피너 또는 화면 구상하기

const Container = styled.div``;

const LoadingText = styled.h2`
  font-size: 36px;
`;
