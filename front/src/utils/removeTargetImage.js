/**
 * 삭제 버튼을 눌렀을 때 이미지 배열과 삭제할 이미지 인덱스를 인자로 받는다.
 * @function removeTargetImage
 * @param {array} images 이미지 배열
 * @param {number} imgIdx 제거할 이미지의 인덱스
 * @returns {array} 제거할 이미지를 제외한 배열을 반환한다.
 */

export const removeTargetImage = (images, imgIdx) => {
  return images.filter((_, index) => {
    return imgIdx !== index;
  });
};
