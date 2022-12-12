import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';
import Button from 'components/common/Button';
import CheckBox from 'components/common/Checkbox';
import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';

import 'styles/editor.scss';

import {
  PRIMARY_COLOR,
  GRAY_COLOR,
  DARK_GRAY_COLOR,
  WHITE_COLOR,
} from 'components/common/commonColor';
import { SELL, BUY } from 'constants/params';
import { TITLE, SUB_TITLE } from 'constants/editor';

const MAX_UPLOAD_COUNT = 5;
const NEXT_X = -690;

export default function Editor() {
  const [formDatas, setFormDatas] = useState({
    title: '',
    price: 0,
    isAllowPriceSuggestions: false,
    isSharing: false,
    categories: {
      large: '',
      medium: '',
      small: '',
    },
    centents: '',
    hashtags: [],
  });

  const [formTitle, setFormTitle] = useState('');
  const [subFormTitle, setFormSubTitle] = useState('');
  const [uploadImg, setUploadImg] = useState([]);
  const [showImgDeleteBtn, setShowImgDeleteBtn] = useState(false);

  const imgSliderRef = useRef(null);
  const [currentSlideNumber, setCurrentSlideNumber] = useState(0);

  const { type: param } = useParams();

  useEffect(() => {
    if (param === SELL) {
      setFormTitle(TITLE.addPal);
      setFormSubTitle(SUB_TITLE.addPal);
    }
    if (param === BUY) {
      setFormTitle(TITLE.addSal);
      setFormSubTitle(SUB_TITLE.addSal);
    }
  }, [param]);

  const submitHandler = (e) => {
    // e.preventDefault();
    console.log('폼 전송');
  };

  const changeFileUploadHandler = ({ target }) => {
    const fileExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const findExtensionsIndex = target.files[0].name.lastIndexOf('.');
    const extension = target.files[0].name.slice(findExtensionsIndex + 1).toLowerCase();

    if (!fileExtensions.includes(extension)) {
      return window.alert('jpg, png, gif 파일 형식만 업로드할 수 있습니다.');
    }
    const imgUrls = [];

    [...target.files].forEach((file) => {
      const url = URL.createObjectURL(file);
      if (!(imgUrls.length >= MAX_UPLOAD_COUNT) && uploadImg.length < MAX_UPLOAD_COUNT)
        imgUrls.push(url);
    });

    setUploadImg((prev) => prev.concat(imgUrls));
  };

  const mouseOverHandler = () => {
    setShowImgDeleteBtn(true);
  };

  const mouseLeaveHandler = () => {
    setShowImgDeleteBtn(false);
  };

  const deleteImg = (deleteTargetImg) => () => {
    const imgs = uploadImg.filter((img) => {
      return img !== deleteTargetImg;
    });

    setUploadImg(imgs);

    if (currentSlideNumber - 1 === uploadImg.length) {
      setCurrentSlideNumber(0);
    }
  };

  const createPost = () => {
    console.log('등록');
  };

  /**
   * 캐러셀
   */
  const clickPrevImg = () => {
    setCurrentSlideNumber(currentSlideNumber - 1);
  };

  const clickNextImg = () => {
    setCurrentSlideNumber(currentSlideNumber + 1);
  };

  useEffect(() => {
    const { current } = imgSliderRef;

    if (currentSlideNumber < 0) {
      setCurrentSlideNumber(uploadImg.length - 1);
      return;
    }

    if (currentSlideNumber > uploadImg.length - 1) {
      setCurrentSlideNumber(0);
      current.style.transform = 'translateX(0px)';
      return;
    }

    if (currentSlideNumber <= uploadImg.length - 1) {
      current.style.opacity = '0';

      setTimeout(() => {
        current.style.opacity = '1';
        if (currentSlideNumber >= 0) {
          current.style.transform = `translateX(${NEXT_X * currentSlideNumber}px)`;
        }
      }, 100);

      return () => {
        current.style.opacity = '0';
        current.style.transition = 'opacity .4s';
      };
    }
  }, [currentSlideNumber, uploadImg.length]);

  return (
    <Container>
      <Form onSubmit={submitHandler}>
        <Header>
          <Title>{formTitle}</Title>
          <SubText>{subFormTitle}</SubText>
        </Header>

        <Contents>
          <ImageWrapper>
            {!uploadImg.length && (
              <ImageUpLoaderLabel htmlFor='image-uploader'>이미지 등록</ImageUpLoaderLabel>
            )}

            <ul className='imgSlider' ref={imgSliderRef}>
              {uploadImg.length > 0 &&
                uploadImg.map((imageUrl, idx) => {
                  return (
                    <li
                      onMouseOver={mouseOverHandler}
                      onMouseLeave={mouseLeaveHandler}
                      key={imageUrl}
                      className='imgList'
                    >
                      <Image src={imageUrl} alt='upload_image' />
                      <p className='imgPage'>{`${idx + 1}/${uploadImg.length}`}</p>
                      {showImgDeleteBtn && (
                        <button
                          type='button'
                          className='deleteImgBtn'
                          onClick={deleteImg(imageUrl)}
                        >
                          삭제
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>
            {uploadImg.length > 0 && (
              <div className='btnWrapper'>
                <button className='prevBtn' onClick={clickPrevImg} type='button'>
                  ⥢ PREV
                </button>
                <button className='nextBtn' onClick={clickNextImg} type='button'>
                  NEXT ⥤
                </button>
              </div>
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
            <InputTextBox
              onChange={() => {
                console.log('테스트');
              }}
              required
              width='100%'
              padding='10px'
              placeholder='물품명'
            />

            <PriceTitleContainer>
              <div>
                <InputTitle isRequired title='가격'></InputTitle>
              </div>
              <CheckBoxWrapper>
                <CheckBox marginRight='140px' id='proposition' title='가격 제안 허용' />
              </CheckBoxWrapper>
            </PriceTitleContainer>

            <PriceInputContainer>
              <InputTextBox
                required
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
              <Select required>
                <Option value=''>대분류</Option>
                <Option value=''>테스트1</Option>
              </Select>
              <Select required>
                <Option value=''>중분류</Option>
                <Option value=''>테스트2</Option>
              </Select>
              <Select required>
                <Option value=''>소분류</Option>
                <Option value=''>테스트3</Option>
              </Select>
            </Categories>
          </CategoryContainer>

          <InputContent>
            <InputTitle isRequired title='내용' />
            <br />
            <TextArea required placeholder='물품 상세 정보를 입력해주세요.' />
          </InputContent>

          <HashTageContainer>
            <InputTitle title='해시태그' />
            <InputTextBox width='100%' placeholder='해시태그는 최대 10개까지 등록할 수 있습니다.' />
          </HashTageContainer>
        </Contents>

        <ButtonContainer>
          <Button type='submit' onClick={createPost} customSize='50%'>
            등록하기
          </Button>
          <Button customSize='50%' isOutline>
            취소하기
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  width: 800px;
  padding: 50px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Form = styled.form`
  overflow: hidden;
  padding: 5px;
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
  overflow: hidden;
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
  margin-top: 15px;
`;

const ImageUpLoaderInput = styled.input.attrs({
  multiple: true,
  accept: 'image/*',
})`
  display: none;
`;

const Image = styled.img`
  width: 690px;
  height: 250px;
  object-fit: contain;
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

const Option = styled.option``;

const InputContent = styled.div`
  margin-top: 20px;
`;

const HashTageContainer = styled.div`
  margin-top: 20px;
`;

const TextArea = styled.textarea`
  min-width: 100%;
  max-width: 100%;

  min-height: 130px;
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
  margin-top: 20px;
`;
