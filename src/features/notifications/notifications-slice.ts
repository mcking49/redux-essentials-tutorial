import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { type RootState } from '../../app/store'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_state, { getState }) => {
    const allNotifications = selectAllNotifications(getState() as RootState)
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`,
    )
    return response.data as Notification[]
  },
)

type Notification = {
  id: string
  date: string
  message: string
  user: string
  read: boolean
  isNew: boolean
}

const notificationsAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = notificationsAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
        if (notification) {
          notification.read = true
        }
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(
      fetchNotifications.fulfilled,
      (state, action: PayloadAction<Notification[]>) => {
        notificationsAdapter.upsertMany(state, action.payload)

        Object.values(state.entities).forEach((notification) => {
          if (notification) {
            // Any notifications we've read are no longer new
            notification.isNew = !notification.read
          }
        })
      },
    )
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state: RootState) => state.notifications)
