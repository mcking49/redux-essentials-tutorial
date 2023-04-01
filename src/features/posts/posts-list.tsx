import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { useGetPostsQuery } from '../api/api-slice'
import { PostAuthor } from './post-author'
import { type Post } from './posts-slice'
import { ReactionButtons } from './reaction-buttons'
import { TimeAgo } from './time-ago'

type PostExcerptProps = {
  post: Post
}

const PostExcerptComponent = ({ post }: PostExcerptProps) => {
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

const PostExcerpt = memo(PostExcerptComponent)

export const PostsList = () => {
  const {
    data: posts = [],
    isError,
    isLoading,
    isSuccess,
    isFetching,
    error,
    refetch,
  } = useGetPostsQuery(null)

  const sortedPosts = useMemo(() => {
    const result = posts.slice()
    result.sort((a, b) => b.date.localeCompare(a.date))

    return result
  }, [posts])

  return (
    <section className="posts-list">
      <h2>Posts</h2>

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <button onClick={refetch}>Refetch Posts</button>

      {isLoading && <Spinner text="Loading..." />}

      {!isLoading && isSuccess && (
        <div className={clsx('posts-container', { disabled: isFetching })}>
          {sortedPosts.map((post) => (
            <PostExcerpt key={post.id} post={post} />
          ))}
        </div>
      )}

      {isError && <div>{error.toString()}</div>}
    </section>
  )
}
