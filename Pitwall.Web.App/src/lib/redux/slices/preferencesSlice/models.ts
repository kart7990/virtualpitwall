export enum MeasurementSystem {
  Imperial,
  Metric,
}

export interface PreferencesSliceState {
  measurementSystem: MeasurementSystem;
}

export class Measurement {
  measurement: MeasurementSystem;

  constructor(measurement: MeasurementSystem) {
    this.measurement = measurement;
  }

  isImperial() {
    return this.measurement === MeasurementSystem.Imperial;
  }

  isMetric() {
    return this.measurement === MeasurementSystem.Metric;
  }
}
