import TimePickerDialog from "@/components/TimePickerDialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, Droplet } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const PlantSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [moisture, setMoisture] = React.useState(60);
  const [wateringTimes, setWateringTimes] = React.useState(["06:30", "16:00"]);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = React.useState<
    number | null
  >(null);

  const handleTimeChange = (time: string) => {
    if (selectedTimeIndex !== null) {
      const newTimes = [...wateringTimes];
      newTimes[selectedTimeIndex] = time;
      setWateringTimes(newTimes);
      setShowTimePicker(false);
      toast({
        title: "Watering time updated",
        description: `New watering time set to ${time}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Plant Image */}
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1518495973542-4542c06a5843"
            alt="Plant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <h1 className="absolute bottom-4 left-4 text-white text-2xl font-bold">
            Basil Plant
          </h1>
        </div>

        {/* Soil Moisture Settings */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Ideal Soil Moisture</h2>
          <div className="flex items-center gap-4">
            <Droplet className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <Slider
                value={[moisture]}
                onValueChange={(values) => setMoisture(values[0])}
                max={100}
                step={1}
              />
            </div>
            <span className="min-w-[4rem] text-right">{moisture}%</span>
          </div>
        </div>

        {/* Watering Times */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Watering Schedule</h2>
          {wateringTimes.map((time, index) => (
            <div key={index} className="flex items-center justify-between mb-2">
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

        {/* Last Watering */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Last Watering</h2>
          <p className="text-gray-600">7:00 AM, Jan 5, 2025</p>
        </div>

        {/* Next Watering */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Next Watering</h2>
          <p className="text-gray-600">6:30 AM, Jan 6, 2025</p>
        </div>
      </div>

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
  );
};

export default PlantSettings;
