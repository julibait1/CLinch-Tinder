
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { airtableService, JobPosition } from "@/services/airtableService";
import { Briefcase, MapPin, Code, Globe, DollarSign, LogOut, Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Positions = () => {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticación y obtener posiciones
  useEffect(() => {
    const checkAuth = async () => {
      if (!airtableService.isAuthenticated()) {
        navigate("/login");
        return;
      }

      try {
        const clientPositions = await airtableService.getClientPositions();
        setPositions(clientPositions);
      } catch (error) {
        console.error("Error al cargar posiciones:", error);
        toast.error("Error al cargar las posiciones");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    airtableService.logout();
    navigate("/login");
  };

  const handleViewCandidates = (positionId: string) => {
    navigate(`/candidates/${positionId}`);
  };

  const handleNewSearch = () => {
    navigate("/new-search");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Cargando tus posiciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/382ad031-1370-49e0-9ee8-88fae3f3abb0.png" 
              alt="Logo Clinch" 
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-3">
              {airtableService.getCurrentClientEmail()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-600 hover:text-primary"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tus Búsquedas Activas</h1>
          <Button onClick={handleNewSearch} className="btn-clinch">
            <Plus size={18} className="mr-1" /> Nueva Búsqueda
          </Button>
        </div>

        {positions.length === 0 ? (
          <Card className="text-center p-8 card-shadow border-0">
            <CardContent className="pt-6">
              <div className="text-gray-500 mb-4">
                <Briefcase size={48} className="mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hay búsquedas activas</h3>
              <p className="text-gray-500 mb-6">
                Empieza creando tu primera búsqueda para encontrar candidatos
              </p>
              <Button onClick={handleNewSearch} className="btn-clinch">
                <Plus size={18} className="mr-1" /> Crear Búsqueda
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {positions.map((position) => (
              <Card 
                key={position.id} 
                className="overflow-hidden card-shadow border-0 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-2">
                  <CardTitle className="text-xl">{position.position}</CardTitle>
                  <CardDescription>{position.companyName}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm">{position.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm">{position.estimatedSalary}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Code size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm">{position.mainSkills.join(", ")}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm capitalize">
                        {position.workMode === 'remote' ? 'Remoto' : 
                         position.workMode === 'onsite' ? 'Presencial' : 'Híbrido'}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 flex justify-between gap-4 pt-4">
                  <Button 
                    onClick={() => handleViewCandidates(position.id)}
                    className="btn-clinch w-full"
                  >
                    Ver Candidatos
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Positions;
