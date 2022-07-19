import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://d29dkgeibpazuv.cloudfront.net'}),
    endpoints: builder => ({
        getGranules: builder.query({
            query: () => '/impacts_2dvd_diameter020.txt.cmr.json'
        }),
    })
})

export const {
    useGetGranulesQuery,
} = apiSlice