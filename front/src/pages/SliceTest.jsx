import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { add, subtract } from 'store/tempSlice';

export default function SliceTest() {
  const { number } = useSelector((state) => state.temp);
  const dispatch = useDispatch();

  const [action, setAction] = useState('add');
  const numberRef = useRef(null);

  const clickHandler = () => {
    if (action === 'add') {
      dispatch(add(numberRef.current.value));
    } else {
      dispatch(subtract(numberRef.current.value));
    }
  };

  return (
    <Wrapper>
      <Text>Store에 저장된 number: {number}</Text>
      <Text>
        Action 선택:
        <button
          onClick={() => setAction('add')}
          className={action === 'add' ? 'active' : ''}
        >
          더하기
        </button>
        <button
          onClick={() => setAction('subtract')}
          className={action === 'subtract' ? 'active' : ''}
        >
          빼기
        </button>
      </Text>
      <Text>
        숫자 입력:
        <input
          type='number'
          placeholder='숫자를 입력하시요'
          defaultValue={1}
          ref={numberRef}
        />
      </Text>
      <Button onClick={clickHandler}>계산</Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

const Text = styled.div`
  font-size: 24px;
  font-weight: bold;

  display: flex;
  align-items: center;
  column-gap: 8px;

  button.active {
    border: 4px solid red;
  }
`;

const Button = styled.button`
  font-size: 16px;
  font-weight: bold;
  background-color: violet;
  color: white;
  border: none;
  outline: none;
  padding: 8px 16px;
  border-radius: 4px;
`;
