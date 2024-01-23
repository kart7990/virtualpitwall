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
  pitwallSessionSlice,
  getSelectedIRacingSessionId,
  useSelector,
  useDispatch,
} from "@/lib/redux";

export function SourceSelection() {
  const dispatch = useDispatch();
  const pitwallSession = useSelector(getPitwallSession);
  const selectedDataProvider = useSelector(getSelectedDataProvider);
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
          <Select
            onValueChange={(e) => {
              dispatch(pitwallSessionSlice.actions.changeDataProvider(e));
            }}
            defaultValue={selectedDataProvider?.id}
          >
            <SelectTrigger id="data-provider">
              <SelectValue placeholder="---Select---" />
            </SelectTrigger>
            <SelectContent>{DataProviderItems()}</SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telemetry-provider">Telemetry Source</Label>
          <Select>
            <SelectTrigger id="telemetry-provider">
              <SelectValue placeholder="---Select Driver---" />
            </SelectTrigger>
            <SelectContent>{telemetryProviders()}</SelectContent>
          </Select>
        </div>
      </div>

      <Separator />
    </div>
  );
}
