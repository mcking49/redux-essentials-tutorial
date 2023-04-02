import { useLayoutEffect } from 'react'
import clsx from 'clsx'
import { formatDistanceToNow, parseISO } from 'date-fns'

import { useAppDispatch, useAppSelector } from '../../app/store'
import { selectAllUsers } from '../users/users-slice'
import {
  allNotificationsRead,
  selectMetadataEntities,
  useGetNotificationsQuery,
} from './notifications-slice'

export const NotificationsList = () => {
  const dispatch = useAppDispatch()
  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetadata = useAppSelector(selectMetadataEntities)
  const users = useAppSelector((state) => selectAllUsers(state))

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>

      {notifications.map((notification) => {
        const date = parseISO(notification.date)
        const timeAgo = formatDistanceToNow(date)
        const user = users.find((user) => user.id === notification.user) || {
          name: 'Unknown User',
        }

        const metadata = notificationsMetadata[notification.id]

        const notificationClassname = clsx('notification', {
          new: metadata?.isNew,
        })

        return (
          <div key={notification.id} className={notificationClassname}>
            <div>
              <b>{user.name}</b> {notification.message}
            </div>
            <div title={notification.date}>
              <i>{timeAgo} ago</i>
            </div>
          </div>
        )
      })}
    </section>
  )
}
