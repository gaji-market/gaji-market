import Crypto from 'crypto-js';

export function encrypt(secretKey, message) {
  return Crypto.AES.encrypt(message, secretKey).toString();
}

export function decrypt(secretKey, encryption) {
  return Crypto.AES.decrypt(encryption, secretKey)
    .toString(Crypto.enc.Utf8)
    .replaceAll('"', '');
}
