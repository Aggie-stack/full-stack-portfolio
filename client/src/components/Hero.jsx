import { FaGithub, FaLinkedin } from "react-icons/fa";

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-left">
        <img src="/hero-image.jpg" alt="Agatha working on laptop" />
      </div>

      <div className="hero-right">
        <div className="hero-content">
          <h1>Hi, I'm Agatha.</h1>
          <h2>Full-Stack Developer | ICT Specialist</h2>
          <p>
            I build responsive, scalable web applications that solve real-world
            problems.
          </p>

          <a href="projects" className="btn-primary">
            View My Work
          </a>
          

          <div className="hero-socials">
            <a
              href="https://github.com/Aggie-stack"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/agatha-rukwaro-55422b380/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;