import { useState, useEffect } from 'react';

import PostCard from './PostCard.jsx';
import { useAuth } from '../hooks/useAuth.jsx';


function PostList({ path }) {
    const { authApi } = useAuth();
    const [ posts, setPosts ] = useState([]);
    const [ hasMore, setHasMore ] = useState(true);

    useEffect(() => {
        async function load() {
            const first = await authApi(path, {}); // 최초 게시글 10개
            setPosts(first);
            setHasMore(first.length === 10)
        }
        load();
    }, [path]);

    async function loadMore() {
        const next = await authApi(`${path}?skip=${posts.length}`);
        setPosts([...posts, ...next]);
        setHasMore(next.length === 10)
    }

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
            { hasMore && (
                <div className="text-center">
                    <button className="btn btn-outline-secondary" onClick={ loadMore }>더보기</button>
                </div>
            )}
        </>
    )
}

export default PostList;