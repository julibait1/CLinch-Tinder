
import { toast } from "@/components/ui/sonner";
import axios from "axios";

// Definición de tipos para nuestros modelos de datos
export interface Client {
  id: string;
  email: string;
  companyName: string;
  accountType: string;
  isActive: boolean;
}

export interface JobPosition {
  id: string;
  companyName: string;
  position: string;
  location: string;
  experienceLevel: string;
  mainSkills: string[];
  workMode: 'remote' | 'onsite' | 'hybrid';
  englishLevel: string;
  estimatedSalary: string;
  additionalComments: string;
  clientId: string;
}

export interface Candidate {
  id: string;
  name: string;
  photo?: string;
  currentRole: string;
  yearsOfExperience: number;
  mainSkills: string[];
  location: string;
  englishLevel: string;
  desiredSalary: string;
  cv?: string;
  applyingPositionId: string;
  status: string;
  feedbackClientId?: string;
  feedbackDate?: string;
}

// Configuración de la API de Airtable
const AIRTABLE_API_TOKEN = "pat1FmNBjEnLTxPPK.74c025f9b57da6e676d0c3a5d41799d7eb0a852077e39584a119a97d6bbab397";
const AIRTABLE_BASE_URL = "https://api.airtable.com/v0";

// IDs reales de la base de Airtable
const AIRTABLE_BASE_ID = "appk4D8VR2qbX7YkJ"; // ID de la base de Airtable
const CLIENTS_TABLE_ID = "tblxH3SZFvHimHjl6"; // ID de la tabla de clientes
const POSITIONS_TABLE_ID = "tblxIfCiFnLPpLMEz"; // ID de la tabla de posiciones
const CANDIDATES_TABLE_ID = "tblwWQbouPW9S4UzK"; // ID de la tabla de candidatos

// Configuración del cliente Axios para Airtable
const airtableClient = axios.create({
  baseURL: AIRTABLE_BASE_URL,
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
    "Content-Type": "application/json"
  }
});

// Datos de ejemplo como fallback en caso de error
// En una implementación real, estas serían llamadas a la API de Airtable

const mockClients: Client[] = [
  {
    id: "client1",
    email: "demo@clinch.com",
    companyName: "Empresa Demo",
    accountType: "Estándar",
    isActive: true
  }
];

const mockPositions: JobPosition[] = [
  {
    id: "pos1",
    companyName: "Empresa Demo",
    position: "Desarrollador Frontend",
    location: "Madrid, España",
    experienceLevel: "Mid-Senior",
    mainSkills: ["React", "JavaScript", "TypeScript"],
    workMode: "hybrid",
    englishLevel: "B2",
    estimatedSalary: "40.000-50.000€",
    additionalComments: "Buscamos alguien con experiencia en React Native",
    clientId: "client1"
  },
  {
    id: "pos2",
    companyName: "Empresa Demo",
    position: "Desarrollador Backend",
    location: "Barcelona, España",
    experienceLevel: "Senior",
    mainSkills: ["Node.js", "Python", "MongoDB"],
    workMode: "remote",
    englishLevel: "C1",
    estimatedSalary: "45.000-55.000€",
    additionalComments: "Experiencia con AWS necesaria",
    clientId: "client1"
  }
];

