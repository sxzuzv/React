import { Routes, Route } from 'react-router';

import Navbar from './components/NavBar.jsx';
import PostList from './routes/PostList.jsx';
import PostDetail from './routes/PostDetail.jsx';
import Login from './routes/Login.jsx';
import RequireLogin from './components/RequireLogin.jsx';
import Signup from './routes/Signup.jsx';
import NewPost from './routes/NewPost.jsx';
import Profile from './routes/Profile.jsx';


function App() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <Navbar />
          <main className="py-4">
            <Routes>
              <Route path="/" element={<PostList path="/api/posts" />} />
              <Route element={<RequireLogin />}>
                <Route path="/feed" element={<PostList path="/api/posts/feed" />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/new" element={<NewPost />} />
                <Route path="/users/:username" element={<Profile />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App;