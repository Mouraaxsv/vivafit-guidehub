
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const clientUsers = [
  {
    id: 1,
    name: "Ana Maria Silva",
    progress: 78,
    lastActive: "Hoje, 09:45",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 2,
    name: "Ricardo Mendes",
    progress: 45,
    lastActive: "Ontem, 18:30",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 3,
    name: "Camila Oliveira",
    progress: 92,
    lastActive: "Hoje, 11:15",
    avatar: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: 4,
    name: "Fernando Alves",
    progress: 33,
    lastActive: "Há 3 dias",
    avatar: "https://i.pravatar.cc/150?img=67"
  }
];

export const ClientActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Recentes</CardTitle>
        <CardDescription>Atividade recente dos seus clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clientUsers.slice(0, 3).map((client) => (
            <div key={client.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <img 
                  src={client.avatar} 
                  alt={client.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{client.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Último acesso: {client.lastActive}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-medium">{client.progress}%</span>
                  <div className="w-16 h-1.5 bg-muted rounded-full mt-1">
                    <div 
                      className="h-full bg-vivafit-500 rounded-full"
                      style={{ width: `${client.progress}%` }}
                    ></div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/clients/${client.id}`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/clients">
              Ver todos os clientes
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
