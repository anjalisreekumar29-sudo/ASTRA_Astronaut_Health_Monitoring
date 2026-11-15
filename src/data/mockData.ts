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
  ExerciseSession
} from '../types';

export const INITIAL_ASTRONAUTS: AstronautProfile[] = [
  {
    id: 'astro-01',
    name: 'Dr. Elena Rostova',
    callsign: 'Athena-1',
    role: 'Mission Commander & Chief Medical Officer',
    rank: 'Commander (CDR)',
    agency: 'NASA / ESA Partner Coalition',
    missionName: 'Artemis IV – Deep Space Gateway & South Pole Outpost',
    missionDay: 142,
    totalMissionDays: 240,
    age: 41,
    gender: 'Female',
    bloodType: 'O-Negative',
    weightKg: 64.5,
    heightCm: 172,
    evaCertified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    radiationCareerBaselineMSv: 112.4,
    baselineVitals: {
      restingHeartRate: 62,
      systolicBP: 116,
      diastolicBP: 76,
      spo2: 98,
      temperature: 36.6,
      respiratoryRate: 14,
      baselineHRV: 68
    }
  },
  {
    id: 'astro-02',
    name: 'Major Marcus Vance',
    callsign: 'Vanguard-2',
    role: 'Lunar Lander Pilot & EVA Specialist',
    rank: 'Lieutenant Colonel (USAF / NASA)',
    agency: 'NASA',
    missionName: 'Artemis IV – Deep Space Gateway & South Pole Outpost',
    missionDay: 142,
    totalMissionDays: 240,
    age: 38,
    gender: 'Male',
    bloodType: 'A-Positive',
    weightKg: 78.2,
    heightCm: 184,
    evaCertified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    radiationCareerBaselineMSv: 145.8,
    baselineVitals: {
      restingHeartRate: 58,
      systolicBP: 122,
      diastolicBP: 78,
      spo2: 99,
      temperature: 36.7,
      respiratoryRate: 13,
      baselineHRV: 74
    }
  },
  {
    id: 'astro-03',
    name: 'Dr. Priya Sharma',
    callsign: 'Chandra-3',
    role: 'Lead Bioscientist & Habitat Systems Engineer',
    rank: 'Mission Specialist (MS-3)',
    agency: 'ISRO / NASA Inter-Agency',
    missionName: 'Artemis IV – Deep Space Gateway & South Pole Outpost',
    missionDay: 142,
    totalMissionDays: 240,
    age: 35,
    gender: 'Female',
    bloodType: 'B-Positive',
    weightKg: 58.0,
    heightCm: 165,
    evaCertified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    radiationCareerBaselineMSv: 68.2,
    baselineVitals: {
      restingHeartRate: 65,
      systolicBP: 114,
      diastolicBP: 74,
      spo2: 98,
      temperature: 36.5,
      respiratoryRate: 15,
      baselineHRV: 62
    }
  }
];

// 24-Hour Telemetry Mock Data (Simulated intervals)
export const GENERATE_HOURLY_VITALS = (baseline: AstronautProfile['baselineVitals']): VitalsReading[] => {
  const readings: VitalsReading[] = [];
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  hours.forEach((time, index) => {
    // Normal circadian variation in microgravity
    const isSleep = index < 4 || index > 10;
    const hrMod = isSleep ? -6 : (index === 7 ? 14 : 2); // spike during EVA / exercise at 14:00
    const bpMod = isSleep ? -4 : (index === 7 ? 12 : 1);

    readings.push({
      timestamp: time,
      heartRate: baseline.restingHeartRate + hrMod + Math.floor((Math.sin(index) * 3)),
      bloodPressureSystolic: baseline.systolicBP + bpMod + Math.floor((Math.cos(index) * 4)),
      bloodPressureDiastolic: baseline.diastolicBP + Math.floor(bpMod * 0.6),
      oxygenSaturation: baseline.spo2 - (isSleep ? 1 : 0),
      temperature: Number((baseline.temperature + (isSleep ? -0.3 : 0.2) + (Math.sin(index * 0.8) * 0.15)).toFixed(1)),
      respiratoryRate: baseline.respiratoryRate + (isSleep ? -2 : (index === 7 ? 4 : 0)),
      heartRateVariability: baseline.baselineHRV + (isSleep ? 12 : -4)
    });
  });

  return readings;
};

// DEXA Bone Density Scan Records (monthly tracking)
export const MOCK_BONE_RECORDS: BoneDensityRecord[] = [
  { month: 'Pre-Flight L-30', missionDay: -30, femoralNeckTScore: 0.2, lumbarSpineTScore: 0.4, totalHipTScore: 0.3, monthlyLossRatePct: 0.0, calciumTurnoverMgDay: 180 },
  { month: 'Flight M1 (SOL 30)', missionDay: 30, femoralNeckTScore: 0.0, lumbarSpineTScore: 0.2, totalHipTScore: 0.1, monthlyLossRatePct: 0.9, calciumTurnoverMgDay: 260 },
  { month: 'Flight M2 (SOL 60)', missionDay: 60, femoralNeckTScore: -0.2, lumbarSpineTScore: 0.0, totalHipTScore: -0.1, monthlyLossRatePct: 1.1, calciumTurnoverMgDay: 295 },
  { month: 'Flight M3 (SOL 90)', missionDay: 90, femoralNeckTScore: -0.5, lumbarSpineTScore: -0.2, totalHipTScore: -0.4, monthlyLossRatePct: 1.3, calciumTurnoverMgDay: 310 },
  { month: 'Flight M4 (SOL 120)', missionDay: 120, femoralNeckTScore: -0.7, lumbarSpineTScore: -0.4, totalHipTScore: -0.6, monthlyLossRatePct: 1.2, calciumTurnoverMgDay: 290 },
  { month: 'Current (SOL 142)', missionDay: 142, femoralNeckTScore: -0.85, lumbarSpineTScore: -0.5, totalHipTScore: -0.75, monthlyLossRatePct: 1.15, calciumTurnoverMgDay: 285 }
];

export const MOCK_EXERCISE_SESSIONS: ExerciseSession[] = [
  { id: 'ex-01', date: 'Today (07:30)', type: 'ARED_RESISTIVE', durationMinutes: 45, intensityKcal: 380, resistanceLoadKg: 145, targetBoneGroup: 'spine', completed: true },
  { id: 'ex-02', date: 'Today (15:00)', type: 'CEVIS_CYCLE', durationMinutes: 35, intensityKcal: 310, targetBoneGroup: 'femur', completed: true },
  { id: 'ex-03', date: 'Yesterday', type: 'T2_TREADMILL', durationMinutes: 40, intensityKcal: 360, targetBoneGroup: 'hip', completed: true },
  { id: 'ex-04', date: 'SOL 140', type: 'ARED_RESISTIVE', durationMinutes: 50, intensityKcal: 410, resistanceLoadKg: 155, targetBoneGroup: 'full_body', completed: true },
  { id: 'ex-05', date: 'SOL 139', type: 'HYBRID_EVA_PREP', durationMinutes: 60, intensityKcal: 480, targetBoneGroup: 'full_body', completed: true }
];

// Immune Biomarkers History
export const MOCK_IMMUNE_HISTORY: ImmuneBiomarkers[] = [
  { date: 'SOL 60', whiteBloodCellCount: 6.8, neutrophilLymphocyteRatio: 2.1, salivaryCortisol: 0.35, cytokineIL6: 2.1, latentViralTiterEBV: 'dormant', overallImmuneIndex: 94 },
  { date: 'SOL 90', whiteBloodCellCount: 6.2, neutrophilLymphocyteRatio: 2.4, salivaryCortisol: 0.42, cytokineIL6: 2.8, latentViralTiterEBV: 'dormant', overallImmuneIndex: 89 },
  { date: 'SOL 120', whiteBloodCellCount: 5.4, neutrophilLymphocyteRatio: 2.9, salivaryCortisol: 0.58, cytokineIL6: 3.9, latentViralTiterEBV: 'elevated', overallImmuneIndex: 81 },
  { date: 'SOL 135', whiteBloodCellCount: 5.1, neutrophilLymphocyteRatio: 3.2, salivaryCortisol: 0.65, cytokineIL6: 4.4, latentViralTiterEBV: 'elevated', overallImmuneIndex: 76 },
  { date: 'Current (SOL 142)', whiteBloodCellCount: 4.9, neutrophilLymphocyteRatio: 3.3, salivaryCortisol: 0.68, cytokineIL6: 4.7, latentViralTiterEBV: 'elevated', overallImmuneIndex: 74 }
];

