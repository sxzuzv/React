import { useState, useEffect } from 'react';

import PostCard from './PostCard.jsx';
import { useAuth } from '../hooks/useAuth.jsx';


function PostList({ path }) {
    const { authApi } = useAuth();
    const [ posts, setPosts ] = useState([]);

    useEffect(() => {
        async function load() {
            setPosts(await authApi(path, {}));
        }
        load();
    }, [path]);

    function handleUpdate(updated) {
        const newPosts = posts.map((post) => {
            if (post.id === updated.id) {
                return updated;
            }
            return post;
        });

        setPosts(newPosts);
    }

    return (
        <>
            <h2>전체 게시글</h2>
            { posts.length === 0 && <p>불러오는 중 . .</p> }

            <div>
                { posts.map(post => (
                    <PostCard key={ post.id } { ...post } onUpdate={ handleUpdate } />
                ))}
            </div>
        </>
    )
}

export default PostList;