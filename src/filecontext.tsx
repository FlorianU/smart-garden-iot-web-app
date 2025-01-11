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
};

// Define the context type
type FileContextType = {
  plant: Plant | null;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  getSoilMoisture: () => void;
  toggleLight: () => void;
  isLightOn: boolean;
};

// Create the context
export const FileContext = createContext<FileContextType | undefined>(
  undefined
);

// FileContext provider component
export const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLightOn, setIsLightOn] = useState(false);

  // Fetch plant data
  const fetchPlantData = useCallback(async () => {
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
      setPlant(plantData);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch plant data: ${error.message}`,
      });
    }
  }, [toast]);

  // Fetch soil moisture
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
        throw new Error("Failed to read soil moisture");
      }

      const value = await response.text();
      if (plant) {
        setPlant((prevPlant) => ({
          ...prevPlant!,
          soilMoisture: parseFloat(value) * 100,
        }));
      }

      toast({
        title: "Soil Moisture",
        description: "The current soil moisture has been refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to read soil moisture: ${error.message}`,
      });
    }
  };

  // Toggle the light state
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

  // Fetch plant data on initial render
  useEffect(() => {
    fetchPlantData();
  }, [fetchPlantData]);

  return (
    <FileContext.Provider
      value={{
        plant,
        setPlant,
        getSoilMoisture,
        toggleLight,
        isLightOn,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