// Radiation Telemetry
export const MOCK_RADIATION_DATA: RadiationData = {
  dailyDoseMicroSv: 480, // 0.48 mSv/day (deep space nominal ~0.3 - 0.7 mSv/day)
  cumulativeMissionDoseMSv: 68.4,
  careerDoseMSv: 180.8,
  careerLimitMSv: 600.0, // NASA HRP Standard Lifetime Permissible Limit
  standardReference: 'NASA-STD-3001 Vol 1 Rev B / NCRP Report 186',
  permissibleLimitStandard: 'NASA 600 mSv Career Permissible Exposure Limit (REID < 3%)',
  solarParticleActivity: 'nominal',
  gcrFluxRate: 20.2, // uSv/hr
  habitatShieldingEffectivenessPct: 88,
  history: [
    { missionDay: 137, date: 'SOL 137', dailyMSv: 0.46, cumulativeMSv: 66.0, solarActivity: 'Quiet' },
    { missionDay: 138, date: 'SOL 138', dailyMSv: 0.48, cumulativeMSv: 66.5, solarActivity: 'Quiet' },
    { missionDay: 139, date: 'SOL 139', dailyMSv: 0.52, cumulativeMSv: 67.0, solarActivity: 'Moderate GCR' },
    { missionDay: 140, date: 'SOL 140', dailyMSv: 0.47, cumulativeMSv: 67.5, solarActivity: 'Quiet' },
    { missionDay: 141, date: 'SOL 141', dailyMSv: 0.49, cumulativeMSv: 68.0, solarActivity: 'Quiet' },
    { missionDay: 142, date: 'SOL 142', dailyMSv: 0.51, cumulativeMSv: 68.5, solarActivity: 'Nominal' }
  ]
};

// Psychological & Sleep Check-Ins
export const MOCK_MENTAL_CHECKINS: MentalWellnessCheckIn[] = [
  {
    id: 'chk-1',
    date: 'SOL 138',
    missionDay: 138,
    moodRating: 8,
    stressRating: 3,
    sleepHours: 7.2,
    sleepQualityRating: 85,
    remSleepPct: 22,
    deepSleepPct: 19,
    lightSleepPct: 59,
    pvtReactionTimeMs: 242,
    isolationIndex: 3,
    notes: 'Good rest in crew quarters. Audio uplink with family completed with minor lag.',
    earthCommDelayMinutes: 4.2
  },
  {
    id: 'chk-2',
    date: 'SOL 139',
    missionDay: 139,
    moodRating: 7,
    stressRating: 4,
    sleepHours: 6.8,
    sleepQualityRating: 78,
    remSleepPct: 20,
    deepSleepPct: 17,
    lightSleepPct: 63,
    pvtReactionTimeMs: 258,
    isolationIndex: 4,
    notes: 'Long payload bay maintenance shift. Slight muscle soreness.',
    earthCommDelayMinutes: 4.2
  },
  {
    id: 'chk-3',
    date: 'SOL 140',
    missionDay: 140,
    moodRating: 7,
    stressRating: 5,
    sleepHours: 6.2,
    sleepQualityRating: 71,
    remSleepPct: 18,
    deepSleepPct: 15,
    lightSleepPct: 67,
    pvtReactionTimeMs: 275,
    isolationIndex: 4,
    notes: 'Ventilation noise caused 2 brief nocturnal awakenings.',
    earthCommDelayMinutes: 4.3
  },
  {
    id: 'chk-4',
    date: 'SOL 141',
    missionDay: 141,
    moodRating: 6,
    stressRating: 6,
    sleepHours: 5.8,
    sleepQualityRating: 64,
    remSleepPct: 16,
    deepSleepPct: 13,
    lightSleepPct: 71,
    pvtReactionTimeMs: 298,
    isolationIndex: 5,
    notes: 'Higher cognitive workload preparing for sample analysis. Mild eye fatigue.',
    earthCommDelayMinutes: 4.3
  },
  {
    id: 'chk-5',
    date: 'SOL 142 (Current)',
    missionDay: 142,
    moodRating: 6,
    stressRating: 6,
    sleepHours: 6.0,
    sleepQualityRating: 66,
    remSleepPct: 17,
    deepSleepPct: 14,
    lightSleepPct: 69,
    pvtReactionTimeMs: 290,
    isolationIndex: 5,
    notes: 'Feeling manageable fatigue. Scheduled 20-min guided mindfulness session after shift.',
    earthCommDelayMinutes: 4.4
  }
];

