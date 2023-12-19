import { SET_TELEMETRY } from "./TelemetryActions";

export default function (state = null, action) {
    switch (action.type) {
        case SET_TELEMETRY:
            return action.telemetry
        default:
            return state;
    }
}