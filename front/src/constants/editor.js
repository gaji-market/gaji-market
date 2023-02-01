export const MAX_IMAGE_COUNT = 5;
export const DEFAULT_CATEGORY_CODE = 10_000;

export const TITLE = Object.freeze({
  createPal: '팔래요 등록하기',
  updatePal: '팔래요 수정하기',
  createSal: '살래요 등록하기',
  updateSal: '살래요 수정하기',
});

export const SUB_TITLE = Object.freeze({
  createPal: '썸네일을 포함한 이미지를 1장 이상 업로드 해주세요. (최대 5장)',
  updatePal: '',
  createSal:
    '이미지 업로드시 저작권에 주의해주세요. \n 무단사용에 따라 생긴 손실이나 결과에 대해 책임지지 않습니다.',
  updateSal: '',
});

// 체크박스 선택
export const CHECK = Object.freeze({
  o: '1',
  x: '0',
});

export const CATEGORY_TIER = Object.freeze({
  lg: 'lg',
  md: 'md',
  sm: 'sm',
});

export const CATEGORY_DEFAULT_VALUE = Object.freeze({
  lg: '0',
  md: '1',
  sm: '2',
});
