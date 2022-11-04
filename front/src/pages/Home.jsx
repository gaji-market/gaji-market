import Button from 'components/common/Button';
import Card from 'components/common/Card';
import PlusButton from 'components/common/PlusButton';
import React from 'react';

export default function Home() {
  return (
    <>
      <div>Home</div>

      {/* 공통 컴포넌트 미리보기 (임시 적용) */}
      <div>
        <Card title='공통 컴포넌트' price='123,000' area='미리보기' likes='0' />

        {/* 버튼 컴포넌트 사용 예시입니다. */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button>basic</Button>
          <Button size='sm' isDarkColor>
            sm
          </Button>
          <Button isOutline>outline</Button>
          <Button isOutline isDarkColor>
            outline - dark
          </Button>
          <Button isDarkColor customSize='700px'>
            custom
          </Button>
        </div>

        {/* PlusButton은 커스텀 사이즈 사용시 최소 30px 이상으로 설정해주세요. */}
        <div style={{ marginTop: '10px', display: 'flex' }}>
          <PlusButton customSize={'35px'} />
          <PlusButton customSize={'40px'} />
          <PlusButton customSize={'50px'} />
          <PlusButton customSize={'60px'} />
        </div>
        <PlusButton />
      </div>
    </>
  );
}
