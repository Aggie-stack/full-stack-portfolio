

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
            <a href="https://github.com/yourusername" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;