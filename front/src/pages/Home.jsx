import Button from 'components/Button';
import Card from 'components/Card';
import React from 'react';

export default function Home() {
  return (
    <>
      <div>Home</div>
      <Card title='title' price='123,000' area='서울시 동작구' likes='0' />
      <Button isOutline={false} btnSize='small'>
        기본 버튼
      </Button>
      <Button isOutline={true} btnSize='middle'>
        아웃라인 버튼
      </Button>
      <Button isOutline={false} btnSize='large'>
        버튼 사이즈 테스트
      </Button>
      <Button isOutline={true} customSize='700px'>
        버튼 사이즈 커스텀
      </Button>
    </>
  );
}
