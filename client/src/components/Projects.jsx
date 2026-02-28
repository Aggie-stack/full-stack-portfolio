import { useEffect, useState } from "react";
import "../styles.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://bright-stack-portfolio.onrender.com/projects"
      );

      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

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

  return (
    <section id="projects" className="projects-section">
      <h2 className="projects-title">Projects</h2>

      {loading && <p className="projects-loading">Loading projects...</p>}
      {error && <p className="projects-error">{error}</p>}

      <div className="project-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3 className="project-title">{project.title}</h3>

            <p className="project-description">
              {project.description}
            </p>

            <div className="project-buttons">
              {/* GitHub Button */}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link github-btn"
              >
                GitHub
              </a>

              {/* Demo Button (only if demo exists) */}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link demo-btn"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;