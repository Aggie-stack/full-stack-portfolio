import { useEffect, useState } from "react";
import "../styles.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");
  const [liveDemo, setLiveDemo] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const API_URL = "https://full-stack-backend-7lmv.onrender.com";

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/projects`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Add / Edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !github) {
      setError("Title, Description, and GitHub are required");
      return;
    }

    setAdding(true);
    setError("");

    const projectData = { title, description, github, liveDemo };

    try {
      let res;
      let updatedProject;

      if (editingProject) {
        res = await fetch(`${API_URL}/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });

        if (!res.ok) throw new Error("Failed to update project");

        updatedProject = await res.json();

        setProjects(
          projects.map((p) =>
            p.id === updatedProject.id ? updatedProject : p
          )
        );

        setEditingProject(null);
      } else {
        res = await fetch(`${API_URL}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });

        if (!res.ok) throw new Error("Failed to add project");

        updatedProject = await res.json();
        setProjects([...projects, updatedProject]);
      }

      // Reset form
      setTitle("");
      setDescription("");
      setGithub("");
      setLiveDemo("");
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete project");

      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setGithub(project.github);
    setLiveDemo(project.liveDemo || "");
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setGithub("");
    setLiveDemo("");
  };

  return (
    <section id="projects" className="projects">
      
      {/* Header Button (Like Screenshot) */}
      <div className="projects-header">
        <div className="projects-title-btn">
          {editingProject ? "Edit Project" : "Add Project"}
        </div>
      </div>

      {loading && <p className="projects-loading">Loading projects...</p>}
      {error && <p className="projects-error">{error}</p>}

      {/* Inline Form */}
      <form className="project-inline-form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="url"
          placeholder="GitHub link"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          required
        />

        <input
          type="url"
          placeholder="Live Demo link"
          value={liveDemo}
          onChange={(e) => setLiveDemo(e.target.value)}
        />

        <button type="submit" className="add-btn" disabled={adding}>
          {adding
            ? editingProject
              ? "Updating..."
              : "Adding..."
            : editingProject
            ? "Update"
            : "Add"}
        </button>

        {editingProject && (
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Projects Grid */}
      <div className="project-grid">
        {projects.length === 0 && !loading && (
          <p className="projects-empty">No projects added yet.</p>
        )}

        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <div className="project-footer">
              <div className="project-links">
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                GitHub 
              </a>
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                </a>
              )}
            </div>

            <div className="project-actions">
              <button onClick={() => handleEditProject(project)}>
                Edit
              </button>
              <button onClick={() => handleDeleteProject(project.id)}>
                Delete
              </button>
            </div>
          </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;