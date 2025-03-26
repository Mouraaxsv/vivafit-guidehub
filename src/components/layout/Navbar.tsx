
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = user ? (
    user.role === 'professional' ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/clients', label: 'Meus Clientes' },
    ] : [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/plan', label: 'Meu Plano' },
    ]
  ) : [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Cadastro' },
  ];

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-2xl font-bold"
        >
          <Activity className="h-6 w-6 text-vivafit-600" />
          <span className="text-gradient">VivaFit</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-medium transition-all hover:text-vivafit-600 ${
                location.pathname === link.href ? 'text-vivafit-600' : 'text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user && (
            <Button 
              variant="ghost" 
              onClick={logout}
              className="hover:text-vivafit-600"
            >
              Sair
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  location.pathname === link.href 
                    ? 'bg-vivafit-100 text-vivafit-600' 
                    : 'hover:bg-vivafit-50 text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user && (
              <Button 
                variant="ghost" 
                onClick={logout}
                className="justify-start px-4 hover:bg-vivafit-50 hover:text-vivafit-600"
              >
                Sair
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
