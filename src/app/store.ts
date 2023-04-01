import { configureStore } from '@reduxjs/toolkit'
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux'

import { apiSlice } from '../features/api/api-slice'
import notificationsReducer from '../features/notifications/notifications-slice'
import postsReducer from '../features/posts/posts-slice'
import usersReducer from '../features/users/users-slice'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    posts: postsReducer,
    users: usersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
