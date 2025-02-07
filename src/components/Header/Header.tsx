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

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Cierra el menú al seleccionar un enlace
  }

  return (
    <header className="header">
      <div className="header-title">
        <Link to="/">OzCodx</Link>
      </div>
      <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={handleLinkClick}>OZ</Link>
        <Link to="/cv" onClick={handleLinkClick}>CV</Link>
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