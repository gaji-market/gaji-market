function isVaild(type, value, isLogin) {
  let idRule = /^[A-Za-z0-9]{6,12}$/;
  let pwRule = /^[A-Za-z0-9]{8,15}$/;

  if (isLogin) return type === 'ID' ? idRule.test(value) : pwRule.test(value);

  if (type === 'ID' || type === 'PW') {
    if (value.length < 1) return true;
    return type === 'ID' ? idRule.test(value) : pwRule.test(value);
  }

  if (type === 'ETC') {
    let isEmtpy = value.map((v) => {
      return v === '' ? true : false;
    });
    if (isEmtpy.includes(true)) return false;
    return true;
  }
}
export { isVaild };
