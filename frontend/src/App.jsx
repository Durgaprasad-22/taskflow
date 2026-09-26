import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function fetchTasks() {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/tasks/`);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Unable to load your tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function createTask(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch(`${API_URL}/api/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Server returned ${response.status}`);
      }

      const newTask = await response.json();

      setTasks((currentTasks) => [...currentTasks, newTask]);

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create task:", error);
      setError("Unable to create the task. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">✓</div>

          <div>
            <h1>TaskFlow</h1>
            <span>Organize. Focus. Finish.</span>
          </div>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          All systems operational
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h2>Good to see you.</h2>
            <p className="hero-description">
              Keep your work organized and turn your plans into progress.
            </p>
          </div>

          <div className="task-summary">
            <div className="summary-number">{tasks.length}</div>
            <div>
              <strong>Total tasks</strong>
              <span>in your workspace</span>
            </div>
          </div>
        </section>

        {error && (
          <div className="error-banner">
            <span>⚠</span>
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>

            <button onClick={fetchTasks}>Retry</button>
          </div>
        )}

        <section className="create-card">
          <div className="card-heading">
            <div className="card-icon">＋</div>

            <div>
              <h3>Create a new task</h3>
              <p>Add something you want to get done.</p>
            </div>
          </div>

          <form onSubmit={createTask}>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="title">Task title</label>

                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Finish project documentation"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={creating}
                />
              </div>

              <div className="input-group">
                <label htmlFor="description">Description</label>

                <input
                  id="description"
                  type="text"
                  placeholder="Add some details..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={creating}
                />
              </div>

              <button
                className="add-button"
                type="submit"
                disabled={creating || !title.trim()}
              >
                {creating ? "Adding..." : "Add task"}
              </button>
            </div>
          </form>
        </section>

        <section className="tasks-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">TASKS</p>
              <h3>Your tasks</h3>
            </div>

            <div className="task-stats">
              <span>{pendingTasks} pending</span>
              <span>{completedTasks} completed</span>
            </div>
          </div>

          {loading ? (
            <div className="empty-card">
              <div className="spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-card">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>
                Your workspace is clear. Create your first task above.
              </p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article
                  className={`task-card ${task.completed ? "completed" : ""}`}
                  key={task.id}
                >
                  <button
                    className="check-button"
                    type="button"
                    aria-label={
                      task.completed
                        ? "Mark task as incomplete"
                        : "Mark task as complete"
                    }
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-content">
                    <h4>{task.title}</h4>

                    {task.description && (
                      <p>{task.description}</p>
                    )}

                    <div className="task-meta">
                      <span>
                        {task.completed ? "Completed" : "In progress"}
                      </span>

                      {task.created_at && (
                        <span>
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className="more-button"
                    type="button"
                    aria-label="Task options"
                  >
                    ⋮
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>TaskFlow</span>
        <span>Built with React + FastAPI + PostgreSQL</span>
      </footer>
    </div>
  );
}

export default App;