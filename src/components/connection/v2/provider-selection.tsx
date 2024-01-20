import { Label } from "@/components/core/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/core/ui/select";
import { Separator } from "@/components/core/ui/separator";
import {
  getCurrentTrackSessionNumber,
  getGameSession,
  getPitwallSession,
  getSelectedDataProvider,
  getSelectedIRacingSessionId,
  useSelector,
} from "@/lib/redux";

export function ProviderSelection() {
  const pitwallSession = useSelector(getPitwallSession);
  const selectedDataProvider = useSelector(getSelectedDataProvider);
  const selectedIRacingSessionId = useSelector(getSelectedIRacingSessionId);
  const currentTrackSessionNumber = useSelector(getCurrentTrackSessionNumber);
  const gameSession = useSelector(getGameSession);

  function DataProviderItems() {
    if (pitwallSession != null) {
      return pitwallSession.gameDataProviders.map((gdp) => (
        <SelectItem key={gdp.id} value={gdp.id}>
          <div className="grid gap-2">
            <div className="flex items-center">
              {gdp.name}
              <span className="ml-1 h-2 w-2 rounded-full bg-green-600"></span>
            </div>
          </div>
        </SelectItem>
      ));
    }
  }

  function iRacingSessionIdItems() {
    if (selectedDataProvider != null) {
      return selectedDataProvider.gameAssignedSessionIds.map((id) => (
        <SelectItem key={id} value={id}>
          <div className="grid gap-2">
            <div className="flex items-center">
              {id}
              <span className="ml-1 h-2 w-2 rounded-full bg-green-600"></span>
            </div>
          </div>
        </SelectItem>
      ));
    }
  }

  function trackSessionItems() {
    if (gameSession != null) {
      return gameSession.trackSessions.map((trackSession) => (
        <SelectItem
          key={trackSession.number}
          value={trackSession.number.toString()}
        >
          <div className="grid gap-2">
            <div className="flex items-center">
              {trackSession.number} - {trackSession.type}
              <span className="ml-1 h-2 w-2 rounded-full bg-green-600"></span>
            </div>
          </div>
        </SelectItem>
      ));
    }
  }

  function telemetryProviders() {
    return <></>;
  }

  return (
    <div>
      <div className="flex ml-6 my-2 space-x-6">
        <div className="grid gap-2">
          <Label htmlFor="data-provider">Data Source</Label>
          <Select defaultValue={selectedDataProvider?.id}>
            <SelectTrigger id="data-provider">
              <SelectValue placeholder="---Select---" />
            </SelectTrigger>
            <SelectContent>{DataProviderItems()}</SelectContent>
          </Select>
        </div>
        {selectedDataProvider && (
          <div className="grid gap-2">
            <Label htmlFor="game-session-id">iRacing Session ID</Label>
            <Select defaultValue={selectedIRacingSessionId}>
              <SelectTrigger id="game-session-id">
                <SelectValue placeholder="---Select---" />
              </SelectTrigger>

              <SelectContent>{iRacingSessionIdItems()}</SelectContent>
            </Select>
          </div>
        )}
        {currentTrackSessionNumber != null && (
          <div className="grid gap-2">
            <Label htmlFor="track-session">Track Session</Label>
            <Select defaultValue={currentTrackSessionNumber.toString()}>
              <SelectTrigger id="track-session">
                <SelectValue placeholder="---Select---" />
              </SelectTrigger>
              <SelectContent>{trackSessionItems()}</SelectContent>
            </Select>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="telemetry-provider">Telemetry Source</Label>
          <Select>
            <SelectTrigger id="telemetry-provider">
              <SelectValue placeholder="---Select---" />
            </SelectTrigger>
            <SelectContent>{telemetryProviders()}</SelectContent>
          </Select>
        </div>
      </div>

      <Separator />
    </div>
  );
}
