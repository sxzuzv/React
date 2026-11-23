function CommentItem({ user, content }) {
    return (
        <li className="list-group-item">
            <b>{ user.username }</b> { content }
        </li>
    )
}

export default CommentItem;