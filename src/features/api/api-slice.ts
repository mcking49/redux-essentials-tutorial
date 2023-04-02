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
      providesTags: (_result, _error, arg) => [{ type: 'Post', id: arg }],
    }),

    getPosts: builder.query<Post[], null>({
      query: () => '/posts',
      providesTags: (result = []) => [
        'Post',
        ...result.map(({ id }) => ({ type: 'Post' as const, id })),
      ],
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

    addReaction: builder.mutation<
      void,
      { postId: string; reaction: keyof Post['reactions'] }
    >({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', null, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.find((post) => post.id === postId)
            if (post) {
              post.reactions[reaction]++
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    editPost: builder.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Post', id: arg.id }],
    }),
  }),
})

export const {
  useGetPostQuery,
  useGetPostsQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice
