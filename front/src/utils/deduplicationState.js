/**
 * 업데이트하고자 하는 배열 state의 중복을 제거한 배열을 반환하는 함수
 * @function deduplicationState
 * @param {array} prev 이전 state 배열
 * @param {any} item 배열에 추가할 요소
 * @returns {array} 중복을 제거한 배열을 반환한다.
 */

const deduplicationState = (prev, item) => {
  return [...new Set([...prev, item])];
};

export default deduplicationState;
