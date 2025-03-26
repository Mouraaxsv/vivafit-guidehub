
import { Link } from "react-router-dom";
import { Activity, Github, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="pt-12 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Activity className="h-6 w-6 text-vivafit-600" />
              <span className="text-xl font-bold text-gradient">VivaFit</span>
            </Link>
            <p className="text-muted-foreground">
              Transformando vidas através da saúde personalizada com a ajuda da inteligência artificial.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/plan" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  Planos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  Guias
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contato@vivafit.com" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  contato@vivafit.com
                </a>
              </li>
              <li>
                <a href="tel:+5511999999999" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  +55 (11) 99999-9999
                </a>
              </li>
              <li className="flex space-x-4 pt-2">
                <a href="#" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-vivafit-600 transition-colors">
                  <Github size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VivaFit. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
