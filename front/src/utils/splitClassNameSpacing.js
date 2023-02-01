/**
 * 클래스 이름을 공백을 기준으로 자른 후 배열을 반환한다.
 * @function splitClassNameSpacing
 * @param {string} target 자를 대상
 * @returns {array} 클래스 이름을 공백 기준으로 자른 배열
 */

const splitClassNameSpacing = (target) => {
  return target.className.split(' ');
};

export default splitClassNameSpacing;
