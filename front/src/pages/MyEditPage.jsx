import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import { useState, useRef } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { GRAY_COLOR, WHITE_COLOR } from 'components/common/commonColor';
import basicLogo from 'assets/BasicLogo.svg';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import getAddress from 'utils/getAddress';
import { usePostUserEditMutation } from 'services/signUpApi';
import { useEffect } from 'react';
import useToast from 'hooks/toast';
const DaumURL =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export default function MyEditPage() {
  const nav = useNavigate();
  const inputRef = useRef(null);
  const { addToast } = useToast();
  const [edit] = usePostUserEditMutation();
  const { state } = useLocation();
  const [preview, setPreview] = useState(basicLogo);
  const [currentPassword, setCurrentPassword] = useState('');
  const [updateForm, setUpdateForm] = useState({
    profileIMG: basicLogo,
    userPwd: '',
    userNickName: state.userNickName,
    userAddress: state.userAddress,
    userNo: state.userNo,
  });
  const open = useDaumPostcodePopup(DaumURL);

  const [isCorrectPW, setIsCorrectPW] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('multipartFile', updateForm.profileIMG);
      formData.append(
        'dto',
        new Blob([JSON.stringify(updateForm)], { type: 'application/json' })
      );
      const res = await edit(formData).unwrap();
      console.log(res);
      if (res.result === 'fail') {
        addToast({
          isToastSuccess: false,
          isMainTheme: true,
          toastMessage: '회원정보 수정에 실패하였습니다. 다시 입력해주세요',
        });
      } else {
        addToast({
          isToastSuccess: true,
          isMainTheme: true,
          toastMessage: '회원정보가 변경되었습니다.',
        });
        nav('/mypage');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const changeHandler = (e) => {
    console.log(1111);

    if (e.target.id === 'currentpassword') setCurrentPassword(e.target.value);
    else setUpdateForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const passwordHandler = (e) => {
    e.preventDefault();
    if (currentPassword === state.userPwd) {
      addToast({
        isToastSuccess: true,
        isMainTheme: true,
        toastMessage: '정보수정 페이지로 이동합니다.',
      });
      setIsCorrectPW(true);
    } else {
      addToast({
        isToastSuccess: false,
        isMainTheme: true,
        toastMessage: '현재 비밀번호랑 다릅니다. 다시 입력해주시기 바랍니다.',
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

  const handleComplete = (data) => {
    const fullAddress = getAddress(data);
    setUpdateForm((prev) => ({ ...prev, userAddress: fullAddress }));
    inputRef.current.value = fullAddress;
  };
  useEffect(() => {
    console.log(updateForm);
  }, [updateForm]);
  return (
    <Container>
      {isCorrectPW ? (
        <>
          <SignUpHead>
            <Title>회원정보 변경</Title>
          </SignUpHead>
          <Line width={'500px'} marginBottom={'50px'} />

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
              <div>아이디:vjvl95</div>
              <div>이름:홍짱</div>
              <div>생년월일:1995-08-23</div>
            </Head>
            <InputBox>
              <InputTitle title={'새 비밀번호'} isRequired />
              <InputTextBox
                id={'userPwd'}
                value={updateForm.userPwd}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'새 비밀번호를 입력하세요'}
                type={'password'}
              />
              <InputTitle title={'닉네임'} isRequired />
              <InputTextBox
                id={'userNickName'}
                value={updateForm.userNickName}
                containerBottom={'20px'}
                width={'400px'}
                type={'text'}
              />
              <InputTitle title={'주소'} isRequired />
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
            <Title>비밀번호 확인</Title>
          </SignUpHead>
          <Line width={'500px'} marginBottom={'50px'} />
          <Form onChange={(e) => changeHandler(e)}>
            <InputBox>
              <InputTitle title={'비밀번호'} />
              <InputTextBox
                inputRef={inputRef}
                id={'currentpassword'}
                value={currentPassword}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'비밀번호를 입력하세요'}
                type={'password'}
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
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
`;
const ImageUpLoaderLabel = styled.label`
  width: 50%;
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
  font-weight: 800;
  display: flex;
  justify-content: space-between;
  padding: 30px;
`;
const Container = styled.div`
  width: 700px;
  height: 800px;
  margin: 60px auto;
  border-radius: 35px;
  box-shadow: 0px 0px 30px 1px ${GRAY_COLOR};
  padding: 50px 100px;
`;
const InputBox = styled.div`
  margin-left: 45px;
`;

const ImageUpLoaderInput = styled.input.attrs({})`
  display: none;
`;

const Line = styled.hr`
  border: 1px solid #cccccc;
  width: ${(props) => props.width};
  margin-bottom: ${(props) => props.marginBottom};
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 16px;
  margin-right: 10px;
  margin-left: ${(props) => props.margin};
`;

const SignUpHead = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const Form = styled.form``;

const ButtonBox = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;