const mockCandidates: Candidate[] = [
  {
    id: "cand1",
    name: "Ana Martínez",
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
    currentRole: "Frontend Developer en Tech Co",
    yearsOfExperience: 4,
    mainSkills: ["React", "JavaScript", "CSS", "TypeScript"],
    location: "Madrid, España",
    englishLevel: "B2",
    desiredSalary: "45.000€",
    cv: "https://www.africau.edu/images/default/sample.pdf",
    applyingPositionId: "pos1",
    status: "Pending"
  },
  {
    id: "cand2",
    name: "Carlos Rodríguez",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    currentRole: "Full Stack Developer en DevShop",
    yearsOfExperience: 6,
    mainSkills: ["React", "Node.js", "MongoDB", "TypeScript"],
    location: "Remoto (Madrid)",
    englishLevel: "C1",
    desiredSalary: "52.000€",
    cv: "https://www.africau.edu/images/default/sample.pdf",
    applyingPositionId: "pos1",
    status: "Pending"
  },
  {
    id: "cand3",
    name: "Laura Fernández",
    photo: "https://randomuser.me/api/portraits/women/42.jpg",
    currentRole: "Backend Developer en DataSystems",
    yearsOfExperience: 5,
    mainSkills: ["Python", "Django", "PostgreSQL", "Docker"],
    location: "Barcelona, España",
    englishLevel: "B2",
    desiredSalary: "48.000€",
    cv: "https://www.africau.edu/images/default/sample.pdf",
    applyingPositionId: "pos2",
    status: "Pending"
  }
];

