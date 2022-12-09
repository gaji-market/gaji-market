import React from 'react';
import styled from 'styled-components';
import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';

import {
  PRIMARY_COLOR,
  GRAY_COLOR,
  DARK_GRAY_COLOR,
} from '../components/common/commonColor';

const PADDING = '10px';

export default function Editor() {
  return (
    <Container>
      <Header>
        <Title>팔래요 수정하기</Title>
        <SubText>썸네일을 포함한 이미지를 1장 이상 업로드 해주세요.</SubText>
      </Header>

      <Contents>
        <ContentHeader>
          <ImageWrapper>
            <Image />
          </ImageWrapper>

          <TitleAndPriceWrapper>
            <InputTitle title='제목' isRequired />
            <InputTextBox width='100%' padding={PADDING} placeholder='물품명' />

            <PriceTitleContainer>
              <div>
                <InputTitle isRequired title='가격'></InputTitle>
              </div>
              <CheckBoxWrapper>
                <CheckBox id='proposition' title='가격 제안 허용' />
              </CheckBoxWrapper>
            </PriceTitleContainer>

            <PriceInputContainer>
              <InputTextBox
                width='95%'
                padding={PADDING}
                placeholder='원'
                placeholderPosition='right'
              />
              <CheckBox width='110px' id='free' title='무료나눔' />
            </PriceInputContainer>
          </TitleAndPriceWrapper>
        </ContentHeader>

        <InputTitle title='카테고리' isRequired />
        <Categories>
          <Select>
            <Option>option</Option>
          </Select>
          <Select>
            <Option>option</Option>
          </Select>
          <Select>
            <Option>option</Option>
          </Select>
        </Categories>

        <InputContent>
          <InputTitle isRequired title='내용' />
          <br />
          <TextArea placeholder='물품 상세 정보를 입력해주세요.' />
        </InputContent>

        <HashTageContainer>
          <InputTitle title='해시태그' />
          <InputTextBox width='100%' placeholder='#해시태그' />
        </HashTageContainer>
      </Contents>
      <ButtonContainer>
        <Button customSize='50%'>수정하기</Button>
        <Button customSize='50%' isOutline>
          취소하기
        </Button>
      </ButtonContainer>
    </Container>
  );
}

// 나중에 form 으로 변경하기

const Container = styled.div`
  width: 800px;
  margin: 0 auto;
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 100%;
`;

const Header = styled.div``;

const Title = styled.h2`
  font-size: 25px;
  font-weight: 700;
`;

const SubText = styled.div`
  color: ${DARK_GRAY_COLOR};
  margin-top: 10px;
`;

const Contents = styled.div``;

const ContentHeader = styled.div`
  display: flex;
`;

const ImageWrapper = styled.div``;

const Image = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 10px;
  background: ${GRAY_COLOR};
  margin-right: 30px;
  margin-bottom: 30px;
`;

const TitleAndPriceWrapper = styled.div`
  flex-grow: 2;
  width: 100%;
`;

const PriceTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  gap: 20px;
`;

const CheckBoxWrapper = styled.div`
  margin-right: 123px;
`;

const PriceInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Categories = styled.div`
  display: flex;
  width: 100%;
`;

const Select = styled.select`
  display: block;
  margin-right: 10px;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;

  &:focus {
    outline: 1px solid ${PRIMARY_COLOR};
  }
`;

const Option = styled.option`
  color: ${PRIMARY_COLOR};
`;

const InputContent = styled.div`
  margin-top: 25px;
`;

const HashTageContainer = styled.div`
  margin-top: 25px;
`;

const TextArea = styled.textarea`
  min-width: 100%;
  max-width: 100%;

  min-height: 200px;
  max-height: 300px;

  border-radius: 10px;
  border: 2px solid ${GRAY_COLOR};
  padding: 10px;
  margin-top: 8px;

  &:focus {
    outline: 1px solid ${PRIMARY_COLOR};
  }

  &::placeholder {
    color: ${GRAY_COLOR};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
`;
