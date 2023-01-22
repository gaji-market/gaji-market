import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { decrypt } from 'utils/crypto';

export const productApi = createApi({
  reducerPath: 'productApi',
  tagTypes: ['SellAll', 'BuyAll', 'DetailView'],
  keepUnusedDataFor: 30,
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/product/`,
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
    getSellAll: builder.query({
      providesTags: ['SellAll'],
      keepUnusedDataFor: 0,
      query: ({ recordCount, currentPage, sort, search, cateCode }) => ({
        url: `sellAll?recordCount=${recordCount}&currentPage=${currentPage}&sort=${sort}${
          search ? `&search=${search}` : ''
        }${cateCode ? `&cateCode=${cateCode}` : ''}`,
      }),
    }),
    getBuyAll: builder.query({
      query: ({ recordCount, currentPage, sort, search, cateCode }) =>
        `buyAll?recordCount=${recordCount}&currentPage=${currentPage}&sort=${sort}${
          search ? `&search=${search}` : ''
        }${cateCode ? `&cateCode=${cateCode}` : ''}`,
      providesTags: ['BuyAll'],
      keepUnusedDataFor: 0,
    }),
    getCategories: builder.query({
      query: () => 'categoryInfo',
    }),
    getProduct: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),

      providesTags: ['SellAll', 'BuyAll', 'DetailView'],
    }),
    getProductModification: builder.query({
      query: (prodNo) => ({
        url: `beforeUpdate/${prodNo}`,
      }),
      providesTags: ['SellAll', 'BuyAll', 'DetailView'],
    }),
    createSaleProduct: builder.mutation({
      query: (product) => ({
        url: 'sellSave',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['SellAll'],
    }),
    createPurchaseProduct: builder.mutation({
      query: (product) => ({
        url: 'buySave',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['BuyAll'],
    }),
    changeInterestCount: builder.mutation({
      query: (prodNo) => ({
        url: 'interest',
        method: 'POST',
        body: { prodNo: Number(prodNo) },
      }),
      invalidatesTags: ['DetailView'],
    }),
    changeReportCount: builder.mutation({
      query: (prodNo) => ({
        url: 'report',
        method: 'POST',
        body: { prodNo: Number(prodNo) },
      }),
      invalidatesTags: ['SellAll', 'BuyAll'],
    }),
    deleteProduct: builder.mutation({
      query: (prodNo) => ({
        url: 'delete',
        method: 'POST',
        body: { prodNo: Number(prodNo) },
      }),
      invalidatesTags: ['SellAll', 'BuyAll'],
    }),
    modifyProduct: builder.mutation({
      query: (product) => ({
        url: 'update',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['SellAll', 'BuyAll', 'DetailView'],
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
  useGetProductModificationQuery,
  useChangeInterestCountMutation,
  useChangeReportCountMutation,
  useCreateSaleProductMutation,
  useCreatePurchaseProductMutation,
  useIncreaseInterestMutation,
  useDeleteProductMutation,
  useModifyProductMutation,
} = productApi;
