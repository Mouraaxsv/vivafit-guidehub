
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-white to-vivafit-50">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-2xl font-bold mb-6"
          >
            <Activity className="h-6 w-6 text-vivafit-600" />
            <span className="text-gradient">VivaFit</span>
          </Link>
          
          <h1 className="text-9xl font-bold text-vivafit-600 mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! Página não encontrada
          </p>
          
          <Button asChild size="lg" className="rounded-full">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o início
            </Link>
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
