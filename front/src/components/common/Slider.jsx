import React, { useRef, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import { PRIMARY_COLOR, WHITE_COLOR } from './commonColor';

import { removeTargetImage } from 'utils/removeTargetImage';

const NEXT_X = -690;

export default function Slider({ images, setFormDatas, setAddedImgs }) {
  const sliderRef = useRef(null);
  const { current } = sliderRef;

  const [slideNumber, setSlideNumber] = useState(0);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const changeTranslateX = (px) => {
    current.style.transform = `translateX(${px}px)`;
  };

  const changeOpacity = (figure) => {
    current.style.opacity = `${figure}`;
  };

  const changeTransition = (option, seconds) => {
    current.style.transition = `${option} ${seconds}s`;
  };

  const clickSlidePrev = () => {
    setSlideNumber((prev) => prev - 1);
    flash(50, 200);
  };

  const clickSlideNext = () => {
    setSlideNumber((prev) => prev + 1);
    flash(50, 200);
  };

  const flash = (start, end) => {
    setTimeout(() => {
      changeOpacity(0);
    }, start);

    setTimeout(() => {
      changeOpacity(1);
    }, end);
  };

  const mouseOverHandler = useCallback(() => {
    setShowDeleteBtn(true);
  }, []);

  const mouseLeaveHandler = useCallback(() => {
    setShowDeleteBtn(false);
  }, []);

  const checkSlideNumber = useCallback(() => {
    if (slideNumber - 1 === images.length) {
      setSlideNumber(() => 0);
    }
  }, [images.length]);

  const deleteHandler = (url) => () => {
    setAddedImgs(removeTargetImage(images, url));

    setFormDatas((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter(({ name }) => {
        return name !== url.split('/').pop();
      }),
    }));

    checkSlideNumber();
  };

  useEffect(() => {
    if (!current) return;

    if (slideNumber >= 0) {
      changeTranslateX(NEXT_X * slideNumber);
      changeTransition('opacity', 0.4);
    }

    if (slideNumber < 0) {
      return setSlideNumber(() => images.length - 1);
    }

    if (slideNumber > images.length - 1) {
      changeTranslateX(0);
      return setSlideNumber(() => 0);
    }
  }, [slideNumber, images.length]);

  return (
    <>
      <Container ref={sliderRef}>
        {images.length > 0 &&
          images.map((url, idx) => {
            return (
              <li
                onMouseOver={mouseOverHandler}
                onMouseLeave={mouseLeaveHandler}
                key={url}
                className='img-list'
              >
                <Image src={url} alt='upload_image' />
                <p className='img-page'>{`${idx + 1}/${images.length}`}</p>
                {showDeleteBtn && (
                  <button
                    type='button'
                    className='delete-img-btn'
                    onClick={deleteHandler(url)}
                  >
                    삭제
                  </button>
                )}
              </li>
            );
          })}
      </Container>
      {images.length > 0 && (
        <div className='btn-wrapper'>
          <button className='prev-btn' type='button' onClick={clickSlidePrev}>
            ⥢ PREV
          </button>
          <button className='next-btn' type='button' onClick={clickSlideNext}>
            NEXT ⥤
          </button>
        </div>
      )}
    </>
  );
}

const Container = styled.ul`
  display: flex;
  margin-top: 15px;

  li {
    flex-grow: 1;
    position: relative;
  }

  .img-page {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 10px;
  }

  .delete-img-btn {
    position: absolute;
    background-color: ${PRIMARY_COLOR};
    right: 0;
    top: 0;
    padding: 10px;
    border: none;
    border-radius: 5px;
    color: ${WHITE_COLOR};
    margin: 5px;
    cursor: pointer;
  }
`;

const Image = styled.img`
  width: 690px;
  height: 250px;
  object-fit: contain;
  border-radius: 10px;
  display: block;
`;
