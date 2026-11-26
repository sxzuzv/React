import { useState, useEffect, useRef } from 'react';

import PostCard from './PostCard.jsx';
import { useAuth } from '../hooks/useAuth.jsx';


function PostList({ path }) {
    const { authApi } = useAuth();
    const [ posts, setPosts ] = useState([]);
    const [ hasMore, setHasMore ] = useState(true);
    const bottom = useRef(null);

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
        setHasMore(next.length === 10);
    }

    useEffect(() => {
        if (posts.length === 0) return; // 첫 로드는 위의 useEffect가 담당

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMore();
        });

        if (bottom.current) observer.observe(bottom.current);

        return () => observer.disconnect();

    }, [posts]);

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
                    <PostCard 
                        key={ post.id } { ...post } 
                        visible={ false }
                        onUpdate={ handleUpdate }
                    />
                ))}
            </div>
            { hasMore && (
                <div className="text-center">
                    <p ref={ bottom }>불러오는 중 . . .</p>
                </div>
            )}
        </>
    )
}

export default PostList;