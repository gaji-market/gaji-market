/**
 * value의 길이가 0이면 true를 반환한다.
 * @function isEmptyValue
 * @param {(string | any[])} value 문자열 또는 배열
 * @returns {boolean} true 또는 false를 반환한다.
 */

const isEmptyValue = (value) => {
  if (!value.length) {
    return true;
  }
  return false;
};

export default isEmptyValue;
