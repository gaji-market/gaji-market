import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const signUpApi = createApi({
  reducerPath: 'signUpApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://34.64.164.223:8080/user/' }),
  endpoints: (builder) => ({
    postUserSignForm: builder.mutation({
      query: (userData) => ({
        url: 'signUp',
        method: 'POST',
        body: userData,
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

export const { usePostUserSignFormMutation, usePostUserCheckIdMutation, usePostUserLoginMutation } =
  signUpApi;
