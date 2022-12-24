import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import { useState, useRef } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { GRAY_COLOR, WHITE_COLOR } from 'components/common/commonColor';
import basicLogo from 'assets/BasicLogo.svg';
import { usePostUserEditMutation } from 'services/signUpApi';

export default function MyEditPage() {
  const inputRef = useRef(null);
  const [edit] = usePostUserEditMutation();
  const { state } = useLocation();
  const [preview, setPreview] = useState(basicLogo);
  const [currentPassword, setCurrentPassword] = useState('');
  const [signUpForm, setSignUpForm] = useState({
    profileIMG: basicLogo,
    userPwd: '',
    userNickName: '',
    userAddress: '',
    userNo: state.userNo,
  });
  const [isCorrectPW, setIsCorrectPW] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('multipartFile', signUpForm.profileIMG);
      formData.append(
        'userDto',
        new Blob([JSON.stringify(signUpForm)], { type: 'application/json' })
      );
      console.log(formData.userDto);
      const res = await edit(formData).unwrap();
      console.log(res);

      // if (res.result === 'fail') {
      //   alert('회원정보 수정에 실패하였습니다. 다시 입력해주세요');
      // } else {
      //   alert('회원정보가 변경되었습니다.');
      //   sessionStorage.setItem('userToken', res.token);
      //   nav('/mypage');
      // }
    } catch (e) {
      console.log(e);
    }
  };
  const changeHandler = (e) => {
    if (e.target.id === 'currentpassword') setCurrentPassword(e.target.value);
    else setSignUpForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const passwordHandler = (e) => {
    e.preventDefault();
    console.log(state);
    if (currentPassword === state.userPwd) {
      alert('정보수정페이지로 이동합니다.');
      setIsCorrectPW(true);
    } else {
      alert('현재 비밀번호와 다릅니다. 다시 입력해주시기 바랍니다.');
      setCurrentPassword('');
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };
  function changeIMG(e) {
    console.log(e.target.files);
    const url = URL.createObjectURL(e.target.files[0]);
    setPreview(url);
    setSignUpForm((prev) => ({ ...prev, profileIMG: e.target.files[0] }));
  }
  return (
    <Container>
      {isCorrectPW ? (
        <>
          <SignUpHead>
            <Title>회원정보 변경</Title>
            <SubTitle>가지 마켓에 오신것을 환영합니다! </SubTitle>
          </SignUpHead>
          <Line width={'500px'} marginBottom={'50px'} />

          <Form onChange={(e) => changeHandler(e)}>
            <ProfileBox>
              <ImageBox src={preview} alt='' />
              <ImageUpLoaderLabel htmlFor='image-uploader'>프로필 사진 변경</ImageUpLoaderLabel>
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
                value={signUpForm.userPwd}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'새 비밀번호를 입력하세요'}
                type={'password'}
              />
              <InputTitle title={'닉네임'} isRequired />
              <InputTextBox
                id={'userNickName'}
                value={signUpForm.userNickName}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'닉네임를 입력하세요.'}
                type={'text'}
              />
              <InputTitle title={'주소'} isRequired />
              <InputTextBox
                id={'userAddress'}
                value={signUpForm.userAddress}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'주소를 입력하세요.'}
                type={'text'}
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

const ImageUpLoaderInput = styled.input.attrs({
  multiple: true,
  accept: 'image/*',
})`
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

const SubTitle = styled.p`
  margin-left: 30px;
  padding-top: 7px;
  font-size: 10px;
  vertical-align: bottom;
  color: #9a9a9a;
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
