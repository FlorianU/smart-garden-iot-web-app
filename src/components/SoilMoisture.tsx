import { Progress } from "@/components/ui/progress";
import { Droplet } from "lucide-react";

interface SoilMoistureProps {
  value: number;
}

const SoilMoisture = ({ value }: SoilMoistureProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Droplet className="h-8 w-8 text-primary" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Current Level</span>
          <span className="text-sm font-medium">{value}%</span>
        </div>
        <Progress value={value} className="h-2" />
      </div>
    </div>
  );
};

export default SoilMoisture;
