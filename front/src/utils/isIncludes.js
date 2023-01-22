/**
 * target이 items 배열에 있는지 확인 후 true 또는 false를 반환한다.
 * @function isIncludes
 * @param {any[]} items  배열
 * @param {any} target 찾을 대상
 * @returns {boolean} true 또는 false를 반환한다.
 */

const isIncludes = (items, target) => {
  return items.includes(target);
};

export default isIncludes;
