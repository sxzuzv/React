import PostList from "./routes/PostList.jsx";
import Navbar from "./components/NavBar.jsx";


function App() {
  return (
    <div className="container">
      <Navbar />
      <PostList />
    </div>
  )
}

export default App;