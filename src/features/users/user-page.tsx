import { useMemo } from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { Link, type match } from 'react-router-dom'

import { useAppSelector } from '../../app/store'
import { useGetPostQuery, useGetPostsQuery } from '../api/api-slice'
import { selectPostsByUser, type Post } from '../posts/posts-slice'
import { User, selectUserById } from './users-slice'

type Props = {
  match: match<{ userId: string }>
}

export const UserPage = ({ match }: Props) => {
  const { userId } = match.params

  const user = useAppSelector((state) => selectUserById(state, userId))

  const selectPostsForUser = useMemo(() => {
    const emptyArray: Post[] = []
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (res) => res.data,
      (res, userId: string) => userId,
      (data: Post[], userId: string) =>
        data?.filter((post) => post.user === userId) ?? emptyArray,
    )
  }, [])

  const { postsForUser } = useGetPostsQuery(null, {
    selectFromResult: (result) => ({
      // We can optionally include the other metadata fields from the result here
      ...result,
      // Include a field called `postsForUser` in the hook result object,
      // which will be a filtered list of posts
      postsForUser: selectPostsForUser(result, userId),
    }),
  })

  const x = useGetPostsQuery(null)

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
