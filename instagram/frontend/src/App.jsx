import { Routes, Route } from 'react-router';

import Navbar from './components/NavBar.jsx';
import PostList from './routes/PostList.jsx';
import PostDetail from './routes/PostDetail.jsx';
import Login from './routes/Login.jsx';


function App() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <Navbar />
          <main className="py-4">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App;