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
import {
  TITLE,
  SUB_TITLE,
  MAX_IMAGE_COUNT,
  DEFAULT_CATEGORY_CODE,
  CHECK,
  CATEGORY_TIER,
  CATEGORY_DEFAULT_VALUE,
} from 'constants/editor';

import deduplicationState from 'utils/deduplicationState';
import Slider from 'components/common/Slider';
import Hashtag from 'components/common/Hashtag';
import SelectBox from 'components/Editor/SelectBox';

import isIncludes from 'utils/isIncludes';
import splitClassNameSpacing from 'utils/splitClassNameSpacing';
import isAllMoreThen from 'utils/isAllMoreThen';

const isIncludesCategoryTier = (target, tier) => {
  return isIncludes(splitClassNameSpacing(target), tier);
};

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

  const {
    data: productCategories,
    isSuccess,
    isError: ErrorByCategory,
  } = useGetCategoriesQuery();

  // 서버에서 받아온 모든 카테고리
  const [largeCategories, setLargeCategories] = useState([]);
  const [midiumCategories, setMidiumCategories] = useState([]);
  const [smallCategories, setSmallCategories] = useState([]);
  const categories = [largeCategories, midiumCategories, smallCategories];

  const selectCategory = Object.freeze({
    1: setLargeCategories,
    2: setMidiumCategories,
    3: setSmallCategories,
  });

  // 유저가 선택한 카테고리 (카테고리 기본값 0, 1, 2)
  const [selectedLgCategory, setSelectedLgCategory] = useState('0');
  const [selectedMdCategory, setSelectedMdCategory] = useState('1');
  const [selectedSmCategory, setSelectedSmCategory] = useState('2');

  // 하위 분류가 존재하지 않을 경우 disabled
  const [isDisabledMdCategory, setIsDisabledMdCategory] = useState(true);
  const [isDisabledSmCategory, setIsDisabledSmCategory] = useState(true);

  // 유저가 선택한 카테고리에 따라 바뀔 카테고리
  // Md는 selectedLgCategory에 의해 결정됩니다.
  const [appearMdCategories, setAppearMdCategories] = useState([]);
  const [appearSmCategories, setAppearSmCategories] = useState([]);

  // 모든 카테고리 선택 완료
  const [isDoneSelectedCategories, setIsDoneSelectedCategories] =
    useState(false);

  useEffect(() => {
    if (!isSuccess) return;

    productCategories.categoryInfos.forEach((cate) => {
      const tierIndex = cate.tier;
      selectCategory[tierIndex]((prev) => deduplicationState(prev, cate));
    });
  }, [productCategories]);

  const changeSelectedOption = ({ target }) => {
    // 사용자가 선택한 카테고리
    if (isIncludesCategoryTier(target, CATEGORY_TIER.lg)) {
      return setSelectedLgCategory(target.value);
    }

    if (isIncludesCategoryTier(target, CATEGORY_TIER.md)) {
      return setSelectedMdCategory(target.value);
    }

    if (isIncludesCategoryTier(target, CATEGORY_TIER.sm)) {
      return setSelectedSmCategory(target.value);
    }
  };

  useEffect(() => {
    // 대분류가 변경되면 중/소분류 기본값으로 변경
    setSelectedMdCategory(CATEGORY_DEFAULT_VALUE.md);
    setSelectedSmCategory(CATEGORY_DEFAULT_VALUE.sm);

    setAppearMdCategories(() => {
      return midiumCategories.filter(
        ({ cateParent }) => cateParent === selectedLgCategory
      );
    });
  }, [selectedLgCategory]);

  useEffect(() => {
    setSelectedSmCategory(CATEGORY_DEFAULT_VALUE.sm);

    setAppearSmCategories(() => {
      return smallCategories.filter(
        ({ cateParent }) => cateParent === selectedMdCategory
      );
    });
  }, [selectedLgCategory, selectedMdCategory]);

  useEffect(() => {
    // 대분류가 기본 값이 아닌 경우
    if (selectedLgCategory !== CATEGORY_DEFAULT_VALUE.lg) {
      return setIsDisabledMdCategory(false);
    }

    setIsDisabledMdCategory(true);
    setIsDisabledSmCategory(true);
  }, [selectedLgCategory]);

  useEffect(() => {
    // 중분류가 기본 값이거나 하위 분류가 존재하지 않는 경우
    if (selectedMdCategory.length && CATEGORY_DEFAULT_VALUE.md) {
      return setIsDisabledSmCategory(false);
    }

    setIsDisabledSmCategory(true);
  }, [selectedMdCategory.length]);

  useEffect(() => {
    // 소분류가 존재하지 않는 경우
    if (!appearSmCategories.length) setIsDisabledSmCategory(true);
    else setIsDisabledSmCategory(false);
  }, [selectedMdCategory, appearSmCategories.length]);

  useEffect(() => {
    // 모든 카테고리를 선택했는지 확인
    if (
      !appearSmCategories.length &&
      isAllMoreThen(
        [selectedLgCategory, selectedMdCategory],
        DEFAULT_CATEGORY_CODE
      )
    ) {
      setIsDoneSelectedCategories(true);
      return setFormDatas((prev) => ({
        ...prev,
        cateCode: selectedMdCategory,
      }));
    } else if (
      appearSmCategories.length &&
      isAllMoreThen(
        [selectedLgCategory, selectedMdCategory, selectedSmCategory],
        DEFAULT_CATEGORY_CODE
      )
    ) {
      setIsDoneSelectedCategories(true);
      // 서버로 보낼 카테고리 코드 지정
      return setFormDatas((prev) => ({
        ...prev,
        cateCode: selectedSmCategory,
      }));
    } else setIsDoneSelectedCategories(false);
  }, [
    selectedLgCategory,
    selectedMdCategory,
    selectedSmCategory,
    appearSmCategories.length,
  ]);

  /**
   * TODO: 여기부터 리팩토링 해야함
   */

  const path = location.pathname.split('/');
  const [postNo, setPostNo] = useState(null);

  useEffect(() => {
    setPostNo(path[path.length - 1]);
  }, [path]);

  const [addedImgs, setAddedImgs] = useState([]);

  /** 게시글 수정하기 */

  const option = { skip: !postNo || !path.includes('modify') };
  const { data: modifyProduct, isSuccess: isSuccessOfModificationData } =
    useGetProductModificationQuery(postNo, option);
  /** */

  const [modifyProductMutation] = useModifyProductMutation();

  const [createSaleProduct] = useCreateSaleProductMutation();
  const [createPurchaseProduct] = useCreatePurchaseProductMutation();

  const [formTitle, setFormTitle] = useState('');
  const [subFormTitle, setFormSubTitle] = useState('');

  const checkCompleteForm = useCallback(
    (start, end, callback) => {
      return Object.values(formDatas).slice(start, end).every(callback);
    },
    [formDatas]
  );

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
      isDoneSelectedCategories
    ) {
      // 무료나눔 O
      const callback = (formData) => !!formData.toString();
      return setIsCompleteForm(checkCompleteForm(1, 6, callback));
    }
    if (
      param === SELL &&
      formDatas.freeCheck === CHECK.x &&
      isDoneSelectedCategories
    ) {
      // 무료나눔 X
      const callback = (formData) => formData && formDatas.imageFiles.length;
      return setIsCompleteForm(checkCompleteForm(0, 7, callback));
    }

    if (param === BUY && isDoneSelectedCategories) {
      setIsCompleteForm(
        Object.values(formDatas)
          .filter((formData) => !Array.isArray(formData))
          .every((formData) => !!formData)
      );
    } else {
      setIsCompleteForm(false);
    }
  }, [formDatas, isDoneSelectedCategories]);

  useEffect(() => {
    if (param === SELL) {
      setFormTitle(TITLE.createPal);
      setFormSubTitle(SUB_TITLE.createPal);
    }
    if (param === BUY) {
      setFormTitle(TITLE.createSal);
      setFormSubTitle(SUB_TITLE.createSal);
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
        !(imgUrls.length >= MAX_IMAGE_COUNT) &&
        imgUrls.length < MAX_IMAGE_COUNT
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
              <SelectBox
                className='select-box lg'
                required='required'
                onChange={changeSelectedOption}
                categories={categories[0]}
                optionValue={CATEGORY_DEFAULT_VALUE.lg}
                optionText='대분류'
              />

              <SelectBox
                className='select-box md'
                required='required'
                onChange={changeSelectedOption}
                categories={appearMdCategories}
                optionValue={CATEGORY_DEFAULT_VALUE.md}
                optionText='중분류'
                disabled={isDisabledMdCategory}
              />

              <SelectBox
                className='select-box sm'
                required='required'
                onChange={changeSelectedOption}
                categories={appearSmCategories}
                optionValue={CATEGORY_DEFAULT_VALUE.sm}
                optionText='소분류'
                disabled={isDisabledSmCategory}
              />
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

          <Hashtag hashtags={formDatas.hashtags} setFormDatas={setFormDatas} />
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
