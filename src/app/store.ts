import { configureStore } from '@reduxjs/toolkit'
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux'

import notificationsReducer from '../features/notifications/notifications-slice'
import postsReducer from '../features/posts/posts-slice'
import usersReducer from '../features/users/users-slice'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    posts: postsReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
