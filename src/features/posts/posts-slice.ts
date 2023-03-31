import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

export const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
} as const

export type Post = {
  id: string
  title: string
  content: string
  user?: string
  date?: string
  reactions: Record<keyof typeof reactionEmoji, number>
}

const initialState: Post[] = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      eyes: 0,
      heart: 0,
      hooray: 0,
      rocket: 0,
    },
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      eyes: 0,
      heart: 0,
      hooray: 0,
      rocket: 0,
    },
  },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.push(action.payload)
      },
      prepare: (title: string, content: string, userId?: string) => {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            user: userId,
            reactions: {
              thumbsUp: 0,
              eyes: 0,
              heart: 0,
              hooray: 0,
              rocket: 0,
            },
          },
        }
      },
    },

    postUpdated(state, action: PayloadAction<Post>) {
      const { id, title, content } = action.payload
      const existingPost = state.find((post) => post.id === id)

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
      const existingPost = state.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
})

export default postsSlice.reducer

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
