
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { airtableService } from "@/services/airtableService";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Limpiar el localStorage al iniciar esta página
  React.useEffect(() => {
    airtableService.logout();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email || !email.includes('@')) {
      toast.error("Por favor, introduce un email válido");
      setErrorMessage("Por favor, introduce un email válido");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await airtableService.loginWithMagicLink(email);
      
      if (success) {
        if (localStorage.getItem("clientActive") === "false") {
          setErrorMessage("Tu cuenta no está activa. Contacta con soporte para activarla.");
        } else {
          navigate("/positions");
        }
      } else {
        const clientEmail = localStorage.getItem("clientEmail");
        if (clientEmail && localStorage.getItem("clientActive") === "false") {
          setErrorMessage("Tu cuenta no está activa. Contacta con soporte para activarla.");
        } else {
          setErrorMessage("No se encontró ninguna cuenta con este email o hubo un error en la autenticación.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error en el inicio de sesión. Inténtalo de nuevo.");
      setErrorMessage("Error en el inicio de sesión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@clinch.com");
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const success = await airtableService.loginWithMagicLink("demo@clinch.com");
      if (success) {
        navigate("/positions");
      }
    } catch (error) {
      console.error("Demo login error:", error);
      toast.error("Error en el inicio de sesión demo. Inténtalo de nuevo.");
      setErrorMessage("Error en el inicio de sesión demo. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Placeholder for Clinch logo */}
          <div className="bg-gradient-clinch text-white text-2xl font-bold py-2 px-4 rounded-lg inline-block mb-4">
            CLINCH
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido a Clinch</h1>
          <p className="text-gray-600 mt-2">Encuentra tus candidatos perfectos</p>
        </div>
        
        <Card className="shadow-lg border-0 card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Inicia sesión en tu cuenta</CardTitle>
            <CardDescription>
              Ingresa tu email para recibir un enlace mágico
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Dirección de email
                </label>
                <Input
                  id="email"
                  placeholder="tu@empresa.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-clinch"
              >
                {isLoading ? "Enviando..." : "Enviar enlace mágico"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center w-full">
              <Button 
                variant="ghost" 
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="text-sm text-gray-500 hover:text-primary"
              >
                Probar cuenta demo
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
