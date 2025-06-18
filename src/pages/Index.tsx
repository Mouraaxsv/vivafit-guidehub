
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Users, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vivafit-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Activity className="h-16 w-16 text-vivafit-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transforme sua vida com <span className="text-gradient">VivaFit</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plataforma de saúde personalizada com inteligência artificial para transformar seu estilo de vida
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-vivafit-600 hover:bg-vivafit-700">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos Principais
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para alcançar seus objetivos de saúde e bem-estar
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-vivafit-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-vivafit-600" />
                </div>
                <CardTitle>Planos Personalizados</CardTitle>
                <CardDescription>
                  Planos de exercícios e nutrição criados especialmente para você
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-vivafit-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-vivafit-600" />
                </div>
                <CardTitle>Consultas Online</CardTitle>
                <CardDescription>
                  Agende consultas com profissionais de saúde qualificados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-vivafit-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-vivafit-600" />
                </div>
                <CardTitle>Acompanhamento</CardTitle>
                <CardDescription>
                  Monitore seu progresso e receba orientações personalizadas
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-vivafit-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-vivafit-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já transformaram suas vidas com o VivaFit
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Cadastre-se Grátis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
