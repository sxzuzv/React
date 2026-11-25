import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { api } from '../api.js';
import PostCard from './PostCard.jsx';
import CommentItem from '../components/CommentItem.jsx';


function PostDetail() {
    const { id } = useParams();
    const [ post, setPost ] = useState(null);
    const [ comments, setComments ] = useState([]);
    const [ error, setError ] = useState('');

    useEffect(() => {
        async function load() {
            try {
                setPost(await api(`/api/posts/${id}`));
                setComments(await api(`/api/posts/${id}/comments`));
            } catch (e) {
                setError(e.message);
            }
        }
        load();
    }, [id]);

    if (error) return <p className="text-danger">{ error }</p>;
    if (!post) return <p>게시글 불러오는 중 . .</p>;

    return (
        <>
            <PostCard { ...post } onUpdate={ setPost } />
            <ul className="list-group">
                { comments.map(c => <CommentItem key={ c.id } { ...c } />)}
            </ul>
        </>
    );
}

export default PostDetail;