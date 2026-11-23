import { useState, useEffect } from 'react';

import { api, SERVER_URL } from '../api.js';


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
                    <article key={ post.id }>
                        <h3>{ post.user.username }</h3>
                        <p>{ post.content }</p>
                        <p>좋아요 { post.likes.length }개</p>
                        <p>작성일시 { new Date(post.created_at).toLocaleString('ko-KR') }</p>
                        <img src={ `${ SERVER_URL }${ post.image_url }`} alt="" />
                    </article>
                ))}
            </div>
        </>
    )
}

export default PostList;