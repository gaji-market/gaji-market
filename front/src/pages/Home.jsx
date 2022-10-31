import Button from 'components/Button';
import Card from 'components/Card';
import React from 'react';

export default function Home() {
  return (
    <>
      <div>Home</div>
      <Card title='title' price='123,000' area='서울시 동작구' likes='0' />
      <Button>basic</Button>
      <Button btnSize='sm'>sm</Button>
      <Button isOutline={true}>outline</Button>
      <Button btnSize='lg'>lg</Button>
      <Button isOutline={true} customSize='900px'>
        커스텀
      </Button>
    </>
  );
}
