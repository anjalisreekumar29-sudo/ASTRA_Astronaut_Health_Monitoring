import {
  AstronautProfile,
  VitalsReading,
  BoneDensityRecord,
  ImmuneBiomarkers,
  RadiationData,
  MentalWellnessCheckIn,
  HealthAlert,
  SmartRecommendation,
  HealthReport,
  ExerciseSession,
  SystemSettings
} from '../types';

import {
  INITIAL_ASTRONAUTS,
  GENERATE_HOURLY_VITALS,
  MOCK_BONE_RECORDS,
  MOCK_EXERCISE_SESSIONS,
  MOCK_IMMUNE_HISTORY,
  MOCK_RADIATION_DATA,
  MOCK_MENTAL_CHECKINS,
  INITIAL_ALERTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_REPORTS
} from '../data/mockData';

const STORAGE_KEYS = {
  ASTRONAUTS: 'astra_astronauts_v1',
  ACTIVE_ASTRONAUT_ID: 'astra_active_astronaut_id_v1',
  VITALS_PREFIX: 'astra_vitals_',
  BONE_PREFIX: 'astra_bone_',
  EXERCISE_PREFIX: 'astra_exercise_',
  IMMUNE_PREFIX: 'astra_immune_',
  RADIATION_PREFIX: 'astra_radiation_',
  MENTAL_PREFIX: 'astra_mental_',
  ALERTS_PREFIX: 'astra_alerts_',
  RECOMMENDATIONS_PREFIX: 'astra_recommendations_',
  REPORTS_PREFIX: 'astra_reports_',
  SETTINGS: 'astra_system_settings_v1'
};

export const DEFAULT_SETTINGS: SystemSettings = {
  simulationEnabled: true,
  simulationIntervalMs: 3000,
  audioAlertsEnabled: false,
  radiationWarningThresholdMSv: 1.0,
  activeAnomalyInjection: 'none',
  earthCommDelayEnabled: true,
  earthCommDelayMinutes: 4.4
};

