import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDaumPostcodePopup } from 'react-daum-postcode';

import {
  GRAY_COLOR,
  PRIMARY_COLOR,
  WHITE_COLOR,
} from 'components/common/commonColor';
import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import Button from 'components/common/Button';

import basicLogo from 'assets/BasicLogo.svg';

import getAddress from 'utils/getAddress';

import { usePostUserEditMutation } from 'services/signUpApi';

import useToast from 'hooks/toast';
import { useEffect } from 'react';
import DecoFooter from 'components/common/DecoFooter';

const DaumURL =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export default function MyEditPage() {
  const nav = useNavigate();
  const inputRef = useRef(null);
  const { addToast } = useToast();
  const [edit] = usePostUserEditMutation();
  const { state } = useLocation();
  const [preview, setPreview] = useState(
    state.dbFileName
      ? `${process.env.REACT_APP_IMG_PREFIX_URL}${state.dbFileName}`
      : basicLogo
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const [updateForm, setUpdateForm] = useState({
    profileIMG: preview,
    userPwd: '',
    userNickName: state.userNickName,
    userAddress: state.userAddress,
    userNo: state.userNo,
  });
  const open = useDaumPostcodePopup(DaumURL);

  const [isCorrectPW, setIsCorrectPW] = useState(false);
  const submitHandler = async (e) => {
    try {
      const formData = new FormData();
      formData.append('multipartFile', updateForm.profileIMG);
      formData.append(
        'dto',
        new Blob([JSON.stringify(updateForm)], { type: 'application/json' })
      );
      const res = await edit(formData).unwrap();
      if (res.result === 'fail') {
        addToast({
          isToastSuccess: false,
          isMainTheme: true,
          toastTitle: '정보 수정 실패',
          toastMessage: '다시 입력해주세요',
        });
      } else {
        addToast({
          isToastSuccess: true,
          isMainTheme: true,
          toastTitle: '정보 수정 성공!',
          toastMessage: '회원정보가 변경되었습니다.',
        });
        nav('/mypage');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeHandler = (e) => {
    if (e.target.id === 'currentpassword') setCurrentPassword(e.target.value);
    else setUpdateForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const passwordHandler = (e) => {
    if (currentPassword === state.userPwd) {
      addToast({
        isToastSuccess: true,
        isMainTheme: true,
        toastTitle: '가지마켓',
        toastMessage: '정보수정 페이지로 이동합니다.',
      });
      setIsCorrectPW(true);
    } else {
      addToast({
        isToastSuccess: false,
        isMainTheme: true,
        toastTitle: '다시 확인해주세요!',
        toastMessage: '현재 비밀번호와 일치하지 않습니다.',
      });
      setCurrentPassword('');
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  function changeIMG(e) {
    const url = URL.createObjectURL(e.target.files[0]);
    setPreview(url);
    setUpdateForm((prev) => ({ ...prev, profileIMG: e.target.files[0] }));
  }
  const onKeyPress = (e) => {
    if (isCorrectPW) {
      if (e.key === 'Enter') submitHandler();
    } else {
      if (e.key === 'Enter') passwordHandler();
    }
  };
  const handleComplete = (data) => {
    const fullAddress = getAddress(data);
    setUpdateForm((prev) => ({ ...prev, userAddress: fullAddress }));
    inputRef.current.value = fullAddress;
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Container>
      {isCorrectPW ? (
        <>
          <CorrectSignUpHead>
            <Title>회원정보 변경</Title>
          </CorrectSignUpHead>
          <Form onChange={(e) => changeHandler(e)}>
            <ProfileBox>
              <ImageBox src={preview} alt='' />
              <ImageUpLoaderLabel htmlFor='image-uploader'>
                프로필 사진 변경
              </ImageUpLoaderLabel>
              <ImageUpLoaderInput
                id='image-uploader'
                name='image-uploader'
                type='file'
                onChange={(e) => changeIMG(e)}
              />
            </ProfileBox>
            <Head>
              <div>
                <span>아이디: </span>vjvl95
              </div>
              <div>
                <span>이름: </span>홍짱
              </div>
              <div>
                <span>생년월일: </span>1995-08-23
              </div>
            </Head>
            <InputBox>
              <InputTitle title={'새 비밀번호'} />
              <InputTextBox
                id={'userPwd'}
                value={updateForm.userPwd}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'새 비밀번호를 입력하세요.'}
                type={'password'}
                onKeyPress={onKeyPress}
              />
              <InputTitle title={'닉네임'} />
              <InputTextBox
                id={'userNickName'}
                value={updateForm.userNickName}
                containerBottom={'20px'}
                width={'400px'}
                type={'text'}
                onKeyPress={onKeyPress}
              />
              <InputTitle title={'주소'} />
              <InputTextBox
                inputRef={inputRef}
                id={'userAddress'}
                value={updateForm.userAddress}
                width={'400px'}
                containerBottom={'20px'}
                padding={'10px'}
                type={'text'}
                isReadOnly={true}
                clickHandler={() => open({ onComplete: handleComplete })}
              />
            </InputBox>
            <ButtonBox>
              <Button customSize='400px' onClick={(e) => submitHandler(e)}>
                정보 수정
              </Button>
            </ButtonBox>
          </Form>
        </>
      ) : (
        <>
          <SignUpHead>
            <Title>내 정보 수정</Title>
            <SubTitle>정보 수정을 위해 비밀번호를 입력해주세요.</SubTitle>
          </SignUpHead>
          <Form onChange={(e) => changeHandler(e)}>
            <InputBox>
              <InputTitle title={'비밀번호'} />
              <InputTextBox
                inputRef={inputRef}
                id={'currentpassword'}
                value={currentPassword}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'비밀번호를 입력하세요.'}
                type={'password'}
                onKeyPress={onKeyPress}
              />
            </InputBox>
            <ButtonBox>
              <Button customSize='400px' onClick={(e) => passwordHandler(e)}>
                제출
              </Button>
            </ButtonBox>
          </Form>
        </>
      )}
      <DecoFooter />
    </Container>
  );
}

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImageBox = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  overflow: hidden;
  border-radius: 200px;
`;

const ImageUpLoaderLabel = styled.label`
  display: block;
  background: ${GRAY_COLOR};
  color: ${WHITE_COLOR};
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin-top: 15px;
`;

const Head = styled.div`
  width: 100%;
  padding-left: 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 15px;
  gap: 15px;
  font-weight: 500;
  margin-bottom: 23px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;

  span {
    font-weight: 700;
  }
`;

const Container = styled.div`
  width: 500px;
  margin: auto;
  margin-top: 80px;
  border-radius: 20px;
  border: 2px solid #eee;
  box-shadow: 3px 3px 30px #eeeeee80;
  padding: 40px;
  position: relative;
  overflow: hidden;
`;

const InputBox = styled.div`
  z-index: 5;
`;

const ImageUpLoaderInput = styled.input.attrs({})`
  display: none;
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 18px;
  color: ${PRIMARY_COLOR};
  margin-right: 10px;
  margin-left: ${(props) => props.margin};
`;

const SubTitle = styled.p`
  font-size: 14px;
  margin-left: 5px;
  padding-top: 1px;
  color: #9a9a9a;
`;

const SignUpHead = styled.div`
  display: flex;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const CorrectSignUpHead = styled.div``;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const ButtonBox = styled.div`
  margin-top: 10px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  z-index: 5;
`;
