import { Link, type match } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { useGetPostQuery } from '../api/api-slice'
import { PostAuthor } from './post-author'
import { ReactionButtons } from './reaction-buttons'

type Props = {
  match: match<{ postId: string }>
}

export const SinglePostPage = ({ match }: Props) => {
  const { postId } = match.params

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  return (
    <section>
      {isFetching && <Spinner text="Loading..." />}

      {!isFetching && isSuccess && post && (
        <article className="post">
          <h2>{post.title}</h2>
          <p className="post-content">{post.content}</p>
          <PostAuthor userId={post.user} />
          <Link to={`/editPost/${post.id}`} className="button">
            Edit Post
          </Link>
          <ReactionButtons post={post} />
        </article>
      )}
    </section>
  )
}
