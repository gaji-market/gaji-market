import { useState } from 'react';
import { useTestFileMutation } from 'services/productApi';

export default function FileTest() {
  const [postFile] = useTestFileMutation();

  const [img, setImg] = useState([]);

  // sellSave 경로로 POST 요청시 아래 formDatas state를 사용
  const [formDatas, setFormDatas] = useState({
    prodName: '', // required
    prodPrice: 0, // required
    imageFiles: [], // required
    priceOffer: '0', // string : 가격제안유무(0: 제안X, 1: 제안O) required
    freeCheck: '0', // string : 무료나눔(0: X, 1: O) required
    largeCateNo: 1, // required
    mediumCateNo: 1, // required
    smallCateNo: 1, // required
    prodExplain: '', // 상품설명 required
    hashtags: [],
  });

  // onChange
  const uploadHandler = (e) => {
    const imageList = [];
  };

  // submit
  const submitFiles = (e) => {
    e.preventDefault();

    const formData = new FormData();
  };

  return (
    <div style={{ margin: '100px auto', width: '1000px' }}>
      <h2>이미지 파일 전송 테스트 페이지</h2>
      <br />
      <form encType='multipart/form-data'>
        <input accept='image/*' multiple type='file' onChange={uploadHandler} />
        <br />
        <br />
        <br />
        <button onClick={submitFiles} formEncType='multipart/form-data' type='submit'>
          서버로 전송 🚀
        </button>
      </form>
    </div>
  );
}
