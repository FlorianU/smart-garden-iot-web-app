import { useToast } from "@/hooks/use-toast";
import React, { createContext, useCallback, useEffect, useState } from "react";

const SERVERADD = "localhost"; // Adjust this if needed
const SERVERADD1 = "localhost"; // Adjust this if needed
const ACCOUNT = 1;
const DEVICE = 1;

// Define the Plant type
type Plant = {
  id: number;
  name: string;
  soilMoisture: number;
  requiredSoilMoisture: number;
  lastWatered: string;
  isWateringScheduled: boolean;
  wateringTime1: string; // First optimal watering time (HH:mm:ss format)
  wateringTime2: string; // Second optimal watering time (HH:mm:ss format)
};

// Define the context type
type FileContextType = {
  plant: Plant | null;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  getSoilMoisture: () => void;
  toggleLight: () => void;
  isLightOn: boolean;
  saveWateringTimes: (wateringTimes: [string, string]) => void;
  saveIdealSoilMoisture: (idealSoilMoisture: number) => void;
};

// Create the context
export const FileContext = createContext<FileContextType | undefined>(
  undefined
);
// Updated FileProvider component with saving functionality for watering times and soil moisture
export const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLightOn, setIsLightOn] = useState(false);

  const fetchPlantData = useCallback(async () => {
    try {
      const response = await fetch(`http://${SERVERADD}:3000/plants/1`);
      if (!response.ok) throw new Error("Failed to fetch plant data");
      const plantData = await response.json();
      setPlant(plantData);
    } catch (error) {
      toast({ title: "Error", description: error.message });
    }
  }, [toast]);

  const saveWateringTimes = async (wateringTimes: [string, string]) => {
    try {
      const response = await fetch(`http://${SERVERADD}:3000/plants/1`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wateringTime1: wateringTimes[0],
          wateringTime2: wateringTimes[1],
        }),
      });

      if (!response.ok) throw new Error("Failed to save watering times");

      setPlant((prevPlant) => ({
        ...prevPlant!,
        wateringTime1: wateringTimes[0],
        wateringTime2: wateringTimes[1],
      }));

      toast({ title: "Success", description: "Watering times updated" });
    } catch (error) {
      toast({ title: "Error", description: error.message });
    }
  };

  const saveIdealSoilMoisture = async (idealSoilMoisture: number) => {
    try {
      const response = await fetch(`http://${SERVERADD}:3000/plants/1`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requiredSoilMoisture: idealSoilMoisture }),
      });

      if (!response.ok) throw new Error("Failed to save soil moisture setting");

      setPlant((prevPlant) => ({
        ...prevPlant!,
        requiredSoilMoisture: idealSoilMoisture,
      }));

      toast({ title: "Success", description: "Soil moisture setting updated" });
    } catch (error) {
      toast({ title: "Error", description: error.message });
    }
  };

  useEffect(() => {
    fetchPlantData();
  }, [fetchPlantData]);

  return (
    <FileContext.Provider
      value={{
        plant,
        setPlant,
        getSoilMoisture: fetchPlantData,
        toggleLight: async () => {},
        isLightOn,
        saveWateringTimes,
        saveIdealSoilMoisture,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