// Funciones de servicio de Airtable
export const airtableService = {
  // Autenticación
  async loginWithMagicLink(email: string): Promise<boolean> {
    try {
      console.log(`Intentando iniciar sesión con email: ${email}`);
      
      // Intentamos verificar si el cliente existe en Airtable
      const response = await airtableClient.get(
        `/${AIRTABLE_BASE_ID}/${CLIENTS_TABLE_ID}?filterByFormula={Email}="${email}"`
      );
      
      const records = response.data.records;
      console.log("Registros encontrados:", records);
      
      if (records && records.length > 0) {
        const client = this._parseClientRecord(records[0]);
        console.log("Cliente encontrado:", client);
        
        // Almacenamos el cliente independientemente de su estado
        localStorage.setItem("clientId", client.id);
        localStorage.setItem("clientEmail", client.email);
        localStorage.setItem("clientName", client.companyName);
        localStorage.setItem("clientActive", client.isActive.toString());
        
        // Verificamos si el cliente está activo
        if (!client.isActive) {
          console.log("La cuenta no está activa");
          toast.error("Tu cuenta no está activa. Contacta al soporte para activarla.");
          return false;
        }
        
        // Si está activo, procedemos con el inicio de sesión
        console.log("Inicio de sesión exitoso con cliente activo");
        toast.success("¡Inicio de sesión exitoso!");
        return true;
      } else {
        // Si no encontramos el cliente, buscamos en el fallback
        console.log("No se encontró ningún cliente con ese email en Airtable");
        const mockClient = mockClients.find(c => c.email === email);
        
        if (!mockClient) {
          console.log("No se encontró ningún cliente en modo fallback");
          toast.error("No se encontró ninguna cuenta con este email");
          return false;
        }
        
        // Modo fallback para demo
        console.log("Usando cliente de modo demo:", mockClient);
        localStorage.setItem("clientId", mockClient.id);
        localStorage.setItem("clientEmail", mockClient.email);
        localStorage.setItem("clientName", mockClient.companyName);
        localStorage.setItem("clientActive", mockClient.isActive.toString());
        
        toast.success("MODO DEMO: ¡Inicio de sesión exitoso!");
        return true;
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast.error("Error al conectar con Airtable. Usando modo demo.");
      
      // Fallback a modo demo
      const mockClient = mockClients.find(c => c.email === email);
      
      if (!mockClient) {
        toast.error("No se encontró ninguna cuenta con este email");
        return false;
      }
      
      localStorage.setItem("clientId", mockClient.id);
      localStorage.setItem("clientEmail", mockClient.email);
      localStorage.setItem("clientName", mockClient.companyName);
      localStorage.setItem("clientActive", mockClient.isActive.toString());
      return true;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const clientId = localStorage.getItem("clientId");
    const isActive = localStorage.getItem("clientActive") === "true";
    console.log("isAuthenticated check - clientId:", clientId, "isActive:", isActive);
    return !!clientId && isActive;
  },

  // Obtener el ID del cliente actual
  getCurrentClientId(): string | null {
    return localStorage.getItem("clientId");
  },

  // Obtener el email del cliente actual
  getCurrentClientEmail(): string | null {
    return localStorage.getItem("clientEmail");
  },

  // Obtener el nombre de la empresa del cliente actual
  getCurrentClientName(): string | null {
    return localStorage.getItem("clientName");
  },

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem("clientId");
    localStorage.removeItem("clientEmail");
    localStorage.removeItem("clientName");
    localStorage.removeItem("clientActive");
  },

  // Obtener posiciones de trabajo para el cliente actual
  async getClientPositions(): Promise<JobPosition[]> {
    try {
      const clientId = this.getCurrentClientId();
      if (!clientId) return [];
      
      console.log("Obteniendo posiciones para el cliente ID:", clientId);
      
      // Intentamos obtener las posiciones de Airtable usando el nombre de columna correcto
      const response = await airtableClient.get(
        `/${AIRTABLE_BASE_ID}/${POSITIONS_TABLE_ID}?filterByFormula={Clientes}="${clientId}"`
      );
      
      const records = response.data.records;
      console.log("Posiciones encontradas:", records);
      
      if (records && records.length > 0) {
        return records.map(this._parsePositionRecord);
      } else {
        // Fallback a datos de ejemplo
        console.log("No se encontraron posiciones en Airtable, usando datos de ejemplo");
        return mockPositions.filter(pos => pos.clientId === clientId);
      }
    } catch (error) {
      console.error("Error al obtener posiciones de Airtable:", error);
      toast.error("Error al conectar con Airtable. Usando datos de ejemplo.");
      
      // Fallback a datos de ejemplo
      const clientId = this.getCurrentClientId();
      return mockPositions.filter(pos => pos.clientId === clientId);
    }
  },

  // Obtener candidatos para una posición específica
  async getCandidatesForPosition(positionId: string): Promise<Candidate[]> {
    try {
      console.log("Obteniendo candidatos para la posición ID:", positionId);
      
      // Intentamos obtener los candidatos de Airtable usando el nombre de columna correcto
      const response = await airtableClient.get(
        `/${AIRTABLE_BASE_ID}/${CANDIDATES_TABLE_ID}?filterByFormula=AND({ID de la posición a la que aplica}="${positionId}",{Estado}="Pending")`
      );
      
      const records = response.data.records;
      console.log("Candidatos encontrados:", records);
      
      if (records && records.length > 0) {
        return records.map(this._parseCandidateRecord);
      } else {
        // Fallback a datos de ejemplo
        console.log("No se encontraron candidatos en Airtable, usando datos de ejemplo");
        return mockCandidates.filter(
          cand => cand.applyingPositionId === positionId && cand.status === "Pending"
        );
      }
    } catch (error) {
      console.error("Error al obtener candidatos de Airtable:", error);
      toast.error("Error al conectar con Airtable. Usando datos de ejemplo.");
      
      // Fallback a datos de ejemplo
      return mockCandidates.filter(
        cand => cand.applyingPositionId === positionId && cand.status === "Pending"
      );
    }
  },

  // Actualizar estado del candidato (Interesado o Rechazado)
  async updateCandidateStatus(candidateId: string, isInterested: boolean): Promise<boolean> {
    try {
      const clientId = this.getCurrentClientId();
      if (!clientId) return false;
      
      console.log("Actualizando estado del candidato ID:", candidateId, "isInterested:", isInterested);
      
      // Intentamos actualizar el estado del candidato en Airtable
      const newStatus = isInterested ? "Entrevista con cliente" : "Rechazado por cliente";
      const currentDate = new Date().toISOString();
      
      await airtableClient.patch(
        `/${AIRTABLE_BASE_ID}/${CANDIDATES_TABLE_ID}/${candidateId}`,
        {
          fields: {
            Estado: newStatus,
            "Cliente que dio feedback": [clientId],
            "Fecha de feedback": currentDate
          }
        }
      );
      
      console.log("Candidato actualizado exitosamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar candidato en Airtable:", error);
      toast.warning("Error al conectar con Airtable. Actualizando en modo local.");
      
      // Fallback a actualización local
      const candidateIndex = mockCandidates.findIndex(c => c.id === candidateId);
      if (candidateIndex === -1) return false;
      
      const clientId = this.getCurrentClientId();
      mockCandidates[candidateIndex] = {
        ...mockCandidates[candidateIndex],
        status: isInterested ? "Entrevista con cliente" : "Rechazado por cliente",
        feedbackClientId: clientId || "",
        feedbackDate: new Date().toISOString()
      };
      
      return true;
    }
  },

  // Métodos privados para parsear los registros de Airtable
  _parseClientRecord(record: any): Client {
    return {
      id: record.id,
      email: record.fields.Email || "",
      companyName: record.fields["Nombre de la empresa"] || "",
      accountType: record.fields["Tipo de cuenta"] || "",
      isActive: record.fields.Activo || false
    };
  },

  _parsePositionRecord(record: any): JobPosition {
    return {
      id: record.id,
      companyName: record.fields["Nombre de la empresa"] || "",
      position: record.fields.Posición || "",
      location: record.fields.Ubicación || "",
      experienceLevel: record.fields["Nivel de experiencia"] || "",
      mainSkills: record.fields["Habilidades principales"] ? 
        Array.isArray(record.fields["Habilidades principales"]) ? 
          record.fields["Habilidades principales"] : 
          record.fields["Habilidades principales"].split(",").map((s: string) => s.trim()) : [],
      workMode: (record.fields["Modalidad de trabajo"] as 'remote' | 'onsite' | 'hybrid') || 'remote',
      englishLevel: record.fields["Nivel de inglés"] || "",
      estimatedSalary: record.fields["Salario estimado"] || "",
      additionalComments: record.fields["Comentarios adicionales"] || "",
      clientId: record.fields.Clientes ? 
        Array.isArray(record.fields.Clientes) ? 
          record.fields.Clientes[0] || "" : 
          record.fields.Clientes : ""
    };
  },

  _parseCandidateRecord(record: any): Candidate {
    return {
      id: record.id,
      name: record.fields.Nombre || "",
      photo: record.fields.Foto && record.fields.Foto.length > 0 
        ? record.fields.Foto[0].url : undefined,
      currentRole: record.fields["Puesto actual"] || "",
      yearsOfExperience: Number(record.fields["Años de experiencia"]) || 0,
      mainSkills: record.fields["Habilidades principales"] ? 
        Array.isArray(record.fields["Habilidades principales"]) ? 
          record.fields["Habilidades principales"] : 
          record.fields["Habilidades principales"].split(",").map((s: string) => s.trim()) : [],
      location: record.fields.Ubicación || "",
      englishLevel: record.fields["Nivel de inglés"] || "",
      desiredSalary: record.fields["Salario deseado"] || "",
      cv: record.fields.CV && record.fields.CV.length > 0 
        ? record.fields.CV[0].url : undefined,
      applyingPositionId: record.fields["ID de la posición a la que aplica"] ? 
        Array.isArray(record.fields["ID de la posición a la que aplica"]) ? 
          record.fields["ID de la posición a la que aplica"][0] || "" : 
          record.fields["ID de la posición a la que aplica"] : "",
      status: record.fields.Estado || "Pending",
      feedbackClientId: record.fields["Cliente que dio feedback"] ? 
        Array.isArray(record.fields["Cliente que dio feedback"]) ? 
          record.fields["Cliente que dio feedback"][0] : 
          record.fields["Cliente que dio feedback"] : undefined,
      feedbackDate: record.fields["Fecha de feedback"]
    };
  }
};
