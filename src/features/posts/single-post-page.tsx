import { Link, type match } from 'react-router-dom'

import { useAppSelector } from '../../app/store'
import { PostAuthor } from './post-author'
import { ReactionButtons } from './reaction-buttons'

type Props = {
  match: match<{ postId: string }>
}

export const SinglePostPage = ({ match }: Props) => {
  const { postId } = match.params

  const post = useAppSelector((state) =>
    state.posts.find((post) => post.id === postId),
  )

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <PostAuthor userId={post.user} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
        <ReactionButtons post={post} />
      </article>
    </section>
  )
}
