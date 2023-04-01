import { Link, type match } from 'react-router-dom'

import { useAppSelector } from '../../app/store'
import { selectPostsByUser } from '../posts/posts-slice'
import { selectUserById } from './users-slice'

type Props = {
  match: match<{ userId: string }>
}

export const UserPage = ({ match }: Props) => {
  const { userId } = match.params

  const user = useAppSelector((state) => selectUserById(state.users, userId))

  const postsForUser = useAppSelector((state) =>
    selectPostsByUser(state, userId),
  )

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user?.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
