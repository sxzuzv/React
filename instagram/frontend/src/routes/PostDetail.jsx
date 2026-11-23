import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { api } from '../api.js';
import PostCard from './PostCard.jsx';
import CommentItem from '../components/CommentItem.jsx';


function PostDetail() {
    const { id } = useParams();
    const [ post, setPost ] = useState(null);
    const [ comments, setComments ] = useState([]);

    useEffect(() => {
        async function load() {
            setPost(await api(`/api/posts/${id}`));
            setComments(await api(`/api/posts/${id}/comments`));
        }
        load();
    }, [id]);

    if (!post) return <p>게시글 불러오는 중 . .</p>

    return (
        <>
            <PostCard { ...post } />
            <ul className="list-group">
                { comments.map(c => <CommentItem key={ c.id } { ...c } />)}
            </ul>
        </>
    )
}

export default PostDetail;