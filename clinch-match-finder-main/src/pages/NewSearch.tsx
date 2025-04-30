
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { airtableService } from "@/services/airtableService";
import { LogOut, ArrowLeft } from "lucide-react";

const NewSearch = () => {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!airtableService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    airtableService.logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/positions");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-clinch text-white text-xl font-bold py-1 px-3 rounded-lg">
              CLINCH
            </div>
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

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 -ml-2 text-gray-600 hover:text-primary"
        >
          <ArrowLeft size={18} className="mr-1" /> Back to positions
        </Button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Job Search</h1>
          <p className="text-gray-600">Fill out the form below to create a new job search</p>
        </div>

        <div className="bg-white rounded-lg card-shadow border-0 p-2">
          {/* Embed Airtable form */}
          <div className="aspect-auto min-h-[600px]">
            <p className="text-center p-4 text-gray-500">
              This is where the Airtable form would be embedded as an iframe.
              <br /><br />
              In a production environment, you would replace this with:
              <br /><br />
              &lt;iframe src="YOUR_AIRTABLE_FORM_URL" width="100%" height="100%" frameBorder="0"&gt;&lt;/iframe&gt;
            </p>
            
            {/* For demonstration purposes, let's add a fake form */}
            <div className="p-4 max-w-xl mx-auto border rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Geographic Location
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Madrid, Spain"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select experience level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Skills
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., React, JavaScript, TypeScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Mode
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select work mode</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    English Level
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select English level</option>
                    <option value="A1">A1 - Beginner</option>
                    <option value="A2">A2 - Elementary</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Upper Intermediate</option>
                    <option value="C1">C1 - Advanced</option>
                    <option value="C2">C2 - Proficient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Salary
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., €40,000 - €50,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Comments
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Any special requirements or information"
                  ></textarea>
                </div>
                <div className="pt-4">
                  <Button 
                    className="w-full btn-clinch"
                    onClick={() => {
                      // In a real app, this would submit the form
                      // For demo purposes, we'll just go back to positions
                      navigate("/positions");
                    }}
                  >
                    Submit Job Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewSearch;
