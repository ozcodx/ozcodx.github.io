import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Header.scss'

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  }

  return (
    <header className="header">
      <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/">HOME</Link>
        <Link to="/cv">CV</Link>
      </nav>
      <button 
        className="menu-toggle"
        onClick={handleMenuToggle}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  )
} 