function Hero() {
  return (
    <section id="home" className="hero">
      <h1>Hi, I'm Agatha</h1>
      <p>Junior Full-stack developer  with strong ICT background.</p>
      <p><i>"Turning ideas into code"</i></p>
      
      {/* Image from public folder */}
      <img 
        src="/images/Hero.jpg" 
        alt="Hero" 
        className="hero-image" 
        style={{ marginTop: '20px', maxWidth: '100%', height: 'auto' }}
      />
    </section>
  );
}

export default Hero;