export class StorageService {
  // Astronauts
  static getAstronauts(): AstronautProfile[] {
    const data = localStorage.getItem(STORAGE_KEYS.ASTRONAUTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ASTRONAUTS, JSON.stringify(INITIAL_ASTRONAUTS));
      return INITIAL_ASTRONAUTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ASTRONAUTS;
    }
  }

  static saveAstronauts(astronauts: AstronautProfile[]): void {
    localStorage.setItem(STORAGE_KEYS.ASTRONAUTS, JSON.stringify(astronauts));
  }

  // Active Astronaut
  static getActiveAstronautId(): string {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_ASTRONAUT_ID);
    return id || INITIAL_ASTRONAUTS[0].id;
  }

  static setActiveAstronautId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ASTRONAUT_ID, id);
  }

  // Vitals
  static getVitals(astronautId: string): VitalsReading[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.VITALS_PREFIX}${astronautId}`);
    if (!data) {
      const astronaut = this.getAstronauts().find(a => a.id === astronautId) || INITIAL_ASTRONAUTS[0];
      const initial = GENERATE_HOURLY_VITALS(astronaut.baselineVitals);
      this.saveVitals(astronautId, initial);
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static saveVitals(astronautId: string, vitals: VitalsReading[]): void {
    localStorage.setItem(`${STORAGE_KEYS.VITALS_PREFIX}${astronautId}`, JSON.stringify(vitals));
  }

  // Bone
  static getBoneRecords(astronautId: string): BoneDensityRecord[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.BONE_PREFIX}${astronautId}`);
    if (!data) {
      this.saveBoneRecords(astronautId, MOCK_BONE_RECORDS);
      return MOCK_BONE_RECORDS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_BONE_RECORDS;
    }
  }

  static saveBoneRecords(astronautId: string, records: BoneDensityRecord[]): void {
    localStorage.setItem(`${STORAGE_KEYS.BONE_PREFIX}${astronautId}`, JSON.stringify(records));
  }

  // Exercise
  static getExerciseSessions(astronautId: string): ExerciseSession[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.EXERCISE_PREFIX}${astronautId}`);
    if (!data) {
      this.saveExerciseSessions(astronautId, MOCK_EXERCISE_SESSIONS);
      return MOCK_EXERCISE_SESSIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_EXERCISE_SESSIONS;
    }
  }

  static saveExerciseSessions(astronautId: string, sessions: ExerciseSession[]): void {
    localStorage.setItem(`${STORAGE_KEYS.EXERCISE_PREFIX}${astronautId}`, JSON.stringify(sessions));
  }

  // Immune
  static getImmuneRecords(astronautId: string): ImmuneBiomarkers[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.IMMUNE_PREFIX}${astronautId}`);
    if (!data) {
      this.saveImmuneRecords(astronautId, MOCK_IMMUNE_HISTORY);
      return MOCK_IMMUNE_HISTORY;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_IMMUNE_HISTORY;
    }
  }

  static saveImmuneRecords(astronautId: string, records: ImmuneBiomarkers[]): void {
    localStorage.setItem(`${STORAGE_KEYS.IMMUNE_PREFIX}${astronautId}`, JSON.stringify(records));
  }

  // Radiation
  static getRadiationData(astronautId: string): RadiationData {
    const data = localStorage.getItem(`${STORAGE_KEYS.RADIATION_PREFIX}${astronautId}`);
    if (!data) {
      this.saveRadiationData(astronautId, MOCK_RADIATION_DATA);
      return MOCK_RADIATION_DATA;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_RADIATION_DATA;
    }
  }

  static saveRadiationData(astronautId: string, radiation: RadiationData): void {
    localStorage.setItem(`${STORAGE_KEYS.RADIATION_PREFIX}${astronautId}`, JSON.stringify(radiation));
  }

  // Mental
  static getMentalCheckIns(astronautId: string): MentalWellnessCheckIn[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.MENTAL_PREFIX}${astronautId}`);
    if (!data) {
      this.saveMentalCheckIns(astronautId, MOCK_MENTAL_CHECKINS);
      return MOCK_MENTAL_CHECKINS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_MENTAL_CHECKINS;
    }
  }

  static saveMentalCheckIns(astronautId: string, checkIns: MentalWellnessCheckIn[]): void {
    localStorage.setItem(`${STORAGE_KEYS.MENTAL_PREFIX}${astronautId}`, JSON.stringify(checkIns));
  }

  // Alerts
  static getAlerts(astronautId: string): HealthAlert[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.ALERTS_PREFIX}${astronautId}`);
    if (!data) {
      this.saveAlerts(astronautId, INITIAL_ALERTS);
      return INITIAL_ALERTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ALERTS;
    }
  }

  static saveAlerts(astronautId: string, alerts: HealthAlert[]): void {
    localStorage.setItem(`${STORAGE_KEYS.ALERTS_PREFIX}${astronautId}`, JSON.stringify(alerts));
  }

  // Recommendations
  static getRecommendations(astronautId: string): SmartRecommendation[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.RECOMMENDATIONS_PREFIX}${astronautId}`);
    if (!data) {
      this.saveRecommendations(astronautId, INITIAL_RECOMMENDATIONS);
      return INITIAL_RECOMMENDATIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_RECOMMENDATIONS;
    }
  }

  static saveRecommendations(astronautId: string, recs: SmartRecommendation[]): void {
    localStorage.setItem(`${STORAGE_KEYS.RECOMMENDATIONS_PREFIX}${astronautId}`, JSON.stringify(recs));
  }

  // Reports
  static getReports(astronautId: string): HealthReport[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.REPORTS_PREFIX}${astronautId}`);
    if (!data) {
      this.saveReports(astronautId, INITIAL_REPORTS);
      return INITIAL_REPORTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_REPORTS;
    }
  }

  static saveReports(astronautId: string, reports: HealthReport[]): void {
    localStorage.setItem(`${STORAGE_KEYS.REPORTS_PREFIX}${astronautId}`, JSON.stringify(reports));
  }

  // Settings
  static getSettings(): SystemSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: SystemSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Reset all to demo default state
  static resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach(prefix => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix) || key === prefix) {
          localStorage.removeItem(key);
        }
      });
    });
  }
}
