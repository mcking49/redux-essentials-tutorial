import { useState, type ChangeEvent } from 'react'
import { useHistory, type match } from 'react-router-dom'

import { useEditPostMutation, useGetPostQuery } from '../api/api-slice'

type Props = {
  match: match<{ postId: string }>
}

export const EditPostForm = ({ match }: Props) => {
  const { postId } = match.params

  const { data: post } = useGetPostQuery(postId)
  const [updatePost, { isLoading }] = useEditPostMutation()

  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.content)

  const history = useHistory()

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value)

  const onSavePostClicked = async () => {
    if (title && content) {
      await updatePost({ id: postId, title, content }),
        history.push(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  )
}
