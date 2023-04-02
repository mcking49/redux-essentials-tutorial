import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { type RootState } from '../../app/store'

const statuses = ['idle', 'loading', 'succeeded', 'failed', 'pending'] as const
export type Status = (typeof statuses)[number]

export const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
} as const

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost: Omit<Post, 'id' | 'reactions' | 'date'>) => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data as Post
  },
)

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data as Post[]
})

export type Post = {
  id: string
  title: string
  content: string
  user: string
  date: string
  reactions: Record<keyof typeof reactionEmoji, number>
}

const postsAdapter = createEntityAdapter({
  sortComparer: (a: Post, b: Post) => b.date.localeCompare(a.date),
})

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_state: RootState, userId: string) => userId],
  (posts, userId) => posts.filter((post: Post) => post.user === userId),
)
