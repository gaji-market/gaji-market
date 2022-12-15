import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://114.201.230.148:8080/product' }),

  endpoints: (builder) => ({
    getSellAll: builder.query({
      query: () => '/sellAll',
    }),
    getBuyAll: builder.query({
      query: () => '/buyAll',
    }),
    getCategory: builder.query({
      query: () => '/categoryInfo',
    }),
    createSaleProduct: builder.mutation({
      query: (product) => ({
        url: '/sellSave',
        method: 'POST',
        body: product,
      }),
    }),
    createPurchaseProduct: builder.mutation({
      query: (product) => ({
        url: '/buySave',
        method: 'POST',
        body: product,
      }),
    }),

    // 파일 테스트용
    testFile: builder.mutation({
      query: (product) => ({
        url: '/file',
        method: 'POST',
        body: product,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useGetSellAllQuery,
  useGetBuyAllQuery,
  useGetCategoryQuery,
  useCreateSaleProductMutation,
  useCreatePurchaseProductMutation,

  useTestFileMutation,
} = productApi;