// Initial Health Alerts
export const INITIAL_ALERTS: HealthAlert[] = [
  {
    id: 'alt-01',
    timestamp: 'SOL 142 - 11:24 MET',
    missionDay: 142,
    severity: 'warning',
    category: 'cardiovascular',
    title: 'Elevated Post-Exercise Recovery Latency',
    description: 'Heart rate recovery after 45-min ARED session took 18 minutes to return within 15% of baseline (expected < 10 mins).',
    explanation: 'Cardiovascular deconditioning in microgravity diminishes baroreflex sensitivity and fluid volume shift toward upper torso, resulting in prolonged cardiac recovery.',
    recommendedAction: 'Rest in seated/strapped neutral posture. Follow mission-approved fluid replenishment protocols and consult Crew Medical Officer if recovery latency persists.',
    metricsSnapshot: { heartRate: 88, bloodPressureSystolic: 128, bloodPressureDiastolic: 84 },
    status: 'active'
  },
  {
    id: 'alt-02',
    timestamp: 'SOL 142 - 08:15 MET',
    missionDay: 142,
    severity: 'warning',
    category: 'psychological',
    title: 'Cumulative Sleep Debt Detected (3 Cons. Sols < 6.5h)',
    description: 'Average sleep duration past 72 hours dropped to 5.9 hours. Psychomotor Vigilance Task (PVT) reaction time slowed by 48ms.',
    explanation: 'Circadian disruption and acoustic module noise have eroded slow-wave deep sleep. Slower reaction times correlate with operational fatigue risk.',
    recommendedAction: 'Engage 460nm blue-depleted evening cabin lighting protocol. Shift sleep phase by +45 minutes tonight and consult Flight Surgeon if fatigue continues.',
    metricsSnapshot: { pvtMs: 290 },
    status: 'active'
  },
  {
    id: 'alt-03',
    timestamp: 'SOL 141 - 22:40 MET',
    missionDay: 141,
    severity: 'normal',
    category: 'radiation',
    title: 'Dosimeter Reading Within Nominal Deep-Space Range',
    description: 'Gateway exterior dosimeter logged 0.51 mSv/24h. Storm shelter shielding remains at 88% nominal.',
    explanation: 'Cosmic ray flux remains stable with no coronal mass ejection (CME) transit detected along Earth-Moon corridor.',
    recommendedAction: 'No countermeasure required. Maintain standard passive dosimeter badge wear and continuous telemetry monitoring.',
    metricsSnapshot: { radiationMSv: 0.51 },
    status: 'acknowledged'
  }
];

