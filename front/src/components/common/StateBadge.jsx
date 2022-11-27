import React from 'react';
import styled from 'styled-components';

export default function StateBadge({ productState }) {
  return (
    <Container>
      <Text>{productState}</Text>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  font-size: 13px;
  bottom: 0;
  right: 0;
  margin: 15px;
`;

const Text = styled.div`
  background: #9747ff;
  color: #fff;
  padding: 5px;
  padding-top: 3px;
  border-radius: 10px;
`;
