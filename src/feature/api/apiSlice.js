import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://d29dkgeibpazuv.cloudfront.net'}),
    endpoints: builder => ({
        getGranules: builder.query({
            query: () => '/',
            method: 'GET',
        }),
        getGranSearch: builder.query({
            query: (search) => `/?delimiter=/&prefix=${search}`,
            method: 'GET',
        })
    })
})

export const {
    useGetGranulesQuery,
    useGetGranSearchQuery,
} = apiSlice