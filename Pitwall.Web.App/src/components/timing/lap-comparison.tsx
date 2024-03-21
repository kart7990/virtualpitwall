import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core/ui/select";
import {
  getCurrentTrackSessionNumber,
  getTrackSessions,
  useSelector,
} from "@/lib/redux";
import { useState } from "react";
import LapTimes from "./components/lap-times";

const LapComparison = () => {
  const trackSessions = useSelector(getTrackSessions);
  const currentTrackSessionNumber = useSelector(getCurrentTrackSessionNumber);
  const [selectedSession, setSelectedSession] = useState<number>(
    currentTrackSessionNumber || 0,
  );

  const getSelectableSessions = () => {
    if (trackSessions) {
      return trackSessions.map((s) => {
        return (
          <SelectItem key={s.number} value={String(s.number)}>
            <div className="grid gap-2">
              <div className="flex items-center">
                {s.number} - {s.name}
              </div>
            </div>
          </SelectItem>
        );
      });
    }
  };

  return (
    <div className="p-2">
      <div>
        <Select
          onValueChange={(e) => {
            setSelectedSession(Number(e));
          }}
        >
          <SelectTrigger id="data-provider">
            <SelectValue placeholder="--- Select Session ---" />
          </SelectTrigger>
          <SelectContent>{getSelectableSessions()}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2">
        <LapTimes sessionNumber={selectedSession} />
        <LapTimes sessionNumber={selectedSession} />
      </div>
    </div>
  );
};

export default LapComparison;
