
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";
import { 
  Send, 
  Bot, 
  User,
  Info,
  CornerDownLeft,
  ChevronDown,
  Trash,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Message interface
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ConsultationPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá, sou o assistente de saúde VivaFit. Como posso ajudá-lo hoje? Você pode me perguntar sobre nutrição, treinos, condição física dos seus clientes ou qualquer dúvida relacionada à saúde.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Example predefined questions
  const sampleQuestions = [
    "Qual estratégia nutricional é mais eficaz para um cliente com diabetes tipo 2?",
    "Como posso adaptar um plano de treino para uma pessoa com problemas de joelho?",
    "Sugestões para melhorar a adesão dos clientes aos planos de exercícios",
    "Interpretação dos sinais de overtraining em atletas recreativos"
  ];

  // Send message handler
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "Para clientes com diabetes tipo 2, recomendo priorizar alimentos de baixo índice glicêmico e estabelecer horários regulares para as refeições. É importante também monitorar o consumo de carboidratos simples e aumentar a ingestão de proteínas magras e gorduras saudáveis.",
        "Ao adaptar exercícios para pessoas com problemas nos joelhos, priorize movimentos de baixo impacto como natação e ciclismo. Fortaleça os músculos ao redor da articulação (quadríceps, isquiotibiais) sem sobrecarregá-la. Sempre inicie com séries mais leves e aumente a intensidade progressivamente.",
        "Para aumentar a adesão aos planos de exercícios, estabeleça metas realistas e de curto prazo, crie um sistema de acompanhamento do progresso, utilize técnicas de gamificação, e mantenha comunicação frequente com feedback positivo.",
        "Os principais sinais de overtraining incluem: queda persistente no desempenho, fadiga crônica, alterações no sono, irritabilidade, perda de motivação, maior frequência de lesões e possíveis alterações na frequência cardíaca de repouso. Recomendo períodos adequados de recuperação e ajustes na periodização do treino."
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const botMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Olá, sou o assistente de saúde VivaFit. Como posso ajudá-lo hoje? Você pode me perguntar sobre nutrição, treinos, condição física dos seus clientes ou qualquer dúvida relacionada à saúde.",
        timestamp: new Date()
      }
    ]);
    toast.success("Histórico de conversa limpo");
  };

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
              Consultor de Saúde IA
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Tire suas dúvidas sobre saúde, nutrição e treinamento para melhor atender seus clientes
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main chat area */}
            <Card className="lg:col-span-2 flex flex-col h-[calc(100vh-220px)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-green-500 rounded-full"></span>
                    <CardTitle>Assistente VivaFit</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleClearChat}
                    title="Limpar conversa"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Suas perguntas permanecem privadas e este assistente foi treinado com conhecimentos de saúde e fitness
                </CardDescription>
                <Separator />
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto pb-3">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === "user" 
                            ? "flex-row-reverse" 
                            : "flex-row"
                        }`}
                      >
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div 
                          className={`p-3 rounded-lg ${
                            message.role === "user" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <span className="text-xs opacity-70 block mt-1">
                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="flex gap-1">
                            <span className="animate-bounce">●</span>
                            <span className="animate-bounce delay-75">●</span>
                            <span className="animate-bounce delay-150">●</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Invisible element for auto-scrolling */}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-3">
                <div className="flex w-full gap-2">
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-12 max-h-32"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={inputValue.trim() === "" || isTyping}
                    className="shrink-0"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Enviar
                  </Button>
                </div>
                <div className="w-full mt-2 text-xs text-muted-foreground flex items-center">
                  <CornerDownLeft className="h-3 w-3 mr-1" /> 
                  Pressione Enter para enviar, Shift+Enter para nova linha
                </div>
              </CardFooter>
            </Card>

            {/* Sidebar with tips and sample questions */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Informações e Sugestões
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Perguntas Sugeridas</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 mt-2">
                        {sampleQuestions.map((question, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            className="justify-start font-normal text-sm h-auto py-2 text-left"
                            onClick={() => {
                              setInputValue(question);
                            }}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>Tópicos Especializados</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Nutrição</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Exercícios</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Recuperação</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Avaliação Física</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Lesões</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Psicologia</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Idosos</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Gestantes</Badge>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Dicas de Uso</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <ChevronDown className="h-4 w-4 shrink-0" />
                      <span>Seja específico sobre o contexto do seu cliente</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronDown className="h-4 w-4 shrink-0" />
                      <span>Inclua detalhes relevantes como idade, condições de saúde</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronDown className="h-4 w-4 shrink-0" />
                      <span>Faça perguntas de acompanhamento para esclarecer dúvidas</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ConsultationPage;
