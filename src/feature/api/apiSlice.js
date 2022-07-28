//handles api calls for search

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'https://d29dkgeibpazuv.cloudfront.net/'}),
    tagTypes: ['grans'],
    endpoints: builder => ({
        getGranSearch: builder.query({
            query: ({ search, delim }) => ({
                url: `/?delimiter=${delim}&prefix=${search}`,
                responseHandler: (response) => response.text(),
            }),
        }),
    })
})

export const {
    useGetGranSearchQuery,
} = apiSlice