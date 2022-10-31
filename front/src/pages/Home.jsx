import Button from 'components/common/Button';
import Card from 'components/common/Card';
import React from 'react';

export default function Home() {
  return (
    <>
      <div>Home</div>
      <Card title='title' price='123,000' area='서울시 동작구' likes='0' />
      <Button>basic</Button>
      <Button btnSize='sm' isDarkColor>
        sm
      </Button>
      <Button isOutline>outline</Button>
      <Button isOutline isDarkColor={true}>
        outline - dark
      </Button>
      <Button isDarkColor customSize='700px'>
        커스텀
      </Button>
    </>
  );
}
