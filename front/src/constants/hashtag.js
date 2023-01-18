export const MAX_HASHTAG_COUNT = 10;

export const ALLOWED_COMMANDS = ['Comma', 'Enter', 'Space', 'NumpadEnter'];

export const SPECIAL_CHARACTERS_REG_EXP =
  /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s]/g;

export const HASHTAG_REG_EXP = /^[a-z|A-Z|가-힣|ㄱ-ㅎ|ㅏ-ㅣ|0-9| \t|]+$/g;
