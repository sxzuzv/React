import { useState, useEffect } from 'react';

import { api } from '../api.js';
import PostCard from './PostCard.jsx';


function PostList() {
    const [ posts, setPosts ] = useState([]);

    useEffect(() => {
        async function load() {
            setPosts(await api('/api/posts'));
        }
        load();
    }, []);

    return (
        <>
            <h2>전체 게시글</h2>
            { posts.length === 0 && <p>불러오는 중 . .</p> }

            <div>
                { posts.map(post => (
                    <PostCard key={ post.id } { ...post } />
                ))}
            </div>
        </>
    )
}

export default PostList;