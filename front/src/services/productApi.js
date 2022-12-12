import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://114.201.230.148:8090/product' }),
  endpoints: (builder) => ({
    getSellAll: builder.query({
      query: () => '/sellAll',
    }),
    getBuyAll: builder.query({
      query: () => '/buyAll',
    }),
  }),
});

export const { useGetSellAllQuery, useGetBuyAllQuery } = productApi;
