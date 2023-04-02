import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  type EntityState,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { type RootState } from '../../app/store'
import { apiSlice } from '../api/api-slice'

export type User = {
  id: string
  name: string
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data as User[]
})

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User>, void>({
      query: () => '/users',
      transformResponse: (responseData: User[]) => {
        console.log('responseData', responseData)
        return usersAdapter.setAll(initialState, responseData)
      },
    }),
  }),
})

export const { useGetUsersQuery } = extendedApiSlice

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data,
)

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors(
    (state: RootState) => selectUsersData(state) ?? initialState,
  )
