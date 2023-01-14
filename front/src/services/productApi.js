import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://3.39.156.141:8080/product/' }),
  tagTypes: ['SellAll', 'BuyAll'],
  keepUnusedDataFor: 30,

  endpoints: (builder) => ({
    getSellAll: builder.query({
      query: ({ recordCount, currentPage, sort, search }) =>
        `sellAll?recordCount=${recordCount}&currentPage=${currentPage}&sort=${sort}&search=${
          search || ''
        }`,
      providesTags: ['SellAll'],
      keepUnusedDataFor: 0,
    }),
    getBuyAll: builder.query({
      query: ({ recordCount, currentPage, sort, search }) =>
        `buyAll?recordCount=${recordCount}&currentPage=${currentPage}&sort=${sort}&search=${
          search || ''
        }`,
      providesTags: ['BuyAll'],
      keepUnusedDataFor: 0,
    }),
    getCategories: builder.query({
      query: () => 'categoryInfo',
    }),
    getProduct: builder.query({
      query: (id) => `/${id}`,
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
} = productApi;
