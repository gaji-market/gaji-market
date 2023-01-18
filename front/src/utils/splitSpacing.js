/**
 * 공백을 기준으로 자른 후 배열을 반환한다.
 * @function splitSpacing
 * @param {string} target 자를 대상
 * @returns {array} 공백을 기준으로 자른 배열
 */

const splitSpacing = (target) => {
  return target.className.split(' ');
};

export default splitSpacing;
