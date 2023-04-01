import { Link } from 'react-router-dom'

import {
  fetchNotifications,
  selectAllNotifications,
} from '../features/notifications/notifications-slice'
import { useAppDispatch, useAppSelector } from './store'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(selectAllNotifications)
  const numUnreadNotifications = notifications.filter((n) => !n.read).length

  const fetchNewNotifications = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    dispatch(fetchNotifications())
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">
              <span>Notifications</span>
              {numUnreadNotifications > 0 && (
                <span className="badge">{numUnreadNotifications}</span>
              )}
            </Link>
          </div>

          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
