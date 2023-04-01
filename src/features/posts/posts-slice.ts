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

const initialState = postsAdapter.getInitialState({
  status: 'idle' as Status,
  error: null as string | null | undefined,
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated(state, action: PayloadAction<Post>) {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]

      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },

    reactionAdded(
      state,
      action: PayloadAction<{
        postId: Post['id']
        reaction: keyof Post['reactions']
      }>,
    ) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]

      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})

export default postsSlice.reducer

export const { postUpdated, reactionAdded } = postsSlice.actions

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_state: RootState, userId: string) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId),
)
