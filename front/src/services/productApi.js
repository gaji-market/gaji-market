import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://3.39.156.141:8080/product' }),

  endpoints: (builder) => ({
    getSellAll: builder.query({
      query: (params) => {
        const { pageCount, recordCount, sort } = params;

        return {
          url: '/sellAll',
          method: 'GET',
          params: { pageCount, recordCount, sort },
        };
      },
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
