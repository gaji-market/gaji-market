import { useState, useEffect } from 'react';
import styled from 'styled-components';

import isEmptyValue from 'utils/isEmptyValue';
import InputTitle from './InputTitle';

import {
  MAX_HASHTAG_COUNT,
  ALLOWED_COMMANDS,
  SPECIAL_CHARACTERS_REG_EXP,
  HASHTAG_REG_EXP,
} from 'constants/hashtag';

export default function Hashtag({ hashtags, setFormDatas }) {
  const [hashtagInput, setHashtagInput] = useState('');

  const isEmptyHashTag = (e, input) => {
    if (isEmptyValue(e.target.value.trim())) {
      return true;
    }

    if (input.includes(',')) {
      return !isEmptyValue(input.split(',').join(''));
    }

    return false;
  };

  const removeSpecialCharacters = () => {
    return hashtagInput.replace(SPECIAL_CHARACTERS_REG_EXP, '');
  };

  const keyUpHandler = (e) => {
    if (!ALLOWED_COMMANDS.includes(e.code)) return;

    const hashtag = removeSpecialCharacters();

    if (isEmptyHashTag(e, hashtag)) {
      return setHashtagInput(() => '');
    }

    setFormDatas((prev) => {
      return {
        ...prev,
        hashtags: [...new Set([...prev.hashtags, hashtag])],
      };
    });

    setHashtagInput('');
  };

  const changeInput = ({ target }) => {
    setHashtagInput(target.value);
  };

  const deleteHashtag = ({ target }) => {
    const newHashtags = hashtags.filter((hashtag) => {
      return target.innerHTML !== hashtag;
    });

    setFormDatas((prev) => ({
      ...prev,
      hashtags: newHashtags,
    }));
  };

  const keyDownHandler = (e) => {
    if (ALLOWED_COMMANDS.includes(e.code)) e.preventDefault();

    if (!HASHTAG_REG_EXP.test(e.target.value)) {
      setHashtagInput(e.target.value.replace(SPECIAL_CHARACTERS_REG_EXP, ''));
    }
  };

  useEffect(() => {
    setFormDatas((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((hashtag) => hashtag !== ''),
    }));
  }, [hashtags.length]);

  useEffect(() => {
    if (hashtags.length > MAX_HASHTAG_COUNT) {
      setFormDatas((prev) => ({
        ...prev,
        hashtags: prev.hashtags.slice(0, MAX_HASHTAG_COUNT),
      }));

      return window.alert('해시태그는 10개 이상 등록할 수 없습니다.');
    }
  }, [hashtags.length]);

  return (
    <Container>
      <InputTitle title='해시태그' />
      <div className='hashtags'>
        {hashtags.length > 0 &&
          hashtags.map((hashTag) => {
            return (
              <div onClick={deleteHashtag} key={hashTag} className='tag'>
                {hashTag}
              </div>
            );
          })}

        <input
          value={hashtagInput}
          onChange={changeInput}
          onKeyUp={keyUpHandler}
          onKeyDown={keyDownHandler}
          placeholder='#해시태그를 등록해보세요. (최대 10개)'
          className='hashtag-input'
          maxLength='20'
        />
      </div>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 20px;
`;
