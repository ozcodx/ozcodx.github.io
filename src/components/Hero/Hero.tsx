import introImage from '../../assets/intro.jpeg'
import './Hero.scss'


export const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <img src={introImage} alt="Banner" loading="lazy" />
      </div>
      <div className="hero-content">
        <h1>SOFTWARE<br />ENGINEER & TECH<br />GEEK</h1>
        <p>
          I'm a passionate system engineer with over a decade of experience in backend development, 
          Python, Node.js, and open-source technologies. I love building efficient systems, exploring
          AI, and sharing my knowledge through projects and writing.
        </p>
        <button className="cta-button" onClick={() => window.location.href = '/cv'}>
          CHECK MY CV
        </button>
      </div>
    </section>
  )
} 