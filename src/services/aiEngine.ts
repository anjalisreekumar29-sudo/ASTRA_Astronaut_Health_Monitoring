import {
  AstronautProfile,
  VitalsReading,
  BoneDensityRecord,
  ImmuneBiomarkers,
  RadiationData,
  MentalWellnessCheckIn,
  HealthAlert,
  SmartRecommendation,
  AlertSeverity
} from '../types';

export interface AIPatternDetection {
  title: string;
  description: string;
  confidence: number;
  severity: AlertSeverity;
  physiologicalSystem: string;
  contributingIndicators: string[];
  reasoning: string;
  scientificReference: string;
  recommendedCountermeasure: string;
}

export interface AIAnalysisResult {
  overallReadinessScore: number;
  categoryScores: {
    cardiovascular: number;
    musculoskeletal: number;
    immune: number;
    radiation: number;
    cognitive: number;
  };
  generatedAlerts: HealthAlert[];
  generatedRecommendations: SmartRecommendation[];
  detectedPatterns: AIPatternDetection[];
  medicalDisclaimer: string;
}

export const BIO_WELLNESS_WEIGHTS = {
  cardiovascular: {
    weightPct: 25,
    name: 'Cardiovascular Dynamics',
    description: 'Assesses resting heart rate deviation, arterial systolic/diastolic pressure, autonomic tone (HRV), and baroreflex deconditioning risk.',
    scientificBasis: 'NASA Human Research Program (HRP) Cardiovascular Risk Standard'
  },
  musculoskeletal: {
    weightPct: 20,
    name: 'Musculoskeletal Integrity',
    description: 'Integrates monthly DEXA T-scores (femur, spine, hip), microgravity calcium turnover rates, and ARED axial loading compliance.',
    scientificBasis: 'NASA-STD-3001 Bone Loss Countermeasure Guideline'
  },
  radiation: {
    weightPct: 20,
    name: 'Radiation Safety Margin',
    description: 'Calculates active cumulative exposure vs NASA 600 mSv lifetime career limit, 30-day mission limits, and solar particle flux.',
    scientificBasis: 'NASA-STD-3001 Vol 1 Rev B & NCRP Report No. 186'
  },
  cognitive: {
    weightPct: 20,
    name: 'Cognitive & Behavioral Health',
    description: 'Evaluates sleep duration, sleep architecture (REM/Deep/Light), Psychomotor Vigilance Task (PVT) reaction time, and subjective stress.',
    scientificBasis: 'NASA Behavioral Health & Performance (BHP) Standard'
  },
  immune: {
    weightPct: 15,
    name: 'Immunological Resilience',
    description: 'Tracks white blood cell count, neutrophil-to-lymphocyte ratio (NLR), salivary cortisol, and latent viral (EBV/VZV) reactivation.',
    scientificBasis: 'NASA Flight Medicine Immunology Consortium Standards'
  }
};

export class AIEngine {
  static readonly MEDICAL_DISCLAIMER =
    'ASTRA Decision-Support Prototype. Simulated heuristic analysis for demonstration. All suggestions require validation by certified NASA Flight Surgeons and compliance with official mission medical checklists.';

