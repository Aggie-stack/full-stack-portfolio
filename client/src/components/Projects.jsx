import { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch("https://bright-stack-portfolio.onrender.com/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `https://bright-stack-portfolio.onrender.com/projects/${editingId}`
        : "https://bright-stack-portfolio.onrender.com/projects";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to save project");

      fetchProjects();
      setFormData({ title: "", description: "", github: "" });
      setEditingId(null);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      github: project.github
    });
    setEditingId(project.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`https://bright-stack-portfolio.onrender.com/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section id="projects" className="projects" style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Projects</h2>

      {/* Error message */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Project Form */}
      <form
        onSubmit={handleSubmit}
        className="project-form"
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "500px",
          margin: "0 auto 2rem auto",
          gap: "0.5rem"
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <input
          type="text"
          name="github"
          placeholder="GitHub URL"
          value={formData.github}
          onChange={handleChange}
          required
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.6rem",
            fontSize: "1rem",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          {editingId ? "Update" : "Add"} Project
        </button>
      </form>

      {/* Project List */}
      <div
        className="project-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem"
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>{project.title}</h3>
            <p style={{ marginBottom: "0.5rem" }}>{project.description}</p>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4f46e5", textDecoration: "underline" }}
            >
              GitHub
            </a>
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleEdit(project)}
                style={{
                  padding: "0.3rem 0.6rem",
                  backgroundColor: "#facc15",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px"
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                style={{
                  padding: "0.3rem 0.6rem",
                  backgroundColor: "#ef4444",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  borderRadius: "4px"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;