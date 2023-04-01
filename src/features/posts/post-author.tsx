import { type EntityId } from '@reduxjs/toolkit'

import { useAppSelector } from '../../app/store'
import { selectUserById } from '../users/users-slice'

type Props = {
  userId: EntityId
}

export const PostAuthor = ({ userId }: Props) => {
  const author = useAppSelector((state) => selectUserById(state.users, userId))

  return <span>by {author ? author.name : 'Unknown author'}</span>
}
