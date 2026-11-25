import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { useAuth } from '../hooks/useAuth.jsx';
import PostCard from './PostCard.jsx';
import CommentItem from '../components/CommentItem.jsx';
import CommentForm from '../components/CommentForm.jsx';


function PostDetail() {
    const { id } = useParams();
    const { authApi } = useAuth();
    const [ post, setPost ] = useState(null);
    const [ comments, setComments ] = useState([]);
    const [ error, setError ] = useState('');

    useEffect(() => {
        async function load() {
            try {
                setPost(await authApi(`/api/posts/${id}`));
                setComments(await authApi(`/api/posts/${id}/comments`));
            } catch (e) {
                setError(e.message);
            }
        }
        load();
    }, [id]);

    function handleCreate(created) {
        setComments([...comments, created]);
    }

    function handleDelete(commentId) {
        setComments(comments.filter(c => c.id !== commentId));
    }

    function handleUpdate(updated) {
        setComments(comments.map(c => {
            if (c.id === updated.id) {
                return updated;
            }
            
            return c;
        }));
    }

    if (error) return <p className="text-danger">{ error }</p>;
    if (!post) return <p>게시글 불러오는 중 . .</p>;

    return (
        <>
            <PostCard { ...post } onUpdate={ setPost } />
            <ul className="list-group">
                { comments.map(c => 
                    <CommentItem key={ c.id } { ...c } onDelete={ handleDelete } onUpdate={ handleUpdate } />
                )}
            </ul>
            <CommentForm postId={ id } onCreate={ handleCreate } />
        </>
    );
}

export default PostDetail;