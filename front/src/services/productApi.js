import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://3.39.156.141:8080/product/' }),
  tagTypes: ['SellAll', 'BuyAll'],
  keepUnusedDataFor: 30,

  endpoints: (builder) => ({
    getSellAll: builder.query({
      providesTags: ['SellAll'],
      keepUnusedDataFor: 0,
      query: ({ recordCount, currentPage, sort }) => ({
        url: `sellAll?recordCount=${recordCount}&currentPage=${currentPage}&sort=${sort}`,
        headers: { 'X-AUTH-TOKEN': sessionStorage.getItem('userToken') },
      }),
    }),
    getBuyAll: builder.query({
      query: ({ recordCount, currentPage, sort }) =>
        `buyAll?recordCount=${recordCount}&currentPage=${currentPage}&sort=${sort}`,
      providesTags: ['BuyAll'],
      keepUnusedDataFor: 0,
      headers: {
        'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
      },
    }),
    getCategories: builder.query({
      query: () => 'categoryInfo',
    }),
    getProduct: builder.query({
      query: (id) => `/${id}`,
      headers: {
        'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
      },
    }),
    createSaleProduct: builder.mutation({
      query: (product) => ({
        url: 'sellSave',
        method: 'POST',
        body: product,
        headers: {
          'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
        },
      }),
      invalidatesTags: ['SellAll'],
    }),
    createPurchaseProduct: builder.mutation({
      query: (product) => ({
        url: 'buySave',
        method: 'POST',
        body: product,
        headers: {
          'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
        },
      }),
      invalidatesTags: ['BuyAll'],
    }),
    increaseInterest: builder.mutation({
      query: (prodNo) => ({
        url: 'interest',
        method: 'POST',
        body: { prodNo: Number(prodNo) },
        headers: {
          'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
        },
      }),
      invalidatesTags: ['SellAll', 'BuyAll'],
    }),
  }),
});

export const {
  useGetSellAllQuery,
  useGetBuyAllQuery,
  useLazyGetSellAllQuery,
  useLazyGetBuyAllQuery,
  useGetCategoriesQuery,
  useGetProductQuery,
  useCreateSaleProductMutation,
  useCreatePurchaseProductMutation,
  useIncreaseInterestMutation,
} = productApi;
