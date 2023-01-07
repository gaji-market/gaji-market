import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const alarmApi = createApi({
  reducerPath: 'alarmApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/notifi`,
  }),
  tagTypes: ['Alarm'],
  endpoints: ({ query, mutation }) => ({
    addNotifi: mutation({
      invalidatesTags: ['Alarm'],
      query: ({ userNo }) => ({
        // FIXME: userNo 삭제
        url: `addNotifi/${userNo}`,
        method: 'POST',
        body: {
          userNo: '2', //알림을 받는 유저 정보(채팅을 받는 판매자, 좋아요 눌린 상품 판매자)
          gubun: '2', //1 - 채팅(첫 채팅 메시지 보낼 시) / 2 - 좋아요(좋아요 눌렀을 때)
          message: '좋아요 알림', //템플릿 필요
        },
      }),
      // response
      // {
      //   msg: 'Success' | 'Fail' | 'Exception';
      //   value: 1 | 0 | -99;
      // }
    }),
    getNotifiList: mutation({
      providesTags: ['Alarm'],
      query: ({ gubun, userNo }) => ({
        // FIXME: userNo 삭제
        url: `getNotifiList/${gubun}/${userNo}`,
        method: 'POST',
        body: {
          currentPage: 1, //시작 페이지
          recordCount: 10, //한 페이지 당 가져올 글의 개수
        },
      }),
    }),
    getCheckCnt: query({
      // FIXME: userNo 삭제
      query: (userNo) => `getCheckCnt/${userNo}`,
      // response
      // {
      //   chatCheckCnt: Number;
      //   intstCheckCnt: Number;
      // }
    }),
  }),
});

export const {
  useGetCheckCntQuery,
  useAddNotifiMutation,
  useGetNotifiListMutation,
} = alarmApi;
