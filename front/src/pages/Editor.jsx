import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import {
  useCreateSaleProductMutation,
  useCreatePurchaseProductMutation,
  useGetCategoryQuery,
} from 'services/productApi';

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

import isEmptyValue from 'utils/isEmptyValue';
import { useCallback } from 'react';

const MAX_UPLOAD_COUNT = 5;
const NEXT_X = -690;

export default function Editor() {
  const [isCompleteForm, setIsCompleteForm] = useState(false);
  const [formDatas, setFormDatas] = useState({
    prodName: '', // required
    prodPrice: 0, // required
    imageFiles: [], // required
    priceOffer: false, // 가격제안유무(0: 제안X, 1: 제안O) required
    freeCheck: false, // 무료나눔(0: X, 1: O) required
    largeCateNo: '', // required
    mediumCateNo: '', // required
    smallCateNo: '', // required
    prodExplain: '', // 상품설명 required
    hashtags: [],
  });

  const { data: productCategories, isLoading, isSuccess, isError } = useGetCategoryQuery();
  console.log(productCategories);
  const [createSaleProduct] = useCreateSaleProductMutation();
  const [createPurchaseProduct] = useCreatePurchaseProductMutation();

  const [inputHashTag, setInputHashTag] = useState('');

  const [formTitle, setFormTitle] = useState('');
  const [subFormTitle, setFormSubTitle] = useState('');

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

  const changeProductTitle = useCallback(({ target }) => {
    setFormDatas((prev) => ({
      ...prev,
      prodName: target.value,
    }));
  }, []);

  const checkedAllowPriceSuggestions = useCallback(({ target }) => {
    setFormDatas((prev) => ({
      ...prev,
      priceOffer: target.checked,
    }));
  }, []);

  const checkedFreeSharing = useCallback(({ target }) => {
    setFormDatas((prev) => ({
      ...prev,
      freeCheck: target.checked,
    }));
  }, []);

  const productPriceRef = useRef(null);

  useEffect(() => {
    if (formDatas.freeCheck) {
      productPriceRef.current.value = '';
    }
  }, [formDatas.freeCheck]);

  const changeProductPrice = useCallback(({ target }) => {
    // TODO : 문자가 섞여있는 경우 강제 삭제시키기
    setFormDatas((prev) => ({
      ...prev,
      prodPrice: target.value,
    }));
  }, []);

  console.log(formDatas);

  const submitHandler = useCallback((e) => {
    // e.preventDefault();
    console.log('폼 전송');
  }, []);

  const createPost = useCallback(() => {
    console.log('등록');
  }, []);

  /**
   * 이미지 업로드
   */

  const changeFileUploadHandler = useCallback(
    ({ target }) => {
      const fileExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const findExtensionsIndex = target.files[0].name.lastIndexOf('.');
      const extension = target.files[0].name.slice(findExtensionsIndex + 1).toLowerCase();

      if (!fileExtensions.includes(extension)) {
        return window.alert('jpg, png, gif 파일 형식만 업로드할 수 있습니다.');
      }

      const imgUrls = [];

      [...target.files].forEach((file) => {
        const url = URL.createObjectURL(file);

        if (!(imgUrls.length >= MAX_UPLOAD_COUNT) && imgUrls.length < MAX_UPLOAD_COUNT)
          imgUrls.push(url);
      });

      setFormDatas((prev) => ({ ...prev, imageFiles: formDatas.imageFiles.concat(imgUrls) }));
    },
    [formDatas.imageFiles]
  );

  const mouseOverHandler = useCallback(() => {
    setShowImgDeleteBtn(true);
  }, []);

  const mouseLeaveHandler = useCallback(() => {
    setShowImgDeleteBtn(false);
  }, []);

  // TODO
  const deleteImg = useCallback(
    (deleteTargetImg) => () => {
      const imgs = formDatas.imageFiles.filter((img) => {
        return img !== deleteTargetImg;
      });

      setFormDatas((prev) => ({ ...prev, imageFiles: imgs }));

      if (currentSlideNumber - 1 === formDatas.imageFiles.length) {
        setCurrentSlideNumber(0);
      }
    },
    [formDatas.imageFiles, currentSlideNumber]
  );

  /**
   * 캐러셀
   */
  const clickPrevImg = useCallback(() => {
    setCurrentSlideNumber(currentSlideNumber - 1);
  }, [currentSlideNumber]);

  const clickNextImg = useCallback(() => {
    setCurrentSlideNumber(currentSlideNumber + 1);
  }, [currentSlideNumber]);

  useEffect(() => {
    const { current } = imgSliderRef;

    if (currentSlideNumber < 0) {
      setCurrentSlideNumber(formDatas.imageFiles.length - 1);
      return;
    }

    if (currentSlideNumber > formDatas.imageFiles.length - 1) {
      setCurrentSlideNumber(0);
      current.style.transform = 'translateX(0px)';
      return;
    }

    if (currentSlideNumber <= formDatas.imageFiles.length - 1) {
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
  }, [currentSlideNumber, formDatas.imageFiles.length]);

  /**
   * 해시태그
   */

  const addHashTag = useCallback((e) => {
    const allowedCommand = ['Comma', 'Enter', 'Space', 'NumpadEnter'];
    if (!allowedCommand.includes(e.code)) return;

    if (isEmptyValue(e.target.value.trim())) {
      return setInputHashTag('');
    }

    let newHashTag = e.target.value.trim();
    const regExp = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
    if (regExp.test(newHashTag)) {
      newHashTag = newHashTag.replace(regExp, '');
    }
    if (newHashTag.includes(',')) {
      newHashTag = newHashTag.split(',').join('');
    }

    if (isEmptyValue(newHashTag)) return;

    setFormDatas((prev) => {
      return { ...prev, hashtags: [...new Set([...prev.hashtags, newHashTag.trim()])] };
    });

    setInputHashTag('');
  }, []);

  useEffect(() => {
    if (formDatas.hashtags.length) {
      const removeSpace = formDatas.hashtags.map((tag) => {
        return tag.replace(' ', '');
      });

      setFormDatas((prev) => ({ ...prev, hashtags: removeSpace }));
    }
  }, [formDatas.hashtags.length]);

  const keyDownHandler = useCallback((e) => {
    if (e.code !== 'Enter' && e.code !== 'NumpadEnter') return;
    e.preventDefault();

    const regExp = /^[a-z|A-Z|가-힣|ㄱ-ㅎ|ㅏ-ㅣ|0-9| \t|]+$/g;
    if (!regExp.test(e.target.value)) {
      setInputHashTag('');
    }
  }, []);

  const changeHashTagInput = useCallback((e) => {
    setInputHashTag(e.target.value);
  }, []);

  // TODO : 해시태그 10개 제한하기
  // useEffect(() => {
  //   if (hashTags.length === 10) {
  //   }
  // }, [hashTags]);

  return (
    <div className='container'>
      <form className='form' onSubmit={submitHandler}>
        <div className='contentHeader'>
          <h2 className='editorTitle'>{formTitle}</h2>
          <h3 className='editorSubTitle'>{subFormTitle}</h3>
        </div>

        <div>
          <ImageWrapper>
            {!formDatas.imageFiles.length && (
              <ImageUpLoaderLabel htmlFor='image-uploader'>이미지 등록</ImageUpLoaderLabel>
            )}

            <ul className='imgSlider' ref={imgSliderRef}>
              {formDatas.imageFiles.length > 0 &&
                formDatas.imageFiles.map((imageUrl, idx) => {
                  return (
                    <li
                      onMouseOver={mouseOverHandler}
                      onMouseLeave={mouseLeaveHandler}
                      key={imageUrl}
                      className='imgList'
                    >
                      <Image src={imageUrl} alt='upload_image' />
                      <p className='imgPage'>{`${idx + 1}/${formDatas.imageFiles.length}`}</p>
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
            {formDatas.imageFiles.length > 0 && (
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
              title='제목은 2글자 이상, 20글자 이하로 작성해주세요.'
              minLength={2}
              maxLength={20}
              onChange={changeProductTitle}
              required
              width='100%'
              padding='10px'
              placeholder='물품명'
            />

            <PriceTitleContainer>
              <div>
                <InputTitle isRequired title='가격' />
              </div>
              <div>
                <CheckBox
                  onChange={checkedAllowPriceSuggestions}
                  marginRight='140px'
                  id='proposition'
                  title='가격 제안 허용'
                />
              </div>
            </PriceTitleContainer>

            <PriceInputContainer>
              <InputTextBox
                isReadOnly={formDatas.freeCheck && 'readonly'}
                isDisabled={formDatas.freeCheck}
                inputRef={productPriceRef}
                onChange={changeProductPrice}
                required
                type='number'
                width='95%'
                padding='10px'
                placeholder='원'
                placeholderPosition='right'
              />
              <CheckBox onChange={checkedFreeSharing} width='110px' id='free' title='무료나눔' />
            </PriceInputContainer>
          </TitleAndPriceWrapper>

          <CategoryContainer>
            <InputTitle title='카테고리' isRequired />
            <Categories>
              <select className='selectBox' required>
                <option value=''>대분류</option>
                <option value=''>테스트1</option>
              </select>
              <select className='selectBox' required>
                <option value=''>중분류</option>
                <option value=''>테스트2</option>
              </select>
              <select className='selectBox' required>
                <option value=''>소분류</option>
                <option value=''>테스트3</option>
              </select>
            </Categories>
          </CategoryContainer>

          <InputContent>
            <InputTitle isRequired title='내용' />
            <br />
            <textarea className='textArea' required placeholder='물품 상세 정보를 입력해주세요.' />
          </InputContent>

          <HashTageContainer>
            <InputTitle title='해시태그' />
            <div className='hashTags'>
              {formDatas.hashtags.length > 0 &&
                formDatas.hashtags.map((hashTag) => {
                  return (
                    <div key={hashTag} className='tag'>
                      {hashTag}
                    </div>
                  );
                })}

              <input
                value={inputHashTag}
                onChange={changeHashTagInput}
                onKeyUp={addHashTag}
                onKeyDown={keyDownHandler}
                placeholder='#해시태그를 등록해보세요. (최대 10개)'
                className='hashTagInput'
              />
            </div>
          </HashTageContainer>
        </div>

        <div className='buttonContainer'>
          <Button isDisabled={!isCompleteForm} type='submit' onClick={createPost} customSize='50%'>
            등록하기
          </Button>
          <Button customSize='50%' isOutline>
            취소하기
          </Button>
        </div>
      </form>
    </div>
  );
}

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

const InputContent = styled.div`
  margin-top: 20px;
`;

const HashTageContainer = styled.div`
  margin-top: 20px;
`;
