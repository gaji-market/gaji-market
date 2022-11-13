function isVaildId(id) {
  var idRule = /^[A-Za-z0-9]{6,12}$/;
  return idRule.test(id);
}
function isVaildPassword(password) {
  let pwRule = /^[A-Za-z0-9]{8,15}$/;
  return pwRule.test(password);
}
function isVaildETC(address, addressDetail, birthday, gender) {
  if (address !== '' && addressDetail !== '' && birthday !== '' && gender !== '') return true;
  return false;
}
export { isVaildId, isVaildPassword, isVaildETC };
