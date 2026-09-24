import { useState, useEffect } from "react";
import {
  getPostsService,
  createPostService,
  updatePostService,
  deletePostService,
} from "../../utils/services/posts.services";
import { getUsersService } from "../../utils/services/users.services";
import "./ApiDemo.css";

export default function ApiDemo() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [feedback, setFeedback] = useState(null);
  const [editId, setEditId] = useState(null);

  // GET posts on mount
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    const data = await getPostsService(5);
    if (data) setPosts(data);
    else setError("Failed to fetch posts");
    setLoading(false);
  };

  // GET users
  const loadUsers = async () => {
    const data = await getUsersService();
    if (data) setUsers(data.slice(0, 4));
  };

  useEffect(() => {
    loadPosts();
    loadUsers();
  }, []);

  // POST — create
  const handleCreate = async (e) => {
    e.preventDefault();
    const data = await createPostService(newPost.title, newPost.body);
    if (data) {
      setFeedback({ type: "success", msg: `✅ Created! ID: ${data.id} — "${data.title}"` });
      setNewPost({ title: "", body: "" });
    }
  };

  // PUT — update
  const handleUpdate = async (id) => {
    const data = await updatePostService(id, "Updated Title", "Updated body content");
    if (data) setFeedback({ type: "success", msg: `✅ Updated post #${data.id}` });
    setEditId(null);
  };

  // DELETE
  const handleDelete = async (id) => {
    await deletePostService(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setFeedback({ type: "success", msg: `✅ Deleted post #${id}` });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">🌐 API Integration</h2>
      <p className="page-desc">
        Service layer pattern: <code>posts.services.js</code> and <code>users.services.js</code> handle all API calls.
        Components only call service functions — never <code>axiosClient</code> directly.
      </p>

      {/* Pattern explanation box */}
      <div className="pattern-box">
        <strong>Pattern:</strong>
        <code>Component → service function → axiosClient → API</code>
      </div>

      {/* GET Posts */}
      <div className="section">
        <div className="section-header">
          <h3>GET /posts — <code>getPostsService()</code></h3>
          <button className="btn-primary" onClick={loadPosts} disabled={loading}>
            {loading ? "Loading..." : "Refetch"}
          </button>
        </div>
        {error && <div className="error-box">❌ {error}</div>}
        <div className="list">
          {posts.map((post) => (
            <div key={post.id} className="list-item">
              <span className="badge">#{post.id}</span>
              <div style={{ flex: 1 }}>
                <strong>{post.title}</strong>
                <p>{post.body.slice(0, 70)}...</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn-sm" onClick={() => setEditId(post.id)}>Edit</button>
                <button className="btn-sm danger" onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        {editId && (
          <div className="info-box" style={{ marginTop: 12 }}>
            Updating post #{editId}...{" "}
            <button className="btn-primary" style={{ padding: "4px 12px", fontSize: 12 }} onClick={() => handleUpdate(editId)}>
              Confirm Update
            </button>
            <button className="btn-sm" style={{ marginLeft: 8 }} onClick={() => setEditId(null)}>Cancel</button>
          </div>
        )}
      </div>

      {/* POST — Create */}
      <div className="section">
        <h3>POST /posts — <code>createPostService()</code></h3>
        <form onSubmit={handleCreate} className="form">
          <input
            className="input"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
          <textarea
            className="input"
            placeholder="Post body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            required
          />
          <button className="btn-primary" type="submit">Create Post</button>
        </form>
        {feedback && <div className={feedback.type === "success" ? "success-box" : "error-box"} style={{ marginTop: 12 }}>{feedback.msg}</div>}
      </div>

      {/* GET Users */}
      <div className="section">
        <h3>GET /users — <code>getUsersService()</code></h3>
        <div className="list">
          {users.map((user) => (
            <div key={user.id} className="list-item">
              <span className="badge">#{user.id}</span>
              <div>
                <strong>{user.name}</strong>
                <p>{user.email} · {user.company?.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
