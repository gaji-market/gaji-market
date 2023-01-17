import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import {
  useCreateSaleProductMutation,
  useCreatePurchaseProductMutation,
  useGetCategoriesQuery,
  useGetProductModificationQuery,
  useModifyProductMutation,
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
import Slider from 'components/common/Slider';

const MAX_UPLOAD_COUNT = 5;

const MAX_HASHTAGS = 10;

const CHECK = Object.freeze({
  o: '1',
  x: '0',
});

export default function Editor() {
  const { type: param } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const [isCompleteForm, setIsCompleteForm] = useState(false);
  const [formDatas, setFormDatas] = useState({
    prodPrice: 0, // required
    prodName: '', // required
    imageFiles: [], // required - 살래요인 경우 option
    cateCode: '0', // required string
    prodExplain: '', // required : 상품 설명
    freeCheck: '0', // required string : 무료나눔(0: X, 1: O)
    priceOffer: '0', // required string : 가격제안유무(0: 제안X, 1: 제안O)
    hashtags: [],

    // TODO: prodNo, tradState 값 넣어줘야함
    // prodNo: 230, // productNo
    // tradState: '0', // 상품 상태값 판매중0, 사는중1, 구매중2, 판매완료3
  });

  const [addedImgs, setAddedImgs] = useState([]);

  console.log(location);
  console.log(formDatas);

  const {
    data: productCategories,
    isSuccess,
    isError: ErrorByCategory,
  } = useGetCategoriesQuery();

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

  const path = location.pathname.split('/');
  const [postNo, setPostNo] = useState(null);

  useEffect(() => {
    setPostNo(path[path.length - 1]);
  }, [path]);

  /** 게시글 수정하기 */

  const option = { skip: !postNo || !path.includes('modify') };
  const { data: modifyProduct, isSuccess: isSuccessOfModificationData } =
    useGetProductModificationQuery(postNo, option);
  /** */

  const [modifyProductMutation] = useModifyProductMutation();

  const [createSaleProduct] = useCreateSaleProductMutation();
  const [createPurchaseProduct] = useCreatePurchaseProductMutation();

  const [inputHashTag, setInputHashTag] = useState('');

  const [formTitle, setFormTitle] = useState('');
  const [subFormTitle, setFormSubTitle] = useState('');

  const [currentSlideNumber, setCurrentSlideNumber] = useState(0);

  const checkCompleteForm = useCallback(
    (start, end, callback) => {
      return Object.values(formDatas).slice(start, end).every(callback);
    },
    [formDatas]
  );

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

  // 게시글 수정하기
  const [titleValue, setTitleValue] = useState('');
  const [priceValue, setPriceValue] = useState();
  const [isFreeChecked, setIsFreeChecked] = useState(false);
  const [contents, setContents] = useState('');

  useEffect(() => {
    if (isSuccessOfModificationData) {
      const { categoryInfos, fileInfos, hashTagInfos, productInfo } =
        modifyProduct;
      const images = fileInfos.map(({ dbFileName }) => {
        return `${process.env.REACT_APP_IMG_PREFIX_URL}${dbFileName}`;
      });

      setAddedImgs((prev) => [...prev, ...images]);
      setTitleValue(productInfo.prodName);
      setPriceValue(productInfo.prodPrice);
      productPriceRef.current.value = productInfo.prodPrice;
      if (productInfo.freeCheck === '1') {
        setIsFreeChecked(true);
      }
      setContents(productInfo.prodExplain);

      const hashTags = hashTagInfos.map(({ tagName }) => tagName);
      const categoryCodes = categoryInfos.map((category) => category?.cateCode);
      const cateCode = categoryCodes[categoryCodes.length - 1];

      setFormDatas((prev) => ({
        ...prev,

        prodName: productInfo.prodName,
        prodPrice: productInfo.prodPrice,
        prodExplain: productInfo.prodExplain,
        cateCode: cateCode,
        freeCheck: productInfo.freeCheck,
        priceOffer: productInfo.priceOffer,
        hashtags: [...prev.hashtags, ...hashTags],
        prodNo: Number(postNo),
      }));

      //TODO: 이미지를 어떻게 다시 보낼지 고민
      //TODO: 카테고리 선택한 내용 에디터에 반영시키기
    }
  }, [isSuccessOfModificationData]);

  //

  useEffect(() => {
    if (
      param === SELL &&
      formDatas.freeCheck === CHECK.o &&
      isSelectedCategories
    ) {
      // 무료나눔 O
      const callback = (formData) => !!formData.toString();
      return setIsCompleteForm(checkCompleteForm(1, 6, callback));
    }
    if (
      param === SELL &&
      formDatas.freeCheck === CHECK.x &&
      isSelectedCategories
    ) {
      // 무료나눔 X
      const callback = (formData) => formData && formDatas.imageFiles.length;
      return setIsCompleteForm(checkCompleteForm(0, 7, callback));
    }

    if (param === BUY && isSelectedCategories) {
      setIsCompleteForm(
        Object.values(formDatas)
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

    if (path.includes('modify')) {
      setFormTitle('작성한 게시글 수정하기');
      setFormSubTitle('');
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

  const changeProductContent = ({ target }) => {
    setContents(target.value);
    setFormDatas((prev) => ({
      ...prev,
      prodExplain: target.value,
    }));
  };

  /**
   * 글 발행
   */
  const queryPerParam = {
    pal: createSaleProduct,
    sal: createPurchaseProduct,
  };

  const createPost = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formDatas.imageFiles.forEach((item) => {
        formData.append('imageFiles', item);
      });

      formData.append(
        'param',
        new Blob([JSON.stringify(formDatas)], { type: 'application/json' })
      );

      formDatas.imageFiles = formData;

      const { data: response } = await queryPerParam[param](formData);
      console.log(response);

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

  console.log(formDatas);

  //TODO: 중복코드 제거
  // 수정하기 버튼
  const modifyPost = async (e) => {
    console.log(e);
    try {
      e.preventDefault();

      const formData = new FormData();
      formDatas.imageFiles.forEach((item) => {
        formData.append('imageFiles', item);
      });

      formData.append(
        'param',
        new Blob([JSON.stringify(formDatas)], { type: 'application/json' })
      );

      formDatas.imageFiles = formData;

      const response = await modifyProductMutation(formData);

      console.log(response);

      if (response.result === 'Success') {
        window.alert('게시글 수정 완료');
        navigate(`/products/${param}`);
      } else {
        throw new Error('게시글 수정 실패');
      }
    } catch (error) {
      window.alert('게시글 수정 실패! 잠시 후 다시 시도해주세요.');

      console.error(error);
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
    const extension = target.files[0].name
      .slice(findExtensionsIndex + 1)
      .toLowerCase();

    if (!fileExtensions.includes(extension)) {
      return window.alert('jpg, png, gif 파일 형식만 업로드할 수 있습니다.');
    }

    const imgFiles = []; // 서버 전송 배열
    const imgUrls = []; // 이미지 슬라이드 배열

    [...target.files].forEach((file) => {
      const url = URL.createObjectURL(file);

      if (
        !(imgUrls.length >= MAX_UPLOAD_COUNT) &&
        imgUrls.length < MAX_UPLOAD_COUNT
      ) {
        imgUrls.push(url);
        imgFiles.push(file);
      }
    });

    setAddedImgs((prev) => [...prev, ...imgUrls]);

    setFormDatas((prev) => ({
      ...prev,
      imageFiles: formDatas.imageFiles.concat(imgFiles),
    }));
  };

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
      return {
        ...prev,
        hashtags: [...new Set([...prev.hashtags, newHashTag.trim()])],
      };
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

    console.log(currentCategories, userSelectedCategoryCode);
    console.log(Object.values(categoryDefaultValue), userSelectedCategoryCode);

    if (
      Object.values(categoryDefaultValue).includes(userSelectedCategoryCode)
    ) {
      return setIsSelectedCategories(false);
    }

    if (
      currentCategories.md.length &&
      userSelectedCategoryCode <= currentCategories.lg
    ) {
      return setIsSelectedCategories(false);
    } else if (
      !currentCategories.sm.length &&
      !(userSelectedCategoryCode % categoryDefaultCode.md) &&
      userSelectedCategoryCode > categoryDefaultCode.lg
    ) {
      setIsSelectedCategories(true);
    } else if (
      currentCategories.sm.length &&
      userSelectedCategoryCode % categoryDefaultCode.sm
    ) {
      setIsSelectedCategories(true);
    } else setIsSelectedCategories(false);

    setFormDatas((prev) => ({
      ...prev,
      cateCode: userSelectedCategoryCode,
    }));
  }, [currentCategories, userSelectedCategoryCode]);

  const changeSelectBoxHandler = ({ target }) => {
    //TODO: 리팩토링

    // 사용자가 선택한 카테고리에 따라 2차, 3차 분류
    if (!(target.value % categoryDefaultCode.lg)) {
    } else if (!(target.value % categoryDefaultCode.md)) {
      if (currentCategories.sm.length) {
        setUserSelectedCategoryCode(
          Math.max(userSelectedCategoryCode, target.value)
        );
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

    if (
      target.value !== categoryDefaultValue.md &&
      !(target.value % categoryDefaultCode.md)
    ) {
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
        <div className='content-header'>
          <h2 className='editor-title'>{formTitle}</h2>
          <h3 className='editor-sub-title'>{subFormTitle}</h3>
        </div>
        <div>
          <ImageWrapper>
            {!addedImgs.length ? (
              <ImageUploaderLabel htmlFor='image-uploader'>
                이미지 등록
              </ImageUploaderLabel>
            ) : (
              <Slider
                images={addedImgs}
                setFormDatas={setFormDatas}
                setAddedImgs={setAddedImgs}
              />
            )}
            <ImageUploaderInput
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
              value={titleValue}
              required
              width='100%'
              padding='10px'
              placeholder='물품명'
            />

            <PriceTitleContainer>
              <div>
                <InputTitle isRequired title='가격' />
              </div>
              {/* <div>
                {formDatas.freeCheck === CHECK.x && param === SELL && (
                  <CheckBox
                    onChange={checkedAllowPriceSuggestions}
                    marginRight='140px'
                    id='proposition'
                    title='가격 제안 허용'
                  />
                )}
              </div> */}
            </PriceTitleContainer>

            <PriceInputContainer>
              <InputTextBox
                isReadOnly={formDatas.freeCheck === CHECK.o && 'readonly'}
                isDisabled={formDatas.freeCheck === CHECK.o}
                inputRef={productPriceRef}
                onChange={changeProductPrice}
                value={priceValue}
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
                <CheckBox
                  onChange={checkedFreeSharing}
                  onClick={() => {
                    setIsFreeChecked(!isFreeChecked);
                  }}
                  width='110px'
                  id='free'
                  title='무료나눔'
                  isChecked={isFreeChecked}
                />
              )}
            </PriceInputContainer>
          </TitleAndPriceWrapper>

          <CategoryContainer>
            <InputTitle title='카테고리' isRequired />
            <Categories>
              <select
                onChange={changeSelectBoxHandler}
                className='select-box lg'
                required
              >
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
                className='select-box md'
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
                className='select-box sm'
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
              value={contents}
              onChange={changeProductContent}
              className='textarea'
              required
              placeholder='물품 상세 정보를 입력해주세요. (최대 500자)'
            />
          </InputContent>

          <HashTageContainer>
            <InputTitle title='해시태그' />
            <div className='hashtags'>
              {formDatas.hashtags.length > 0 &&
                formDatas.hashtags.map((hashTag) => {
                  return (
                    <div
                      onClick={removeHashtagClickHandler}
                      key={hashTag}
                      className='tag'
                    >
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
                className='hashtag-input'
                maxLength='20'
              />
            </div>
          </HashTageContainer>
        </div>

        <div className='button-container'>
          {!path.includes('modify') && (
            <Button
              formEncType='multipart/form-data'
              type='submit'
              onClick={createPost}
              customSize='50%'
              isDisabled={!isCompleteForm}
            >
              등록하기
            </Button>
          )}
          {path.includes('modify') && (
            <Button
              formEncType='multipart/form-data'
              type='submit'
              onClick={modifyPost}
              customSize='50%'
              isDisabled={!isCompleteForm}
            >
              수정하기
            </Button>
          )}
          <Button
            onClick={cancleAddingProductClickHandler}
            customSize='50%'
            isOutline
          >
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

const ImageUploaderLabel = styled.label`
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

const ImageUploaderInput = styled.input.attrs({
  multiple: true,
  accept: 'image/*',
})`
  display: none;
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
