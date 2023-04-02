import { useAddReactionMutation } from '../api/api-slice'
import { reactionEmoji, type Post } from './posts-slice'

type Props = {
  post: Post
}

export const ReactionButtons = ({ post }: Props) => {
  const [addReaction] = useAddReactionMutation()

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    const typedName = name as keyof typeof reactionEmoji

    return (
      <button
        key={typedName}
        type="button"
        className="muted-button reaction-button"
        onClick={() =>
          void addReaction({ postId: post.id, reaction: typedName })
        }
      >
        {emoji} {post.reactions[typedName]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
