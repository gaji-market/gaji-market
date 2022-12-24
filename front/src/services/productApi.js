import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://3.39.156.141:8080/product' }),
  tagTypes: ['SellAll'],
  keepUnusedDataFor: 30,

  endpoints: (builder) => ({
    getSellAll: builder.query({
      query: ({ recordCount, currentPage, sort }) =>
        `/sellAll?recordCount=${recordCount}&currentPage=${currentPage}&sort=${sort}`,
      providesTags: ['SellAll'],
      keepUnusedDataFor: 0,
    }),
    getBuyAll: builder.query({
      query: () => '/buyAll',
    }),
    getCategories: builder.query({
      query: () => '/categoryInfo',
    }),
    getProduct: builder.query({
      query: (id) => `/${id}`,
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
  }),
});

export const {
  useGetSellAllQuery,
  useGetBuyAllQuery,
  useGetCategoriesQuery,
  useGetProductQuery,
  useCreateSaleProductMutation,
  useCreatePurchaseProductMutation,
} = productApi;
