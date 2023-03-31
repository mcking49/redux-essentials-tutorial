import { useState, type ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, type match } from 'react-router-dom'

import { useAppSelector } from '../../app/store'
import { postUpdated, selectPostById } from './posts-slice'

type Props = {
  match: match<{ postId: string }>
}

export const EditPostForm = ({ match }: Props) => {
  const { postId } = match.params

  const post = useAppSelector((state) => selectPostById(state, postId))

  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.content)

  const dispatch = useDispatch()
  const history = useHistory()

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value)

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(
        postUpdated({ id: postId, title, content, reactions: post!.reactions }),
      )
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
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  )
}
