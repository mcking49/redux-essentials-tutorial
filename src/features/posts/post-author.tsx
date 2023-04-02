import { useAppSelector, type RootState } from '../../app/store'
import { selectUserById } from '../users/users-slice'

type Props = {
  userId: string
}

export const PostAuthor = ({ userId }: Props) => {
  const author = useAppSelector((state: RootState) =>
    selectUserById(state, userId),
  )

  return <span>by {author ? author.name : 'Unknown author'}</span>
}
