import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TimePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTimeSelect: (time: string) => void;
  initialTime: string;
}

const TimePickerDialog = ({
  open,
  onOpenChange,
  onTimeSelect,
  initialTime,
}: TimePickerDialogProps) => {
  const [hours, minutes] = initialTime.split(':').map(Number);
  const [selectedHours, setSelectedHours] = React.useState(hours);
  const [selectedMinutes, setSelectedMinutes] = React.useState(minutes);

  const handleConfirm = () => {
    const timeString = `${selectedHours.toString().padStart(2, '0')}:${selectedMinutes.toString().padStart(2, '0')}`;
    onTimeSelect(timeString);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Time</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hours</label>
            <select
              className="w-full rounded-md border p-2"
              value={selectedHours}
              onChange={(e) => setSelectedHours(Number(e.target.value))}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Minutes</label>
            <select
              className="w-full rounded-md border p-2"
              value={selectedMinutes}
              onChange={(e) => setSelectedMinutes(Number(e.target.value))}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimePickerDialog;