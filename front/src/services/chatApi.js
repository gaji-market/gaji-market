import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/chat`,
  }),
  tagTypes: ['Message', 'ChatRoom'],
  endpoints: ({ query, mutation }) => ({
    // FIXME: TEST용 API, 삭제
    getUserNo: query({
      query: (chatNo) => `getUserNo/${chatNo}`,
      // response
      // {
      //   userNo: Number;
      //   tgUserNo: Number;
      // }
    }),
    getChatRoomList: mutation({
      providesTags: ['ChatRoom'],
      // FIXME: userNo 삭제
      query: (userNo) => ({
        url: `getChatRoomList/${userNo}`,
        method: 'POST',
        body: {
          currentPage: 1,
          recordCount: 10,
        },
      }),
      // response
      // {
      //   schPage: {
      //     totalRecordCount: Number;
      //     totalPageCount: Number;
      //     currentPage: Number;
      //     recordCount: Number;
      //     pageCount: Number;
      //     limitPage: Number;
      //     searchType: Number;
      //     sort: String;
      //     search: String;
      //   };
      //   chatRoomInfos: {
      //     regTime: String;
      //     userNo: Number;
      //     lastMessage: String;
      //     nickName: String;
      //     regDate: String;
      //     checkCnt: Number;
      //     chatNo: Number;
      //   }[];
      // }
    }),
    getChatRoom: query({
      providesTags: ['ChatRoom'],
      // FIXME: userNo 삭제
      query: (chatNo, userNo) => `getChatRoom/${chatNo}/${userNo}`,
      // response
      // {
      //   chatRoonInfo: {
      //     chatNo: Number;
      //     prodNo: Number;
      //     userNo: Number;
      //     tgUserNo: Number;
      //   };
      //   chatMessageInfos: {
      //     no: Number;
      //     regTime: String;
      //     checkYn: 'Y' | 'N';
      //     nickName: String;
      //     regDate: String;
      //     message: String;
      //     chatNo: Number;
      //   }[];
      //   productInfo: {
      //     필요한 정보만 받기
      //   };
      // }
    }),
    addChatRoom: mutation({
      invalidatesTags: ['ChatRoom'],
      // FIXME: userNo 삭제
      query: ({ prodNo, userNo }) => ({
        url: `addChatRoom/${userNo}`,
        method: 'POST',
        body: {
          prodNo: prodNo,
          userNo: userNo,
        },
      }),
      // response
      // {
      //   chatRoonInfo: {
      //     chatNo: Number;
      //     prodNo: Number;
      //     userNo: Number;
      //     tgUserNo: Number;
      //   };
      //   result: {
      //     msg: 'Success' | 'Fail';
      //     value: 1 | 0; // 1 성공, 0 실패
      //   };
      // }
    }),
    removeChatRoom: query({
      invalidatesTags: ['ChatRoom'],
      query: (chatNo) => `removeChatRoom/${chatNo}`,
      // response
      // {
      //   msg: 'Success' | 'Fail';
      //   value: 1 | 0; // 1 성공, 0 실패
      // }
    }),
    // notion에 내용 없음
    addChatMessage: mutation({
      providesTags: ['Message'],
      query: (userNo) => ({
        url: `addChatMessage/${userNo}`,
        method: 'POST',
        body: {},
      }),
    }),
    removeChatMessage: query({
      invalidatesTags: ['Message'],
      query: (messageNo) => `removeChatMessage/${messageNo}`,
      // response
      // {
      //   msg: 'Success' | 'Fail';
      //   value: 1 | 0; // 1 성공, 0 실패
      // }
    }),
  }),
});

export const {
  useGetChatRoomListMutation,
  useAddChatMessageMutation,
  useAddChatRoomMutation,
  useLazyGetChatRoomQuery,
  useLazyGetUserNoQuery,
  useLazyRemoveChatMessageQuery,
  useLazyRemoveChatRoomQuery,
} = chatApi;
