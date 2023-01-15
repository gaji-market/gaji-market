import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://3.39.156.141:8080/product/' }),
  tagTypes: ['SellAll', 'BuyAll', 'DetailView'],
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
      providesTags: ['BuyAll'],
      keepUnusedDataFor: 0,
      query: ({ recordCount, currentPage, sort }) => ({
        url: `buyAll?recordCount=${recordCount}&currentPage=${currentPage}&sort=${sort}`,
        headers: {
          'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
        },
      }),
    }),
    getCategories: builder.query({
      query: () => 'categoryInfo',
    }),
    getProduct: builder.query({
      query: (id) => ({
        url: `/${id}`,
        headers: {
          'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
        },
      }),

      providesTags: ['SellAll', 'BuyAll', 'DetailView'],
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
    changeInterestCount: builder.mutation({
      query: (prodNo) => ({
        url: 'interest',
        method: 'POST',
        body: { prodNo: Number(prodNo) },
        headers: {
          'X-AUTH-TOKEN': sessionStorage.getItem('userToken'),
        },
      }),
      invalidatesTags: ['DetailView'],
    }),
    changeReportCount: builder.mutation({
      query: (prodNo) => ({
        url: 'report',
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
  useChangeInterestCountMutation,
  useChangeReportCountMutation,
  useCreateSaleProductMutation,
  useCreatePurchaseProductMutation,
  useIncreaseInterestMutation,
} = productApi;
