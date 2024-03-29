import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { decrypt } from 'utils/crypto';

export const signUpApi = createApi({
  reducerPath: 'signUpApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/user/`,
    prepareHeaders: (headers, { getState }) => {
      let token;
      if (getState().session?.token) {
        token = decrypt(
          process.env.REACT_APP_SESSION_KEY || '',
          getState().session.token
        );
      }
      if (token) {
        headers.set('X-AUTH-TOKEN', token);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    postUserSignForm: builder.mutation({
      query: (userData) => ({
        url: 'signUp',
        method: 'POST',
        body: userData,
      }),
    }),
    postUserMyPage: builder.mutation({
      query: () => ({
        url: 'myPage',
        method: 'POST',
      }),
    }),
    postUserCheckId: builder.mutation({
      query: (Id) => ({
        url: 'checkUserId',
        method: 'POST',
        body: Id,
      }),
    }),
    postUserLogin: builder.mutation({
      query: (login) => ({
        url: 'signIn',
        method: 'POST',
        body: login,
      }),
    }),
    postUserEdit: builder.mutation({
      query: (edit) => ({
        url: 'userUpdate',
        method: 'POST',
        body: edit,
      }),
    }),
    postSearchIdPw: builder.mutation({
      query: (userInfo) => ({
        url: 'searchIdPwd',
        method: 'POST',
        body: userInfo,
      }),
    }),
    postUpdatePassword: builder.mutation({
      query: (newPW) => ({
        url: 'updatePwd',
        method: 'POST',
        body: newPW,
      }),
    }),
    postUserCard: builder.mutation({
      query: ({ type, pageInfo }) => ({
        url: `${type}ProdList`,
        method: 'POST',
        body: {
          recordCount: 8,
          currentPage: pageInfo.currentPage,
          sort: 'default',
        },
      }),
    }),
  }),
});

export const {
  usePostUserSignFormMutation,
  usePostUserCheckIdMutation,
  usePostUserLoginMutation,
  usePostUserMyPageMutation,
  usePostUserEditMutation,
  usePostUserCardMutation,
  usePostSearchIdPwMutation,
  usePostUpdatePasswordMutation,
} = signUpApi;
