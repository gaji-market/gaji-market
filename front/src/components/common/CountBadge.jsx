import React from 'react';
import styled from 'styled-components';
import colors from 'components/common/commonColor';

export default function CountBadge({ color = 'RED', count, style }) {
  return (
    <Container color={`${color}_COLOR`} style={style}>
      {count}
    </Container>
  );
}

const Container = styled.div`
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 20px;
  height: 20px;
  border-radius: 20px;

  font-size: 12px;
  font-weight: bold;

  color: ${colors.WHITE_COLOR};
  background-color: ${({ color }) => colors[color]};
`;
