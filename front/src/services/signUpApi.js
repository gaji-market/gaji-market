import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const signUpApi = createApi({
  reducerPath: 'signUpApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://114.201.230.148:8090/user/' }),
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
          'X-AUTH-TOKEN': sessionStorage.getItem('token'),
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
  }),
});

export const {
  usePostUserSignFormMutation,
  usePostUserCheckIdMutation,
  usePostUserLoginMutation,
  usePostUserMyPageMutation,
} = signUpApi;
