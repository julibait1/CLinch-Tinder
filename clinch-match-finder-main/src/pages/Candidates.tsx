
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { airtableService, Candidate, JobPosition } from "@/services/airtableService";
import { toast } from "@/components/ui/sonner";
import { MapPin, Briefcase, Code, FileText, Globe, DollarSign, LogOut, ArrowLeft, X, Heart, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Candidates = () => {
  const [position, setPosition] = useState<JobPosition | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCV, setShowCV] = useState(false);
  const navigate = useNavigate();
  const { positionId } = useParams<{ positionId: string }>();

  // Verificar autenticación y obtener datos
  useEffect(() => {
    const fetchData = async () => {
      if (!airtableService.isAuthenticated()) {
        navigate("/login");
        return;
      }

      if (!positionId) {
        navigate("/positions");
        return;
      }

      try {
        // Obtener detalles de la posición
        const positions = await airtableService.getClientPositions();
        const matchedPosition = positions.find(p => p.id === positionId);
        
        if (!matchedPosition) {
          toast.error("Posición no encontrada");
          navigate("/positions");
          return;
        }
        
        setPosition(matchedPosition);
        
        // Obtener candidatos para esta posición
        const positionCandidates = await airtableService.getCandidatesForPosition(positionId);
        setCandidates(positionCandidates);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar candidatos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, positionId]);

  const handleLogout = () => {
    airtableService.logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/positions");
  };

  const handleInterested = async () => {
    if (candidates.length <= currentIndex) return;
    
    const candidate = candidates[currentIndex];
    
    try {
      await airtableService.updateCandidateStatus(candidate.id, true);
      toast.success("¡Candidato marcado como interesante!");
      
      // Pasar al siguiente candidato
      setCurrentIndex(prevIndex => prevIndex + 1);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Error al actualizar el estado del candidato");
    }
  };

  const handleReject = async () => {
    if (candidates.length <= currentIndex) return;
    
    const candidate = candidates[currentIndex];
    
    try {
      await airtableService.updateCandidateStatus(candidate.id, false);
      toast.success("Candidato rechazado");
      
      // Pasar al siguiente candidato
      setCurrentIndex(prevIndex => prevIndex + 1);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Error al actualizar el estado del candidato");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Cargando candidatos...</p>
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

      <main className="max-w-xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 -ml-2 text-gray-600 hover:text-primary"
        >
          <ArrowLeft size={18} className="mr-1" /> Volver a posiciones
        </Button>
        
        {position && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{position.position}</h1>
            <p className="text-gray-600">{position.companyName}</p>
          </div>
        )}

        {candidates.length === 0 ? (
          <Card className="text-center p-8 card-shadow border-0">
            <div className="text-gray-500 mb-4">
              <Briefcase size={48} className="mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-2">No hay candidatos disponibles</h3>
            <p className="text-gray-500 mb-6">
              Actualmente no hay candidatos para esta posición
            </p>
            <Button onClick={handleBack} variant="outline">
              Volver a Posiciones
            </Button>
          </Card>
        ) : currentIndex >= candidates.length ? (
          <Card className="text-center p-8 card-shadow border-0">
            <div className="text-gray-500 mb-4">
              <FileText size={48} className="mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-2">Todos los candidatos revisados</h3>
            <p className="text-gray-500 mb-6">
              Has revisado todos los candidatos para esta posición
            </p>
            <Button onClick={handleBack} variant="outline">
              Volver a Posiciones
            </Button>
          </Card>
        ) : (
          <div className="animate-fade-in">
            <Card className="overflow-hidden card-shadow border-0 mb-6 relative">
              {candidates[currentIndex].photo ? (
                <div className="w-full aspect-[4/5] relative">
                  <img
                    src={candidates[currentIndex].photo}
                    alt={candidates[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
                    <div className="p-4 text-white">
                      <h2 className="text-2xl font-bold text-white mb-1">{candidates[currentIndex].name}</h2>
                      <p className="text-lg text-white">{candidates[currentIndex].currentRole}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[4/5] bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                  <span className="text-white text-7xl font-bold">{candidates[currentIndex].name.charAt(0)}</span>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white mb-1">{candidates[currentIndex].name}</h2>
                    <p className="text-lg text-white">{candidates[currentIndex].currentRole}</p>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Briefcase size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>{candidates[currentIndex].yearsOfExperience} años exp.</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{candidates[currentIndex].location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>Inglés: {candidates[currentIndex].englishLevel}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <DollarSign size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{candidates[currentIndex].desiredSalary}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Code size={16} className="mr-2" />
                    Habilidades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidates[currentIndex].mainSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {candidates[currentIndex].cv && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full flex items-center justify-center bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        <Eye size={16} className="mr-2" />
                        Ver CV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-4xl h-[80vh] p-0">
                      <iframe
                        src={candidates[currentIndex].cv}
                        title="CV"
                        className="w-full h-full"
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </Card>

            <div className="flex gap-6 justify-center">
              <Button
                onClick={handleReject}
                className="rounded-full h-16 w-16 p-0 flex items-center justify-center bg-white border-2 border-red-500 text-red-500 hover:bg-red-50"
                variant="outline"
              >
                <X size={30} />
              </Button>
              <Button
                onClick={handleInterested}
                className="rounded-full h-16 w-16 p-0 flex items-center justify-center bg-white border-2 border-green-500 text-green-500 hover:bg-green-50"
                variant="outline"
              >
                <Heart size={30} />
              </Button>
            </div>
            
            <div className="mt-5 text-center text-gray-500 text-sm">
              Candidato {currentIndex + 1} de {candidates.length}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Candidates;
