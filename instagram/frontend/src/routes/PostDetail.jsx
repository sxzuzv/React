import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { api } from '../api.js';
import PostCard from './PostCard.jsx';


function PostDetail() {
    const { id } = useParams();
    const [ post, setPost ] = useState(null);

    useEffect(() => {
        async function load() {
            setPost(await api(`/api/posts/${id}`));
        }
        load();
    }, [id]);

    if (!post) return <p>게시글을 불러오는 중 . .</p>

    return <PostCard { ...post } />
}

export default PostDetail;