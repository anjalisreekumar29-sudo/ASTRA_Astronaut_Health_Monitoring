export type AlertSeverity = 'normal' | 'warning' | 'critical';

export interface VitalsReading {
  timestamp: string;
  heartRate: number; // bpm
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  oxygenSaturation: number; // SpO2 %
  temperature: number; // °C
  respiratoryRate: number; // breaths/min
  heartRateVariability?: number; // HRV ms
}

export interface VitalThresholds {
  heartRate: { min: number; max: number };
  bloodPressureSystolic: { min: number; max: number };
  bloodPressureDiastolic: { min: number; max: number };
  oxygenSaturation: { min: number; max: number };
  temperature: { min: number; max: number };
  respiratoryRate: { min: number; max: number };
}

export interface ExerciseSession {
  id: string;
  date: string;
  type: 'ARED_RESISTIVE' | 'CEVIS_CYCLE' | 'T2_TREADMILL' | 'HYBRID_EVA_PREP';
  durationMinutes: number;
  intensityKcal: number;
  resistanceLoadKg?: number;
  targetBoneGroup: 'spine' | 'femur' | 'hip' | 'full_body';
  completed: boolean;
}

export interface BoneDensityRecord {
  month: string;
  missionDay: number;
  femoralNeckTScore: number; // normal: > -1.0, osteopenia: -1.0 to -2.5, osteoporosis: < -2.5
  lumbarSpineTScore: number;
  totalHipTScore: number;
  monthlyLossRatePct: number; // % loss per month in microgravity
  calciumTurnoverMgDay: number; // Urinary/serum calcium marker
}

export interface ImmuneBiomarkers {
  date: string;
  whiteBloodCellCount: number; // x10^3/uL (normal 4.5 - 11.0)
  neutrophilLymphocyteRatio: number; // NLR (normal 1.5 - 3.0)
  salivaryCortisol: number; // ug/dL (normal morning 0.2 - 0.9)
  cytokineIL6: number; // pg/mL (normal < 5.0)
  latentViralTiterEBV: 'dormant' | 'elevated' | 'active_reactivation';
  overallImmuneIndex: number; // 0 - 100
}

export interface RadiationData {
  dailyDoseMicroSv: number; // uSv/day
  cumulativeMissionDoseMSv: number; // mSv
  careerDoseMSv: number; // cumulative mSv
  careerLimitMSv: number; // NASA permissible career limit (e.g. 600 mSv)
  standardReference: string; // e.g. "NASA-STD-3001 Vol 1 Rev B / NCRP Report 186"
  permissibleLimitStandard: string; // e.g. "NASA 600 mSv Career Permissible Exposure Limit (REID < 3%)"
  solarParticleActivity: 'nominal' | 'elevated' | 'solar_particle_event_alert';
  gcrFluxRate: number; // Galactic Cosmic Ray flux (uSv/hr)
  habitatShieldingEffectivenessPct: number; // %
  history: Array<{
    missionDay: number;
    date: string;
    dailyMSv: number;
    cumulativeMSv: number;
    solarActivity: string;
  }>;
}

export interface MentalWellnessCheckIn {
  id: string;
  date: string;
  missionDay: number;
  moodRating: number; // 1-10 (10 = optimal)
  stressRating: number; // 1-10 (1 = serene, 10 = extreme)
  sleepHours: number;
  sleepQualityRating: number; // 1-100%
  remSleepPct: number;
  deepSleepPct: number;
  lightSleepPct: number;
  pvtReactionTimeMs: number; // Psychomotor Vigilance Task (ms, normal ~240ms, fatigue >320ms)
  isolationIndex: number; // 1-10 (feeling of isolation)
  notes: string;
  earthCommDelayMinutes: number; // simulated light-time latency (e.g., Mars 14 min, Moon 1.3s)
}

export interface SmartRecommendation {
  id: string;
  category: 'exercise' | 'sleep' | 'hydration' | 'radiation' | 'medical_consult' | 'psychological';
  title: string;
  rationale: string;
  urgency: 'low' | 'medium' | 'high';
  suggestedAction: string;
  triggerFactors: string[];
  acknowledged?: boolean;
}

export interface HealthAlert {
  id: string;
  timestamp: string;
  missionDay: number;
  severity: AlertSeverity;
  category: 'cardiovascular' | 'radiation' | 'respiratory' | 'immune' | 'bone' | 'psychological' | 'environmental';
  title: string;
  description: string;
  explanation: string;
  recommendedAction: string;
  metricsSnapshot: Partial<VitalsReading & { radiationMSv?: number; pvtMs?: number }>;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface AstronautProfile {
  id: string;
  name: string;
  callsign: string;
  role: string;
  rank: string;
  agency: string;
  missionName: string;
  missionDay: number; // SOL / MET
  totalMissionDays: number;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  bloodType: string;
  weightKg: number;
  heightCm: number;
  evaCertified: boolean;
  baselineVitals: {
    restingHeartRate: number;
    systolicBP: number;
    diastolicBP: number;
    spo2: number;
    temperature: number;
    respiratoryRate: number;
    baselineHRV: number;
  };
  avatarUrl: string;
  radiationCareerBaselineMSv: number;
}

export interface HealthReport {
  id: string;
  astronautId: string;
  reportDate: string;
  missionDay: number;
  reportType: 'daily' | 'weekly' | 'mission_phase';
  overallReadinessScore: number; // 0 - 100
  cardiovascularScore: number;
  boneHealthScore: number;
  immuneScore: number;
  mentalWellnessScore: number;
  radiationSafetyScore: number;
  summaryNotes: string;
  clinicalFlightSurgeonComments: string;
  criticalAlertCount: number;
  warningAlertCount: number;
  keyActionItems: string[];
}

export interface SystemSettings {
  simulationEnabled: boolean;
  simulationIntervalMs: number;
  audioAlertsEnabled: boolean;
  radiationWarningThresholdMSv: number;
  activeAnomalyInjection: 'none' | 'solar_flare' | 'hypoxia' | 'cardiac_arrhythmia' | 'acute_fatigue';
  earthCommDelayEnabled: boolean;
  earthCommDelayMinutes: number;
}
