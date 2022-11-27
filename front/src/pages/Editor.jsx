import React from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import CheckBox from '../components/common/Checkbox';
import { PRIMARY_COLOR } from '../components/common/commonColor';
import InputTextBox from '../components/common/InputTextBox';
import InputTitle from '../components/common/InputTitle';

const TEMP_COLOR = '#555';
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
          <Image />
          <div>
            <InputTitle title='제목' isRequired />
            <InputTextBox padding={PADDING} placeholder='물품명' />

            <PriceTitleContainer>
              <div>
                <InputTitle isRequired title='가격'></InputTitle>
              </div>
              <CheckBox id='proposition' title='가격 제안 허용' />
            </PriceTitleContainer>

            <PriceInputContainer>
              <InputTextBox
                padding={PADDING}
                placeholder='원'
                placeholderPosition='right'
              />
              <CheckBox id='free' title='무료나눔' />
            </PriceInputContainer>
          </div>
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
          <InputTitle title='내용' />
          <br />
          <TextArea placeholder='물품 상세 정보를 입력해주세요.' />
        </InputContent>

        <HashTageContainer>
          <InputTitle title='해시태그' />
          <InputTextBox width='80%' placeholder='#해시태그' />
        </HashTageContainer>
      </Contents>
      <ButtonContainer>
        <Button customSize='350px'>수정하기</Button>
        <Button customSize='350px' isOutline>
          취소하기
        </Button>
      </ButtonContainer>
    </Container>
  );
}

// 나중에 form 으로 변경하기

const Container = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 500px;
`;

const Header = styled.div``;

const Title = styled.h2`
  font-size: 25px;
  font-weight: 700;
`;

const SubText = styled.div`
  color: ${TEMP_COLOR};
  margin-top: 10px;
`;

const Contents = styled.div``;

const ContentHeader = styled.div`
  display: flex;
`;

const Image = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 10px;
  background: ${TEMP_COLOR};
  margin-right: 30px;
  margin-bottom: 30px;
`;

const PriceTitleContainer = styled.div`
  width: 800px;
  display: flex;
  align-items: center;
  margin-top: 15px;
  gap: 20px;
`;

const PriceInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Categories = styled.div`
  display: flex;
`;

const Select = styled.select`
  display: block;
  margin-right: 10px;
  width: 200px;
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
  margin-top: 20px;
`;

const HashTageContainer = styled.div``;

const TextArea = styled.textarea`
  min-width: 600px;
  max-width: 50%;
  min-height: 100px;
  max-height: 300px;
  border-radius: 10px;
  padding: 10px;

  &:focus {
    outline: 1px solid ${PRIMARY_COLOR};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;
