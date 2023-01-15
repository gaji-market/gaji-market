import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const signUpApi = createApi({
  reducerPath: 'signUpApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/user/`,
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
        headers: {
          'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
        },
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
        headers: {
          'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
        },
        body: edit,
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
} = signUpApi;
