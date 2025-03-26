
import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  LineChart, 
  Activity 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");

  // Demo client data
  const clients = [
    {
      id: 1,
      name: "Ana Maria Silva",
      age: 32,
      goal: "Perda de peso",
      progress: 78,
      lastActive: "Hoje, 09:45",
      plan: "Personalizado",
      avatar: "https://i.pravatar.cc/150?img=5",
      status: "active"
    },
    {
      id: 2,
      name: "Ricardo Mendes",
      age: 45,
      goal: "Ganho muscular",
      progress: 45,
      lastActive: "Ontem, 18:30",
      plan: "Intermediário",
      avatar: "https://i.pravatar.cc/150?img=12",
      status: "active"
    },
    {
      id: 3,
      name: "Camila Oliveira",
      age: 28,
      goal: "Tonificação",
      progress: 92,
      lastActive: "Hoje, 11:15",
      plan: "Avançado",
      avatar: "https://i.pravatar.cc/150?img=9",
      status: "active"
    },
    {
      id: 4,
      name: "Fernando Alves",
      age: 52,
      goal: "Condicionamento",
      progress: 33,
      lastActive: "Há 3 dias",
      plan: "Básico",
      avatar: "https://i.pravatar.cc/150?img=67",
      status: "inactive"
    },
    {
      id: 5,
      name: "Luiza Costa",
      age: 37,
      goal: "Resistência",
      progress: 65,
      lastActive: "Hoje, 14:20",
      plan: "Intermediário",
      avatar: "https://i.pravatar.cc/150?img=32",
      status: "active"
    },
    {
      id: 6,
      name: "Marcos Santos",
      age: 41,
      goal: "Perda de peso",
      progress: 55,
      lastActive: "Ontem, 10:10",
      plan: "Personalizado",
      avatar: "https://i.pravatar.cc/150?img=53",
      status: "active"
    },
    {
      id: 7,
      name: "Patrícia Lima",
      age: 29,
      goal: "Ganho muscular",
      progress: 25,
      lastActive: "Há 5 dias",
      plan: "Básico",
      avatar: "https://i.pravatar.cc/150?img=23",
      status: "inactive"
    },
    {
      id: 8,
      name: "Carlos Eduardo",
      age: 33,
      goal: "Tonificação",
      progress: 82,
      lastActive: "Hoje, 08:05",
      plan: "Avançado",
      avatar: "https://i.pravatar.cc/150?img=63",
      status: "active"
    }
  ];

  // Filter and sort clients
  const filteredClients = clients.filter(client => {
    // Filter by search query
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesFilter = filterBy === "all" || client.status === filterBy;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Sort by selected criteria
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "progress") {
      return b.progress - a.progress;
    } else if (sortBy === "lastActive") {
      // Simple sort for demo purposes
      return a.lastActive.includes("Hoje") ? -1 : 1;
    }
    return 0;
  });

  // Stats data
  const stats = [
    {
      title: "Total de Clientes",
      value: clients.length,
      change: "+2",
      since: "último mês",
      icon: <Users className="h-5 w-5 text-vivafit-600" />
    },
    {
      title: "Progresso Médio",
      value: "63%",
      change: "+5%",
      since: "último mês",
      icon: <LineChart className="h-5 w-5 text-leaf-600" />
    },
    {
      title: "Taxa de Retenção",
      value: "88%",
      change: "+2%",
      since: "último mês",
      icon: <Activity className="h-5 w-5 text-purple-600" />
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Meus Clientes
            </motion.h1>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Gerencie e acompanhe o progresso dos seus clientes
            </motion.p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <div className="flex items-baseline mt-1">
                          <h3 className="text-2xl font-bold">{stat.value}</h3>
                          <span className="ml-2 text-xs font-medium text-green-600">
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          desde {stat.since}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-muted/50">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters & Search */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar clientes..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setFilterBy("all")}>
                        Todos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterBy("active")}>
                        Ativos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterBy("inactive")}>
                        Inativos
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        Ordenar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortBy("name")}>
                        Nome
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("progress")}>
                        Progresso
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("lastActive")}>
                        Último acesso
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Cliente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="hover-scale">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <img 
                        src={client.avatar} 
                        alt={client.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-vivafit-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{client.name}</h3>
                          <Badge variant={client.status === "active" ? "outline" : "secondary"} className="text-xs">
                            {client.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {client.age} anos | {client.goal}
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progresso</span>
                            <span className="font-medium">{client.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-vivafit-500 rounded-full"
                              style={{ width: `${client.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        <span>Último acesso: {client.lastActive}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/clients/${client.id}`}>
                          Detalhes
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Tente ajustar seus filtros ou adicione novos clientes
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

// Missing Users icon
const Users = Activity;

export default ClientsPage;
