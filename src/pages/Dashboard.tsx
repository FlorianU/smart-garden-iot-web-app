import SoilMoisture from "@/components/SoilMoisture";
import { Button } from "@/components/ui/button";
import WeatherForecast from "@/components/WeatherForecast";
import { useToast } from "@/hooks/use-toast";
import { Power, RefreshCw } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const DEVICE = 1;
const ACCOUNT = 1;
const SERVERADD = "192.168.252.110";

type Plant = {
  id: number;
  name: string;
  soilMoisture: number;
  requiredSoilMoisture: number;
  lastWatered: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const pollingRef = useRef(null);
  const { toast } = useToast();
  const [isLightOn, setIsLightOn] = React.useState(false);
  const [plant, setPlant] = React.useState<Plant | null>(null);
  const [soilMoisture, setSoilMoisture] = React.useState(-1);

  const toggleLight = async () => {
    const newState = !isLightOn;
    try {
      const response = await fetch(
        `http://${SERVERADD}:3000/mqtt/${ACCOUNT}/${DEVICE}/setLighting`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: newState ? "on" : "off" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle light");
      }

      setIsLightOn(newState);
      toast({
        title: newState ? "Smart Light turned on" : "Smart Light turned off",
        description: `The smart light system has been ${
          newState ? "activated" : "deactivated"
        }.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to toggle light: ${error.message}`,
      });
    }
  };

  const getSoilMoisture = async () => {
    try {
      const response = await fetch(
        `http://${SERVERADD}:3000/mqtt/${ACCOUNT}/${DEVICE}/soilMoisture`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to read soilmoisture");
      }

      response.text().then((value) => {
        setSoilMoisture(parseFloat(value) * 100);
      });
      toast({
        title: "Soil Moisture",
        description: `The current soil moisture has been refreshed`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to read soil moisture: ${error.message}`,
      });
    }
  };

  const getPlantData = async () => {
    try {
      const response = await fetch(`http://${SERVERADD}:3000/plants/1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plant data");
      }

      const plantData = await response.json();
      setPlant(plantData); // Save the fetched plant data into state
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch plant data: ${error.message}`,
      });
    }
  };

  const setOptimalMoisture = async () => {
    try {
      console.warn("setting optimal moisture", plant);
      const response = await fetch(`http://${SERVERADD}:3000/plants/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plant),
      });

      if (!response.ok) {
        throw new Error("Failed to put plant data");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to put plant data: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    getPlantData();

    // getSoilMoisture();
    // const startPolling = () => {
    //   pollingRef.current = setInterval(() => {
    //     getSoilMoisture();
    //   }, 20000); // Poll every 20 seconds
    // };
    // startPolling();
    //
    // return () => {
    //   clearInterval(pollingRef.current);
    // };
  }, [plant]);

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
          <>
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
          </>
        ) : (
          <></>
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
