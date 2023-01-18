/**
 * 배열의 모든 요소가 비교할 값보다 크거나 같은 경우 true, 아니면 false를 반환한다.
 * @function splitSpacing
 * @param {array} items 배열
 * @param {number} compareValue 비교할 값
 * @returns {array} 공백을 기준으로 자른 배열
 */

const isAllMoreThen = (items, compareValue) => {
  return [...items].every((value) => +value >= compareValue);
};

export default isAllMoreThen;
