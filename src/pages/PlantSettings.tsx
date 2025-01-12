import TimePickerDialog from "@/components/TimePickerDialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FileContext } from "@/filecontext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, Droplet } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const PlantSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileContext = useContext(FileContext);

  if (!fileContext) {
    throw new Error("FileContext is not available");
  }

  const { plant, saveWateringTimes, saveIdealSoilMoisture } = fileContext;
  const [moisture, setMoisture] = React.useState(
    plant?.requiredSoilMoisture || 0
  );
  const [wateringTimes, setWateringTimes] = React.useState<string[]>([
    plant?.wateringTime1 || "06:30",
    plant?.wateringTime2 || "18:00",
  ]);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = React.useState<
    number | null
  >(null);

  useEffect(() => {
    // Update state when the plant value changes
    if (plant) {
      setMoisture(plant.requiredSoilMoisture);
      setWateringTimes([
        plant.wateringTime1 || "06:30",
        plant.wateringTime2 || "18:00",
      ]);
    }
  }, [plant]);

  const handleTimeChange = (time: string) => {
    if (selectedTimeIndex !== null) {
      const newTimes = [...wateringTimes];
      newTimes[selectedTimeIndex] = time;
      setWateringTimes(newTimes);
      setShowTimePicker(false);

      saveWateringTimes([newTimes[0], newTimes[1]]);
    }
  };

  const debouncedSaveMoisture = useDebouncedCallback((value: number) => {
    saveIdealSoilMoisture(value);
  }, 300); // Adjust debounce delay as needed (300ms here)

  const handleMoistureChange = (value: number) => {
    setMoisture(value);
    debouncedSaveMoisture(value); // Use debounced function
  };

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src="/1.jpeg"
            alt="Plant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <h1 className="absolute bottom-4 left-4 text-white text-2xl font-bold">
            Basil Plant
          </h1>
        </div>

        {plant ? (
          <>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                Ideal Soil Moisture
              </h2>
              <div className="flex items-center gap-4">
                <Droplet className="h-6 w-6 text-primary" />
                <Slider
                  value={[moisture]}
                  onValueChange={(values) => handleMoistureChange(values[0])}
                  max={100}
                  step={1}
                />
                <span className="min-w-[4rem] text-right">{moisture}%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Watering Schedule</h2>
              {wateringTimes.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-2"
                >
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <span>Watering Time {index + 1}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTimeIndex(index);
                      setShowTimePicker(true);
                    }}
                  >
                    {time}
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : null}
        {showTimePicker && (
          <TimePickerDialog
            open={showTimePicker}
            onOpenChange={setShowTimePicker}
            onTimeSelect={handleTimeChange}
            initialTime={
              selectedTimeIndex !== null
                ? wateringTimes[selectedTimeIndex]
                : "00:00"
            }
          />
        )}
      </div>
    </div>
  );
};

export default PlantSettings;
