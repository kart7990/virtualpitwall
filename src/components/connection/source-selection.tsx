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
import {
  getCurrentTrackSessionNumber,
  getGameSession,
  getPitwallSession,
  getSelectedDataProvider,
  pitwallSlice,
  getSelectedIRacingSessionId,
  getSelectedTelemetryProvider,
  useSelector,
  useDispatch,
} from "@/lib/redux";

export function SourceSelection() {
  const dispatch = useDispatch();
  const pitwallSession = useSelector(getPitwallSession);
  const selectedDataProvider = useSelector(getSelectedDataProvider);
  const selectedTelemetryProvider = useSelector(getSelectedTelemetryProvider);

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

  function TelemetryProviderItems() {
    if (pitwallSession != null) {
      return pitwallSession.telemetryProviders.map((tp) => (
        <SelectItem key={tp.id} value={tp.id}>
          <div className="grid gap-2">
            <div className="flex items-center">
              {tp.name}
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
    <>
      <div className="grid">
        <span className="uppercase text-slate-500">Data Source</span>
        <Select
          onValueChange={(e) => {
            dispatch(pitwallSlice.actions.changeDataProvider(e));
          }}
          defaultValue={selectedDataProvider?.id}
        >
          <SelectTrigger id="data-provider">
            <SelectValue placeholder="---Select---" />
          </SelectTrigger>
          <SelectContent>{DataProviderItems()}</SelectContent>
        </Select>
      </div>
      <div className="grid">
        <span className="uppercase text-slate-500">Telemetry Source</span>
        <Select
          onValueChange={(e) => {
            dispatch(pitwallSlice.actions.changeTelemetryProvider(e));
          }}
          defaultValue={selectedTelemetryProvider?.id}
        >
          <SelectTrigger id="telemetry-provider">
            <SelectValue placeholder="---Select Driver---" />
          </SelectTrigger>
          <SelectContent>{TelemetryProviderItems()}</SelectContent>
        </Select>
      </div>
    </>
  );
}
