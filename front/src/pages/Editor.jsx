import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  useCreateSaleProductMutation,
  useCreatePurchaseProductMutation,
  useGetCategoriesQuery,
} from 'services/productApi';

import styled from 'styled-components';
import Button from 'components/common/Button';
import CheckBox from 'components/common/Checkbox';
import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';

import 'styles/editor.scss';

import { GRAY_COLOR, WHITE_COLOR } from 'components/common/commonColor';
import { SELL, BUY } from 'constants/params';
import { TITLE, SUB_TITLE } from 'constants/editor';

import isEmptyValue from 'utils/isEmptyValue';
import deduplicationState from 'utils/deduplicationState';

const MAX_UPLOAD_COUNT = 5;
const NEXT_X = -690;

const MAX_HASHTAGS = 10;

const CHECK = Object.freeze({
  o: '1',
  x: '0',
});

export default function Editor() {
  const [isCompleteForm, setIsCompleteForm] = useState(false);
  const [formDatas, setFormDatas] = useState({
    prodPrice: 0, // required
    prodName: '', // required
    imageFiles: [], // required
    cateCode: '0', // required string
    prodExplain: '', // required : 상품 설명
    freeCheck: '0', // required string : 무료나눔(0: X, 1: O)
    priceOffer: '0', // required string : 가격제안유무(0: 제안X, 1: 제안O)
    hashtags: [],
  });

  const navigate = useNavigate();

  const { data: productCategories, isSuccess, isError: ErrorByCategory } = useGetCategoriesQuery();
  const [largeCategory, setLargeCategory] = useState([]);
  const [midiumCategory, setMidiumCategory] = useState([]);
  const [smallCetegory, setSmallCategory] = useState([]);
  const selectCategory = {
    1: setLargeCategory,
    2: setMidiumCategory,
    3: setSmallCategory,
  };

  const [userSelectedCategoryCode, setUserSelectedCategoryCode] = useState('0');
  const [isSelectedCategories, setIsSelectedCategories] = useState(false);
  // 서버로 보낼 유저가 선택한 카테고리 코드

  const [createSaleProduct] = useCreateSaleProductMutation();

  const [imgSlide, setImgSlide] = useState([]);

  const [inputHashTag, setInputHashTag] = useState('');

  const [formTitle, setFormTitle] = useState('');
  const [subFormTitle, setFormSubTitle] = useState('');

  const [showImgDeleteBtn, setShowImgDeleteBtn] = useState(false);

  const imgSliderRef = useRef(null);
  const [currentSlideNumber, setCurrentSlideNumber] = useState(0);

  const { type: param } = useParams();

  const checkCompleteForm = useCallback(
    (start, end, callback) => {
      return Object.values(formDatas).slice(start, end).every(callback);
    },
    [formDatas]
  );

  useEffect(() => {
    if (param === SELL && formDatas.freeCheck === CHECK.o && isSelectedCategories) {
      // 무료나눔 O
      const callback = (formData) => !!formData.toString();
      return setIsCompleteForm(checkCompleteForm(1, 6, callback));
    }
    if (param === SELL && formDatas.freeCheck === CHECK.x && isSelectedCategories) {
      // 무료나눔 X
      const callback = (formData) => formData && formDatas.imageFiles.length;
      return setIsCompleteForm(checkCompleteForm(0, 7, callback));
    }

    if (param === BUY && isSelectedCategories) {
      setIsCompleteForm(
        Object.values(formDatas)
          .slice(0, 7)
          .filter((formData) => !Array.isArray(formData))
          .every((formData) => !!formData)
      );
    } else {
      setIsCompleteForm(false);
    }
  }, [formDatas, isSelectedCategories]);

  useEffect(() => {
    if (isSuccess && productCategories) {
      productCategories.categoryInfos.forEach((cate) => {
        const tierIndex = cate.tier;
        selectCategory[tierIndex]((prev) => deduplicationState(prev, cate));
      });
    }
  }, [productCategories]);

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
      priceOffer: target.checked ? CHECK.o : CHECK.x,
    }));
  }, []);

  const checkedFreeSharing = useCallback(({ target }) => {
    setFormDatas((prev) => ({
      ...prev,
      freeCheck: target.checked ? CHECK.o : CHECK.x,
    }));
  }, []);

  useEffect(() => {
    if (formDatas.freeCheck === '1') {
      setFormDatas((prev) => ({
        ...prev,
        prodPrice: 0,
        priceOffer: '0',
      }));
    }
  }, [formDatas.freeCheck]);

  const productPriceRef = useRef(null);

  useEffect(() => {
    if (formDatas.freeCheck) {
      productPriceRef.current.value = '';
    }
  }, [formDatas.freeCheck]);

  const changeProductPrice = useCallback(({ target }) => {
    setFormDatas((prev) => ({
      ...prev,
      prodPrice: Math.abs(target.value),
    }));
  }, []);

  const changeProductContent = useCallback(({ target }) => {
    setFormDatas((prev) => ({
      ...prev,
      prodExplain: target.value,
    }));
  }, []);

  /**
   * 글 발행
   */
  const createPost = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formDatas.imageFiles.forEach((item) => {
        formData.append('imageFiles', item);
      });

      formData.append('param', new Blob([JSON.stringify(formDatas)], { type: 'application/json' }));

      formDatas.imageFiles = formData;

      const { data: response } = await createSaleProduct(formData);
      if (response.result === 'Success') {
        window.alert('게시글 등록 완료');
        navigate(`/products/${param}`);
      } else {
        throw new Error('게시글 등록 실패');
      }
    } catch (err) {
      window.alert('게시글 등록 실패! 잠시 후 다시 시도해주세요.');
      console.error(err);

      navigate(`/products/${param}`);
    }
  };

  const cancleAddingProductClickHandler = () => {
    navigate('/');
  };

  /**
   * 이미지 업로드
   */

  const changeFileUploadHandler = ({ target }) => {
    const fileExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const findExtensionsIndex = target.files[0].name.lastIndexOf('.');
    const extension = target.files[0].name.slice(findExtensionsIndex + 1).toLowerCase();

    if (!fileExtensions.includes(extension)) {
      return window.alert('jpg, png, gif 파일 형식만 업로드할 수 있습니다.');
    }

    const imgFiles = []; // 서버 전송 배열
    const imgUrls = []; // 이미지 슬라이드 배열

    [...target.files].forEach((file) => {
      const url = URL.createObjectURL(file);

      if (!(imgUrls.length >= MAX_UPLOAD_COUNT) && imgUrls.length < MAX_UPLOAD_COUNT) {
        imgUrls.push(url);
        imgFiles.push(file);
      }
    });

    setImgSlide((prev) => [...prev, ...imgUrls]);

    setFormDatas((prev) => ({
      ...prev,
      imageFiles: formDatas.imageFiles.concat(imgFiles),
    }));
  };

  const mouseOverHandler = useCallback(() => {
    setShowImgDeleteBtn(true);
  }, []);

  const mouseLeaveHandler = useCallback(() => {
    setShowImgDeleteBtn(false);
  }, []);

  const deleteImg = (deleteTargetImg, deleteImageIdx) => () => {
    const imgs = imgSlide.filter((img) => {
      return img !== deleteTargetImg;
    });

    const serverImgs = formDatas.imageFiles.filter((_, index) => {
      return index !== deleteImageIdx;
    });

    setImgSlide(imgs);
    setFormDatas((prev) => ({ ...prev, imageFiles: serverImgs }));

    if (currentSlideNumber - 1 === imgSlide.length) {
      setCurrentSlideNumber(0);
    }
  };

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
      setCurrentSlideNumber(imgSlide.length - 1);
      return;
    }

    if (currentSlideNumber > imgSlide.length - 1) {
      setCurrentSlideNumber(0);
      current.style.transform = 'translateX(0px)';
      return;
    }

    if (currentSlideNumber <= imgSlide.length - 1) {
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
  }, [currentSlideNumber, imgSlide.length]);

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

  useEffect(() => {
    console.log(formDatas.hashtags.length);

    if (formDatas.hashtags.length > MAX_HASHTAGS) {
      setFormDatas((prev) => ({
        ...prev,
        hashtags: prev.hashtags.slice(0, MAX_HASHTAGS),
      }));

      return window.alert('해시태그는 10개 이상 등록할 수 없습니다.');
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

  const removeHashtagClickHandler = (e) => {
    const newHashtags = formDatas.hashtags.filter((hashtag) => {
      return e.target.innerHTML !== hashtag;
    });

    setFormDatas((prev) => ({
      ...prev,
      hashtags: newHashtags,
    }));
  };

  /**
   * 카테고리 선택
   */

  const [isDisabledMdCate, setIsDisabledMdCate] = useState(true);
  const [isDisabledSmCate, setIsDisabledSmCate] = useState(true);
  const [currentCategories, setCurrentCategories] = useState({
    lg: '',
    md: [],
    sm: [],
  });

  useEffect(() => {
    if (!currentCategories.md.length) {
      setIsDisabledMdCate(true);
    } else setIsDisabledMdCate(false);

    if (!currentCategories.sm.length) {
      setIsDisabledSmCate(true);
    } else setIsDisabledSmCate(false);
  }, [currentCategories?.md.length, currentCategories?.sm.length]);

  useEffect(() => {
    if (currentCategories?.lg) {
      setCurrentCategories((prev) => {
        const newMdCate = midiumCategory.filter((mdCate) => {
          return mdCate.cateParent === currentCategories.lg;
        });

        return { ...prev, md: newMdCate, sm: [] };
      });
    }
  }, [currentCategories?.lg]);

  const categoryDefaultValue = {
    lg: '0',
    md: '1',
    sm: '2',
  };

  const categoryDefaultCode = {
    lg: 10_000,
    md: 100,
    sm: 10,
  };

  useEffect(() => {
    //TODO: 리팩토링
    if (Object.values(categoryDefaultValue).includes(userSelectedCategoryCode)) {
      return setIsSelectedCategories(false);
    }

    if (currentCategories.md.length && userSelectedCategoryCode <= currentCategories.lg) {
      console.log('ㅠㅠ');
      return setIsSelectedCategories(false);
    } else if (
      !currentCategories.sm.length &&
      !(userSelectedCategoryCode % categoryDefaultCode.md) &&
      userSelectedCategoryCode > categoryDefaultCode.lg
    ) {
      setIsSelectedCategories(true);
    } else if (currentCategories.sm.length && userSelectedCategoryCode % categoryDefaultCode.sm) {
      setIsSelectedCategories(true);
    } else setIsSelectedCategories(false);

    setFormDatas((prev) => ({
      ...prev,
      cateCode: userSelectedCategoryCode,
    }));
  }, [currentCategories, userSelectedCategoryCode]);

  const changeSelectBoxHandler = ({ target }) => {
    //TODO: 리팩토링
    if (!(target.value % categoryDefaultCode.lg)) {
      setUserSelectedCategoryCode(target.value);
    } else if (!(target.value % categoryDefaultCode.md)) {
      if (currentCategories.sm.length) {
        setUserSelectedCategoryCode(Math.max(userSelectedCategoryCode, target.value));
      } else {
        setUserSelectedCategoryCode(target.value);
      }
    } else if (target.value % categoryDefaultCode.sm) {
      setUserSelectedCategoryCode(target.value);
    }

    if (!(target.value % categoryDefaultCode.lg)) {
      return setCurrentCategories((prev) => ({ ...prev, lg: target.value }));
    }

    if (target.value === categoryDefaultValue.md) {
      return setCurrentCategories((prev) => {
        const newSmCate = smallCetegory.filter((smCate) => {
          return smCate.cateParent === target.value;
        });

        return { ...prev, sm: newSmCate };
      });
    }

    if (target.value !== categoryDefaultValue.md && !(target.value % categoryDefaultCode.md)) {
      return setCurrentCategories((prev) => {
        const newSmCate = smallCetegory.filter((smCate) => {
          return smCate.cateParent === target.value;
        });

        return { ...prev, sm: newSmCate };
      });
    }
  };

  if (ErrorByCategory) {
    return <div>카테고리 불러오기 오류! 잠시 후 재시도 해주세요</div>;
  }

  return (
    <div className='container'>
      <form className='form'>
        <div className='contentHeader'>
          <h2 className='editorTitle'>{formTitle}</h2>
          <h3 className='editorSubTitle'>{subFormTitle}</h3>
        </div>
        <div>
          <ImageWrapper>
            {!imgSlide.length && (
              <ImageUpLoaderLabel htmlFor='image-uploader'>이미지 등록</ImageUpLoaderLabel>
            )}

            <ul className='imgSlider' ref={imgSliderRef}>
              {imgSlide.length > 0 &&
                imgSlide.map((imageUrl, idx) => {
                  return (
                    <li
                      onMouseOver={mouseOverHandler}
                      onMouseLeave={mouseLeaveHandler}
                      key={imageUrl}
                      className='imgList'
                    >
                      <Image src={imageUrl} alt='upload_image' />
                      <p className='imgPage'>{`${idx + 1}/${imgSlide.length}`}</p>
                      {showImgDeleteBtn && (
                        <button
                          type='button'
                          className='deleteImgBtn'
                          onClick={deleteImg(imageUrl, idx)}
                        >
                          삭제
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>
            {imgSlide.length > 0 && (
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
              title='제목은 2글자 이상, 50글자 이하로 작성해주세요.'
              minLength={2}
              maxLength={50}
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
                {formDatas.freeCheck === CHECK.x && param === SELL && (
                  <CheckBox
                    onChange={checkedAllowPriceSuggestions}
                    marginRight='140px'
                    id='proposition'
                    title='가격 제안 허용'
                  />
                )}
              </div>
            </PriceTitleContainer>

            <PriceInputContainer>
              <InputTextBox
                isReadOnly={formDatas.freeCheck === CHECK.o && 'readonly'}
                isDisabled={formDatas.freeCheck === CHECK.o}
                inputRef={productPriceRef}
                onChange={changeProductPrice}
                required
                type='number'
                min='0'
                max='99999999999'
                width={param === SELL ? '95%' : '100%'}
                padding='10px'
                placeholder='원'
                placeholderPosition='right'
              />
              {param === SELL && (
                <CheckBox onChange={checkedFreeSharing} width='110px' id='free' title='무료나눔' />
              )}
            </PriceInputContainer>
          </TitleAndPriceWrapper>

          <CategoryContainer>
            <InputTitle title='카테고리' isRequired />
            <Categories>
              <select onChange={changeSelectBoxHandler} className='selectBox lg' required>
                <option value={0}>대분류</option>
                {largeCategory?.map((largeCate) => {
                  return (
                    <option key={largeCate.cateCode} value={largeCate.cateCode}>
                      {largeCate.cateName}
                    </option>
                  );
                })}
              </select>

              <select
                disabled={isDisabledMdCate}
                onChange={changeSelectBoxHandler}
                className='selectBox md'
                required
              >
                <option value={1}>중분류</option>
                {currentCategories.md?.map((mdCate) => {
                  return (
                    <option key={mdCate.cateCode} value={mdCate.cateCode}>
                      {mdCate.cateName}
                    </option>
                  );
                })}
              </select>

              <select
                disabled={isDisabledSmCate}
                onChange={changeSelectBoxHandler}
                className='selectBox sm'
                required
              >
                <option value={2}>소분류</option>
                {currentCategories.sm?.map((smCate) => {
                  return (
                    <option key={smCate.cateCode} value={smCate.cateCode}>
                      {smCate.cateName}
                    </option>
                  );
                })}
              </select>
            </Categories>
          </CategoryContainer>

          <InputContent>
            <InputTitle isRequired title='내용' />
            <br />
            <textarea
              maxLength='500'
              onChange={changeProductContent}
              className='textArea'
              required
              placeholder='물품 상세 정보를 입력해주세요. (최대 500자)'
            />
          </InputContent>

          <HashTageContainer>
            <InputTitle title='해시태그' />
            <div className='hashTags'>
              {formDatas.hashtags.length > 0 &&
                formDatas.hashtags.map((hashTag) => {
                  return (
                    <div onClick={removeHashtagClickHandler} key={hashTag} className='tag'>
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
                maxLength='20'
              />
            </div>
          </HashTageContainer>
        </div>

        <div className='buttonContainer'>
          <Button
            formEncType='multipart/form-data'
            type='submit'
            onClick={createPost}
            customSize='50%'
            isDisabled={!isCompleteForm}
          >
            등록하기
          </Button>
          <Button onClick={cancleAddingProductClickHandler} customSize='50%' isOutline>
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
