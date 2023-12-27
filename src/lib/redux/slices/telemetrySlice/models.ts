export interface Telemetry {
    carTelemetry: CarTelemetry | undefined
    timingTelemetry: TimingTelemetry | undefined
}

export interface CarTelemetry {
    throttle: number
    brake: number
    clutch: number
    steeringAngle: number
    rpm: number
    speed: number
    fuelQuantity: number
    fuelPercent: number
    currentLapTime: any
    fuelConsumedLap: number
    fuelPressure: number
    oilTemp: number
    oilPressure: number
    waterTemp: number
    voltage: number
}

export interface TimingTelemetry {
    driverCurrentLap: number
    incidents: number
    driverLapsComplete: number
    currentLapTime: number
    lapDeltaToSessionBestLap: number
    lapDistancePercentage: number
}
