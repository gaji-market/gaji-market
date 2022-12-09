import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from 'components/common/Button';
import CheckBox from 'components/common/Checkbox';
import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';

import {
  PRIMARY_COLOR,
  GRAY_COLOR,
  DARK_GRAY_COLOR,
  WHITE_COLOR,
} from 'components/common/commonColor';
import { useEffect } from 'react';
import { SELL, BUY } from '../constants/params';
import { TITLE, SUB_TITLE } from '../constants/editor';

export default function Editor() {
  const [imageSrc, setImageSrc] = useState('');
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');

  const { type: param } = useParams();
  useEffect(() => {
    if (param === SELL) {
      setTitle(TITLE.addPal);
      setSubTitle(SUB_TITLE.addPal);
    }

    if (param === BUY) {
      setTitle(TITLE.addSal);
      setSubTitle(SUB_TITLE.addSal);
    }
  }, [param]);

  const submitHandler = () => {
    console.log('test');
  };

  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImageSrc(reader.result);
        resolve();
      };
    });
  };

  const changeFileUploadHandler = (e) => {
    encodeFileToBase64(e.target.files[0]);
  };

  return (
    <Form onSubmit={submitHandler}>
      <Header>
        <Title>{title}</Title>
        <SubText>{subTitle}</SubText>
      </Header>

      <Contents>
        <ImageWrapper>
          {imageSrc && <Image src={imageSrc} alt='upload_image' />}
          {!imageSrc && (
            <ImageUpLoaderLabel htmlFor='image-uploader'>
              이미지 등록
            </ImageUpLoaderLabel>
          )}
          <ImageUpLoaderInput
            id='image-uploader'
            name='image-uploader'
            type='file'
            onChange={changeFileUploadHandler}
          />
        </ImageWrapper>

        <TitleAndPriceWrapper>
          <InputTitle title='제목' isRequired />
          <InputTextBox width='100%' padding='10px' placeholder='물품명' />

          <PriceTitleContainer>
            <div>
              <InputTitle isRequired title='가격'></InputTitle>
            </div>
            <CheckBoxWrapper>
              <CheckBox
                marginRight='140px'
                id='proposition'
                title='가격 제안 허용'
              />
            </CheckBoxWrapper>
          </PriceTitleContainer>

          <PriceInputContainer>
            <InputTextBox
              width='95%'
              padding='10px'
              placeholder='원'
              placeholderPosition='right'
            />
            <CheckBox width='110px' id='free' title='무료나눔' />
          </PriceInputContainer>
        </TitleAndPriceWrapper>

        <CategoryContainer>
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
        </CategoryContainer>

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
    </Form>
  );
}

const Form = styled.form`
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
  white-space: pre-line;
  line-height: 21px;
`;

const Contents = styled.div``;

// 이미지 업로드
const ImageWrapper = styled.div`
  margin-bottom: 20px;
`;

const ImageUpLoaderLabel = styled.label`
  width: 100%;
  display: block;
  background: ${GRAY_COLOR};
  color: ${WHITE_COLOR};
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
`;

const ImageUpLoaderInput = styled.input.attrs({
  multiple: true,
  accept: 'image/*',
})`
  display: none;
`;

const Image = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
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
`;

const CheckBoxWrapper = styled.div``;

const PriceInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const CategoryContainer = styled.div`
  margin-top: 20px;
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
  margin-top: 20px;
`;

const HashTageContainer = styled.div`
  margin-top: 20px;
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
