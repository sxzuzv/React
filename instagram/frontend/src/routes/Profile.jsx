import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";

import { api, SERVER_URL } from "../api.js";
import { useAuth } from "../hooks/useAuth.jsx";


function Profile() {
    const auth = useAuth();
    const { username } = useParams();
    const [ profile, setProfile ] = useState(null);
    const [ posts, setPosts ] = useState([]);
    const [ error, setError ] = useState('');
 
    useEffect(() => {
        async function load() {
            try {
                setProfile(await api(`/api/users/${username}`));
                setPosts(await api(`/api/users/${username}/posts`));
            } catch (e) {
                setError(e.message);
            } 
        }
        load();
    }, [username]);

    if (error) return <p>{ error }</p>
    if (!profile) return <p>로딩 중 . . .</p>

    const isMe = auth.user && auth.user.id == profile.id; // 본인 페이지를 보고 있는가?
    const followed = auth.user && profile.followers.some(f => f.from_user_id == auth.user.id); // 내가 팔로우 하고 있는가?

    async function handleFollow() {
        const updated = await auth.authApi(`/api/users/${username}/follow`, {
            method: followed ? 'DELETE' : 'POST'
        });

        setProfile(updated);
    }

    return (
        <>
        <div className="d-flex align-items-center gap-4 mb-4">
            <i className="bi bi-person-circle display-1"></i>
            <div>
                <div className="d-flex align-items-center gap-3 mb-2">
                    <h2 className="h4">{ profile.username }</h2>
                    { auth.user && !isMe && (
                        <button 
                            className={ followed ? 'btn btn-sm btn-outline-secondary' : 'btn btn-sm btn-outline-primary' } 
                            onClick={ handleFollow }
                        >
                            { followed ? 'Unfollow' : 'Follow' }
                        </button>
                    )}
                </div>

                <div className="d-flex gap-3">
                    <span>게시물 <b>{ posts.length }</b></span>
                    <span>팔로워 <b>{ profile.followers.length }</b></span>
                    <span>팔로잉 <b>{ profile.followings.length }</b></span>
                </div>
            </div>
        </div>
        <div className="row g-1">
            { posts.map(post => (
            <div key={post.id} className="col-4">
                <Link className="ratio ratio-1x1 d-block bg-white border" to={`/posts/${post.id}`}>
                {post.image_url ? (
                    <img src={`${SERVER_URL}${ post.image_url }`} alt={ post.content } className="object-fit-cover" />
                ) : (
                    <span className="d-flex align-items-center justify-content-center p-2 small text-secondary">{ post.content }</span>
                )}
                </Link>
            </div>
            ))}
        </div>
    </>
    )
}

export default Profile;