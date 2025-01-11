import SoilMoisture from "@/components/SoilMoisture";
import WeatherForecast from "@/components/WeatherForecast";
import { Button } from "@/components/ui/button";
import { FileContext } from "@/filecontext";
import { useToast } from "@/hooks/use-toast";
import { Power, RefreshCw } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const pollingRef = useRef(null);
  const { toast } = useToast();
  const { plant, setPlant, getSoilMoisture, toggleLight, isLightOn } =
    useContext(FileContext); // Consume data and actions from FileContext

  useEffect(() => {
    // Fetch plant data on component mount
    if (!plant) {
      toast({
        title: "Loading Plant Data",
        description: "Fetching data from FileContext...",
      });
    }
  }, [plant, toast]);

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Image */}
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src="/2.jpg"
            alt="Garden"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <h1 className="absolute bottom-4 left-4 text-white text-2xl font-bold">
            My Smart Garden
          </h1>
        </div>

        {/* Weather Forecast */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4">72-Hour Forecast</h2>
          <WeatherForecast />
        </div>

        {/* Soil Moisture */}
        {plant ? (
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-4">
                Current Soil Moisture
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className={`h-12 w-12 text-gray-400`}
                onClick={getSoilMoisture}
              >
                <RefreshCw className={`h-6 w-6`} />
              </Button>
            </div>
            <SoilMoisture value={plant.soilMoisture} />
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading plant data...</div>
        )}

        {/* Smart Light Toggle */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Smart Light System</h2>
            <Button
              variant="ghost"
              size="icon"
              className={`h-12 w-12 ${
                isLightOn ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={toggleLight}
            >
              <Power
                className={`h-6 w-6 ${isLightOn ? "animate-pulse" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Navigation Button */}
        <Button
          className="w-full bg-primary hover:bg-primary-dark text-white"
          onClick={() => navigate("/plant-settings")}
        >
          Your Garden &gt;
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
