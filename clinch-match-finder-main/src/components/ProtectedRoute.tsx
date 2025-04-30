
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { airtableService } from "@/services/airtableService";
import { toast } from "@/components/ui/sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = airtableService.isAuthenticated();
      console.log("Verificando autenticación:", isAuth);
      
      if (!isAuth) {
        const clientEmail = localStorage.getItem("clientEmail");
        const clientActive = localStorage.getItem("clientActive");
        
        if (clientEmail && clientActive === "false") {
          toast.error("Tu cuenta no está activa. Contacta al soporte para activarla.");
        } else {
          toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        
        navigate("/login");
        return false;
      }
      
      return true;
    };
    
    const authResult = checkAuth();
    setIsAuthorized(authResult);
  }, [navigate]);
  
  // Mostrar nada mientras verificamos la autenticación
  if (isAuthorized === null) {
    return null;
  }
  
  // Si está autorizado, mostrar los hijos
  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;
