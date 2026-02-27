import { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github: ""
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProjects = () => {
    fetch("http://127.0.0.1:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update project
      fetch(`http://127.0.0.1:5000/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }).then(() => {
        fetchProjects();
        setFormData({ title: "", description: "", github: "" });
        setEditingId(null);
      });
    } else {
      // Add new project
      fetch("http://127.0.0.1:5000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }).then(() => {
        fetchProjects();
        setFormData({ title: "", description: "", github: "" });
      });
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

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:5000/projects/${id}`, { method: "DELETE" })
      .then(() => fetchProjects());
  };

  return (
    <section id="projects" className="projects">
      <h2>Projects</h2>

      {/* Project Form */}
      <form onSubmit={handleSubmit} className="project-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="github"
          placeholder="GitHub URL"
          value={formData.github}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"} Project</button>
      </form>

      {/* Project List */}
      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <a href={project.github} target="_blank">GitHub</a>
          <div className="project-actions">
            <button onClick={() => handleEdit(project)}>Edit</button>
            <button onClick={() => handleDelete(project.id)}>Delete</button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Projects;
