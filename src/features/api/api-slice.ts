import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { type Post } from '../posts/posts-slice'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    // Queries
    getPost: builder.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
    }),

    getPosts: builder.query<Post[], null>({
      query: () => '/posts',
      providesTags: ['Post'],
    }),

    // Mutations
    addNewPost: builder.mutation<Post, Partial<Post>>({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
})

export const { useGetPostQuery, useGetPostsQuery, useAddNewPostMutation } =
  apiSlice
