import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/store'
import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './post-author'
import { fetchPosts, selectAllPosts, type Post } from './posts-slice'
import { ReactionButtons } from './reaction-buttons'
import { TimeAgo } from './time-ago'

type PostExcerptProps = {
  post: Post
}

const PostExcerpt = ({ post }: PostExcerptProps) => {
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectAllPosts)
  const postStatus = useAppSelector((state) => state.posts.status)
  const error = useAppSelector((state) => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      dispatch(fetchPosts())
    }
  }, [dispatch, postStatus])

  return (
    <section className="posts-list">
      <h2>Posts</h2>

      {postStatus === 'loading' && <Spinner text="Loading..." />}

      {postStatus === 'succeeded' &&
        posts
          .slice()
          .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
          .map((post) => <PostExcerpt key={post.id} post={post} />)}

      {postStatus === 'failed' && <div>{error}</div>}
    </section>
  )
}
