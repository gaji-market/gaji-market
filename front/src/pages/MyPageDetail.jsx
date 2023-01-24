import styled from 'styled-components';
import { usePostUserCardMutation } from 'services/signUpApi';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useToast from 'hooks/toast';
const VALID_PAGE = ['interest', 'sell', 'buy'];
export default function MyPageDetail() {
  const nav = useNavigate();
  const { addToast } = useToast();
  const [getCard, { isLoading }] = usePostUserCardMutation('');
  const { type: param } = useParams();
  async function getUserData() {
    try {
      const res = await getCard(param).unwrap();
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    if (!VALID_PAGE.includes(param)) {
      addToast({
        isToastSuccess: false,
        isMainTheme: true,
        toastTitle: '잘못된 접근!',
        toastMessage: '정상적이지 않은 페이지에 접속하셨습니다.',
      });
      nav('/mypage');
    } else {
      getUserData();
    }
  }, []);

  return <Container></Container>;
}

const Container = styled.div``;