  static analyze(
    astronaut: AstronautProfile,
    currentVitals: VitalsReading,
    vitalsHistory: VitalsReading[],
    boneRecords: BoneDensityRecord[],
    immuneRecords: ImmuneBiomarkers[],
    radiationData: RadiationData,
    mentalCheckIns: MentalWellnessCheckIn[]
  ): AIAnalysisResult {
    const alerts: HealthAlert[] = [];
    const recommendations: SmartRecommendation[] = [];
    const patterns: AIPatternDetection[] = [];

    const baseline = astronaut.baselineVitals;
    const nowTimestamp = `SOL ${astronaut.missionDay} - MET Telemetry`;

    // 1. CARDIOVASCULAR SUBSYSTEM EVALUATION
    let cardScore = 100;
    const hrDelta = currentVitals.heartRate - baseline.restingHeartRate;
    const sysDelta = currentVitals.bloodPressureSystolic - baseline.systolicBP;

    if (currentVitals.heartRate > 115) {
      cardScore -= 25;
      alerts.push({
        id: `alert-hr-tachy-${Date.now()}`,
        timestamp: nowTimestamp,
        missionDay: astronaut.missionDay,
        severity: currentVitals.heartRate > 130 ? 'critical' : 'warning',
        category: 'cardiovascular',
        title: 'Tachycardia / Elevated Cardiac Workload',
        description: `Heart rate is ${currentVitals.heartRate} bpm (+${hrDelta} bpm above resting baseline).`,
        explanation: 'Sustained elevation in heart rate in microgravity suggests cardiovascular compensation for reduced circulating blood volume or heightened sympathetic stress response.',
        recommendedAction: 'Rest in neutral seated/strapped posture. Follow approved mission fluid replenishment protocol. Consult Crew Medical Officer if heart rate remains elevated > 15 mins.',
        metricsSnapshot: { heartRate: currentVitals.heartRate, bloodPressureSystolic: currentVitals.bloodPressureSystolic },
        status: 'active'
      });
    } else if (currentVitals.heartRate < 45) {
      cardScore -= 20;
      alerts.push({
        id: `alert-hr-brady-${Date.now()}`,
        timestamp: nowTimestamp,
        missionDay: astronaut.missionDay,
        severity: 'warning',
        category: 'cardiovascular',
        title: 'Bradycardia Detected',
        description: `Heart rate dropped to ${currentVitals.heartRate} bpm, below lower threshold.`,
        explanation: 'Extreme bradycardia in spaceflight may result from heightened vagal tone, electrolyte shifts, or conduction variance.',
        recommendedAction: 'Verify biosensor electrode contact. Perform gentle limb movements and notify Crew Medical Officer.',
        metricsSnapshot: { heartRate: currentVitals.heartRate },
        status: 'active'
      });
    }

    if (currentVitals.bloodPressureSystolic > 140 || currentVitals.bloodPressureDiastolic > 90) {
      cardScore -= 18;
      alerts.push({
        id: `alert-bp-high-${Date.now()}`,
        timestamp: nowTimestamp,
        missionDay: astronaut.missionDay,
        severity: 'warning',
        category: 'cardiovascular',
        title: 'Elevated Arterial Pressure',
        description: `Blood pressure reading ${currentVitals.bloodPressureSystolic}/${currentVitals.bloodPressureDiastolic} mmHg deviates from baseline (${baseline.systolicBP}/${baseline.diastolicBP}).`,
        explanation: 'Cephalad fluid redistribution and increased vascular resistance in enclosed space habitats can transiently elevate central arterial pressure.',
        recommendedAction: 'Re-measure after 10 minutes of quiet rest. Check cabin ambient CO2 levels and consult Flight Surgeon.',
        metricsSnapshot: { bloodPressureSystolic: currentVitals.bloodPressureSystolic, bloodPressureDiastolic: currentVitals.bloodPressureDiastolic },
        status: 'active'
      });
    }

    // 2. RESPIRATORY & CABIN HYPOXIA EVALUATION
    if (currentVitals.oxygenSaturation < 94) {
      cardScore -= 30;
      const isCritical = currentVitals.oxygenSaturation < 90;
      alerts.push({
        id: `alert-spo2-${Date.now()}`,
        timestamp: nowTimestamp,
        missionDay: astronaut.missionDay,
        severity: isCritical ? 'critical' : 'warning',
        category: 'respiratory',
        title: isCritical ? 'CRITICAL: Severe Hypoxia Detected' : 'Oxygen Saturation Depressed',
        description: `SpO2 measured at ${currentVitals.oxygenSaturation}% (nominal baseline: ${baseline.spo2}%).`,
        explanation: 'Low blood oxygen in pressurized flight modules indicates partial pressure O2 variance, air scrubbers malfunction, or impaired alveolar gas exchange.',
        recommendedAction: isCritical
          ? 'EMERGENCY: Don quick-don emergency oxygen mask immediately per NASA Flight Rule 4.1. Alert flight deck and check atmospheric scrubbers.'
          : 'Inspect pulse oximeter probe alignment. Verify personal air duct airflow is unblocked and consult CMO.',
        metricsSnapshot: { oxygenSaturation: currentVitals.oxygenSaturation, respiratoryRate: currentVitals.respiratoryRate },
        status: 'active'
      });
    }

    // 3. CORE BODY TEMPERATURE & INFECTION/HEAT STRAIN
    if (currentVitals.temperature > 37.8) {
      alerts.push({
        id: `alert-temp-${Date.now()}`,
        timestamp: nowTimestamp,
        missionDay: astronaut.missionDay,
        severity: currentVitals.temperature > 38.5 ? 'critical' : 'warning',
        category: 'immune',
        title: 'Elevated Core Body Temperature (Space Fever / Pyrexia)',
        description: `Core temperature is ${currentVitals.temperature}°C (baseline: ${baseline.temperature}°C).`,
        explanation: 'Astronauts experience baseline core temperature shifts of ~1°C due to impaired convective heat dissipation in zero gravity; values >37.8°C signify systemic thermal strain or infectious process.',
        recommendedAction: 'Cease physical exertion. Apply liquid cooling ventilation garment (LCVG). Consult Flight Surgeon for clinical diagnostic evaluation.',
        metricsSnapshot: { temperature: currentVitals.temperature, heartRate: currentVitals.heartRate },
        status: 'active'
      });
    }

    // 4. BONE HEALTH & CALCIUM TURNOVER EVALUATION
    let boneScore = 90;
    const latestBone = boneRecords[boneRecords.length - 1];
    if (latestBone) {
      if (latestBone.femoralNeckTScore < -1.0) {
        boneScore -= 20;
        alerts.push({
          id: `alert-bone-tscore-${Date.now()}`,
          timestamp: nowTimestamp,
          missionDay: astronaut.missionDay,
          severity: 'warning',
          category: 'bone',
          title: 'Femoral Bone Mineral Density Loss (Osteopenia Range)',
          description: `Femoral neck T-score is ${latestBone.femoralNeckTScore}. Estimated loss rate: ${latestBone.monthlyLossRatePct}%/month.`,
          explanation: 'Lack of mechanical loading triggers osteoclast resorption and inhibits osteoblast bone formation.',
          recommendedAction: 'Consult Flight Surgeon to review prescribed ARED axial resistance loads and evaluate flight nutrition protocol.',
          metricsSnapshot: {},
          status: 'active'
        });
      } else {
        boneScore -= Math.max(0, Math.floor(Math.abs(latestBone.femoralNeckTScore) * 15));
      }
    }

    // 5. IMMUNE & CYTOKINE BIOMARKERS EVALUATION
    let immuneScore = 88;
    const latestImmune = immuneRecords[immuneRecords.length - 1];
    if (latestImmune) {
      immuneScore = latestImmune.overallImmuneIndex;
      if (latestImmune.neutrophilLymphocyteRatio > 3.0 || latestImmune.salivaryCortisol > 0.6) {
        alerts.push({
          id: `alert-immune-dys-${Date.now()}`,
          timestamp: nowTimestamp,
          missionDay: astronaut.missionDay,
          severity: 'warning',
          category: 'immune',
          title: 'Immune Dysregulation & Subclinical Stress Signature',
          description: `Neutrophil-to-Lymphocyte Ratio (NLR) is ${latestImmune.neutrophilLymphocyteRatio} (norm < 3.0); Salivary Cortisol is ${latestImmune.salivaryCortisol} ug/dL.`,
          explanation: 'Chronic microgravity exposure combined with cosmic radiation triggers T-cell suppression and subclinical latent herpesvirus reactivation.',
          recommendedAction: 'Consult Flight Surgeon and Crew Medical Officer for clinical review; protect scheduled circadian rest periods.',
          metricsSnapshot: {},
          status: 'active'
        });
      }
    }

    // 6. RADIATION DOSIMETRY EVALUATION
    let radScore = 95;
    const careerPct = (radiationData.careerDoseMSv / radiationData.careerLimitMSv) * 100;
    if (radiationData.solarParticleActivity === 'solar_particle_event_alert') {
      radScore -= 40;
      alerts.unshift({
        id: `alert-rad-spe-${Date.now()}`,
        timestamp: nowTimestamp,
        missionDay: astronaut.missionDay,
        severity: 'critical',
        category: 'radiation',
        title: 'CRITICAL: Solar Particle Event (SPE) Radiation Alert',
        description: `Real-time flux exceeds safety threshold. Daily dose projecting > 5.0 mSv.`,
        explanation: 'Energetic solar proton shower detected along Gateway transit corridor. Unshielded exposure heightens acute radiation sickness and long-term carcinogenesis risk per NCRP Report No. 186.',
        recommendedAction: 'ALL CREW: Immediately execute Flight Rule 9.2: retreat into water-shielded Storm Shelter Module. Secure exterior hatches.',
        metricsSnapshot: { radiationMSv: radiationData.dailyDoseMicroSv / 1000 },
        status: 'active'
      });
    } else if (careerPct > 40) {
      radScore -= 10;
    }

    // 7. MENTAL WELLNESS & COGNITIVE SLEEP DEBT EVALUATION
    let cogScore = 85;
    const latestMental = mentalCheckIns[mentalCheckIns.length - 1];
    if (latestMental) {
      if (latestMental.sleepHours < 6.0 || latestMental.pvtReactionTimeMs > 280) {
        cogScore -= 22;
        alerts.push({
          id: `alert-fatigue-pvt-${Date.now()}`,
          timestamp: nowTimestamp,
          missionDay: astronaut.missionDay,
          severity: latestMental.pvtReactionTimeMs > 320 ? 'critical' : 'warning',
          category: 'psychological',
          title: 'Cognitive Fatigue & Psychomotor Slowing Detected',
          description: `PVT reaction latency increased to ${latestMental.pvtReactionTimeMs} ms (norm ~240 ms); Sleep duration was ${latestMental.sleepHours}h.`,
          explanation: 'Restricted sleep suppresses executive frontal lobe vigilance, elevating manual piloting and robotic arm operation risk.',
          recommendedAction: 'Restrict safety-critical robotic and EVA maneuvers for next 8 hours per Flight Rules. Implement 30-minute structured cockpit power nap.',
          metricsSnapshot: { pvtMs: latestMental.pvtReactionTimeMs },
          status: 'active'
        });
      } else {
        cogScore = Math.min(100, Math.round((latestMental.moodRating * 5) + (latestMental.sleepQualityRating * 0.5)));
      }
    }

    // 8. MULTI-VARIABLE CORRELATION PATTERNS
    // Pattern A: Cardiovascular deconditioning + Elevated core temp = Heat Dissipation Strain
    if (currentVitals.heartRate > baseline.restingHeartRate + 15 && currentVitals.temperature > 37.2) {
      patterns.push({
        title: 'Microgravity Thermoregulatory & Cardiac Coupling Strain',
        description: 'Simultaneous elevation of resting heart rate and core temperature indicates impaired skin heat convection and reduced central venous return.',
        confidence: 89,
        severity: 'warning',
        physiologicalSystem: 'Cardiovascular & Thermoregulatory',
        contributingIndicators: [
          `Heart Rate: ${currentVitals.heartRate} BPM (+${hrDelta} over baseline)`,
          `Core Temperature: ${currentVitals.temperature} °C (+${(currentVitals.temperature - baseline.temperature).toFixed(1)} °C)`,
          `Autonomic HRV: ${currentVitals.heartRateVariability || 65} ms (depressed sympathetic tone)`
        ],
        reasoning: 'In microgravity, convective air currents are absent, forming a stagnant warm boundary layer around the skin. Combined with microgravity-induced hypovolemia, cardiac output must increase to drive cutaneous perfusion, causing cardiac and thermal strain.',
        scientificReference: 'NASA HRP Risk of Adverse Cognitive and Behavioral Conditions & Thermoregulatory Variance in Microgravity',
        recommendedCountermeasure: 'Increase habitat ventilation flow velocity by 20%. Follow flight medical hydration protocols.'
      });
      recommendations.push({
        id: `rec-thermo-${Date.now()}`,
        category: 'hydration',
        title: 'Activate Thermal Convection & Fluid Protocol',
        rationale: 'Combined elevated heart rate and mild hyperthermia during habitability shifts.',
        urgency: 'medium',
        suggestedAction: 'Increase cabin airflow velocity and follow mission fluid management guidelines under CMO guidance.',
        triggerFactors: ['Heart Rate +18bpm', 'Core Temp 37.3°C']
      });
    }

    // Pattern B: Sleep Debt + Immune Suppression
    if (latestMental && latestMental.sleepHours < 6.5 && latestImmune && latestImmune.salivaryCortisol > 0.5) {
      patterns.push({
        title: 'Circadian Disruption-Induced Neuro-Immune Suppression',
        description: 'High correlation between shortened REM sleep cycles and elevated cortisol levels, predisposing astronaut to latent viral awakening.',
        confidence: 93,
        severity: 'warning',
        physiologicalSystem: 'Neuro-Endocrine & Immune',
        contributingIndicators: [
          `Sleep Duration: ${latestMental.sleepHours}h (Target: >7.0h)`,
          `Salivary Cortisol: ${latestImmune.salivaryCortisol} ug/dL (Elevated > 0.5)`,
          `NLR Ratio: ${latestImmune.neutrophilLymphocyteRatio} (Normal < 3.0)`
        ],
        reasoning: 'Circadian desynchronosis stimulates the hypothalamic-pituitary-adrenal (HPA) axis, elevating circulating glucocorticoids. Chronic hypercortisolemia directly suppresses interleukin synthesis and T-cell cytotoxicity, leading to opportunistic latent herpesvirus shedding.',
        scientificReference: 'NASA Flight Medicine Consortium / Immune Dysregulation During Long-Duration Spaceflight',
        recommendedCountermeasure: 'Deploy 480nm morning wake lights, strict 22:00 dark cycle, and schedule 20-min guided mindfulness check-in.'
      });
      recommendations.push({
        id: `rec-circadian-${Date.now()}`,
        category: 'sleep',
        title: 'Enforce Circadian Re-alignment Protocol',
        rationale: 'Chronically elevated cortisol coupled with < 6.5h sleep over consecutive sols.',
        urgency: 'high',
        suggestedAction: 'Deploy 480nm morning wake lights and strict 22:00 dark cycle. Schedule 20-min guided mindfulness check-in.',
        triggerFactors: ['Sleep < 6.5h', 'Cortisol > 0.60 ug/dL']
      });
    }

    // Pattern C: Hypoxia & Respiratory Strain
    if (currentVitals.oxygenSaturation < 93 && currentVitals.respiratoryRate > 20) {
      patterns.push({
        title: 'Atmospheric Gas Disparity / Hypoxic Drive Activation',
        description: 'Co-occurrence of sub-nominal arterial SpO2 with elevated compensatory tachypnea suggests localized cabin air stratification or life-support variance.',
        confidence: 96,
        severity: 'critical',
        physiologicalSystem: 'Respiratory & Habitat Life-Support',
        contributingIndicators: [
          `SpO2: ${currentVitals.oxygenSaturation}% (Critical threshold < 94%)`,
          `Respiratory Rate: ${currentVitals.respiratoryRate} /min (Tachypnea > 20)`,
          `Heart Rate: ${currentVitals.heartRate} BPM (Compensatory tachycardia)`
        ],
        reasoning: 'In closed microgravity compartments, exhaled CO2 can form stagnant bubbles around crew heads if cabin fans fail. The chemoreceptors trigger reflex hyperventilation to clear hypercapnia and counteract hypoxia.',
        scientificReference: 'NASA-STD-3001 Vol 2 (Atmospheric Quality and Partial Pressure O2/CO2 Envelopes)',
        recommendedCountermeasure: 'Immediate donning of portable oxygen masks, verify module ventilation fan integrity, and inform Mission Control.'
      });
    }

    // Pattern D: SPE Radiation Surge & Environmental Hazard
    if (radiationData.solarParticleActivity === 'solar_particle_event_alert') {
      patterns.push({
        title: 'Solar Particle Event (SPE) Coronal Transit Exposure',
        description: 'High-energy coronal mass ejection protons detected crossing habitat corridor, exceeding 24h permissible dosage rates.',
        confidence: 99,
        severity: 'critical',
        physiologicalSystem: 'Radiation Dosimetry & Environmental',
        contributingIndicators: [
          `Daily Dosimeter Rate: ${radiationData.dailyDoseMicroSv} uSv/day (> 5.0 mSv/day)`,
          `GCR/SPE Flux: ${radiationData.gcrFluxRate} uSv/hr`,
          `Habitat Shielding: ${radiationData.habitatShieldingEffectivenessPct}% active`
        ],
        reasoning: 'Solar proton events produce intense flux of ions with kinetic energies >100 MeV capable of penetrating standard vehicle hulls, producing bremsstrahlung and high biological effectiveness damage.',
        scientificReference: 'NCRP Report No. 186 / NASA Space Radiation Permissible Limits (REID < 3%)',
        recommendedCountermeasure: 'Execute immediate storm shelter retreat into central water-jacketed safe haven. Cease all EVA tasks.'
      });
    }

    // Compute Overall Readiness Score (Weighted)
    const overallReadinessScore = Math.max(
      35,
      Math.min(
        100,
        Math.round(
          cardScore * 0.25 +
          boneScore * 0.20 +
          immuneScore * 0.15 +
          radScore * 0.20 +
          cogScore * 0.20
        )
      )
    );

    return {
      overallReadinessScore,
      categoryScores: {
        cardiovascular: Math.max(20, Math.min(100, cardScore)),
        musculoskeletal: Math.max(20, Math.min(100, boneScore)),
        immune: Math.max(20, Math.min(100, immuneScore)),
        radiation: Math.max(20, Math.min(100, radScore)),
        cognitive: Math.max(20, Math.min(100, cogScore))
      },
      generatedAlerts: alerts,
      generatedRecommendations: recommendations,
      detectedPatterns: patterns,
      medicalDisclaimer: this.MEDICAL_DISCLAIMER
    };
  }
}