// Smart Recommendations
export const INITIAL_RECOMMENDATIONS: SmartRecommendation[] = [
  {
    id: 'rec-01',
    category: 'sleep',
    title: 'Initiate Circadian Lighting Phase Delay',
    rationale: 'Three consecutive sols with sleep under 6.5 hours accompanied by 15% reduction in REM sleep cycle.',
    urgency: 'medium',
    suggestedAction: 'Dim primary workstation luminaires 90 minutes prior to crew rest; activate red-spectrum sleep illumination.',
    triggerFactors: ['Sleep Duration: 5.9h avg', 'PVT reaction latency: +48ms']
  },
  {
    id: 'rec-02',
    category: 'exercise',
    title: 'Target Lumbar & Femoral Bone Loading Protocol',
    rationale: 'DEXA scan indicates femoral neck T-score trending toward -0.85 with monthly calcium turnover at 285 mg/day.',
    urgency: 'medium',
    suggestedAction: 'Increase ARED axial load by +5kg on deadlift and squat sets per Flight Surgeon exercise prescription.',
    triggerFactors: ['Femoral T-score: -0.85', 'Microgravity calcium excretion elevated']
  },
  {
    id: 'rec-03',
    category: 'hydration',
    title: 'Pre-EVA Plasma Volume Hydration Review',
    rationale: 'Elevated post-exercise heart rate recovery latency indicates mild cephalad fluid redistribution and plasma contraction.',
    urgency: 'low',
    suggestedAction: 'Follow mission-approved fluid intake schedule under Crew Medical Officer supervision.',
    triggerFactors: ['Heart rate recovery: +18 min', 'Diastolic BP variance: +6 mmHg']
  },
  {
    id: 'rec-04',
    category: 'medical_consult',
    title: 'Scheduled Ground Flight Surgeon Telemetry Review',
    rationale: 'Approaching Mission Mid-Point (SOL 145) bi-weekly comprehensive medical sync.',
    urgency: 'low',
    suggestedAction: 'Upload encrypted 7-day telemetry package prior to 16:00 UTC uplink window.',
    triggerFactors: ['Mission milestone SOL 142 of 240', 'Routine medical review cycle']
  }
];

// Health Reports
export const INITIAL_REPORTS: HealthReport[] = [
  {
    id: 'rep-sol-142',
    astronautId: 'astro-01',
    reportDate: '2026-11-14 (SOL 142)',
    missionDay: 142,
    reportType: 'daily',
    overallReadinessScore: 84,
    cardiovascularScore: 86,
    boneHealthScore: 81,
    immuneScore: 78,
    mentalWellnessScore: 82,
    radiationSafetyScore: 92,
    summaryNotes: 'Astronaut demonstrates resilient operational readiness. Cardiovascular baseline stable with slight post-exercise deceleration lag. Sleep debt noted over past 72 hours requiring circadian protocol adjustment. Radiation dosage accumulated remains well below the 30-day and career thresholds.',
    clinicalFlightSurgeonComments: 'Flight Surgeon Note: Dr. Rostova remains fit for EVA and flight operations. Recommended slight boost in ARED resistive loads and adherence to evening blue-light filtering to restore sleep architecture.',
    criticalAlertCount: 0,
    warningAlertCount: 2,
    keyActionItems: [
      'Increase ARED squat axial load to 150 kg per approved countermeasure schedule',
      'Follow mission hydration guidelines prior to evening cycle session',
      'Deploy 460nm blue-depleted sleep lighting 90m before rest'
    ]
  },
  {
    id: 'rep-sol-135-weekly',
    astronautId: 'astro-01',
    reportDate: '2026-11-07 (SOL 135)',
    missionDay: 135,
    reportType: 'weekly',
    overallReadinessScore: 88,
    cardiovascularScore: 90,
    boneHealthScore: 83,
    immuneScore: 82,
    mentalWellnessScore: 89,
    radiationSafetyScore: 94,
    summaryNotes: 'Weekly synthesis confirms high physical performance during simulated lunar descent navigation drills. Immune markers reflect expected spaceflight-associated cytokine variance without clinical symptomatic manifestation.',
    clinicalFlightSurgeonComments: 'All telemetry metrics concordant with mission flight plan. Nutrition and caloric intake tracking within target range (2,850 kcal/day).',
    criticalAlertCount: 0,
    warningAlertCount: 1,
    keyActionItems: [
      'Maintain daily 2.5 hour dual-exercise protocol',
      'Routine salivary cortisol swab on SOL 142'
    ]
  }
];
