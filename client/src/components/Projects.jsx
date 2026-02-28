import { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
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

  return (
    <section id="projects" className="projects" style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Projects</h2>

      {/* Error message */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

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
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;