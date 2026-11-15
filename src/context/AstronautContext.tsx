// @refresh reset
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AstronautProfile,
  VitalsReading,
  BoneDensityRecord,
  ExerciseSession,
  ImmuneBiomarkers,
  RadiationData,
  MentalWellnessCheckIn,
  HealthAlert,
  SmartRecommendation,
  HealthReport,
  SystemSettings
} from '../types';
import { StorageService, DEFAULT_SETTINGS } from '../services/storageService';
import { AIEngine, AIAnalysisResult } from '../services/aiEngine';
import { SimulationEngine } from '../services/simulationEngine';
import { PDFService } from '../services/pdfService';

export type NavTab =
  | 'dashboard'
  | 'vitals'
  | 'physical'
  | 'mental'
  | 'ai'
  | 'alerts'
  | 'reports'
  | 'settings';

interface AstronautContextType {
  astronauts: AstronautProfile[];
  activeAstronaut: AstronautProfile;
  activeAstronautId: string;
  activeTab: NavTab;
  vitalsHistory: VitalsReading[];
  currentVitals: VitalsReading;
  boneRecords: BoneDensityRecord[];
  exerciseSessions: ExerciseSession[];
  immuneRecords: ImmuneBiomarkers[];
  radiationData: RadiationData;
  mentalCheckIns: MentalWellnessCheckIn[];
  alerts: HealthAlert[];
  recommendations: SmartRecommendation[];
  reports: HealthReport[];
  settings: SystemSettings;
  aiAnalysis: AIAnalysisResult;
  setActiveAstronautId: (id: string) => void;
  setActiveTab: (tab: NavTab) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  addManualVitalReading: (reading: Partial<VitalsReading>) => void;
  addMentalCheckIn: (checkIn: Omit<MentalWellnessCheckIn, 'id'>) => void;
  addExerciseSession: (session: Omit<ExerciseSession, 'id'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  acknowledgeRecommendation: (recId: string) => void;
  injectAnomaly: (anomaly: SystemSettings['activeAnomalyInjection']) => void;
  resetToDefaults: () => void;
  downloadReportPDF: (reportId?: string) => void;
}

const AstronautContext = createContext<AstronautContextType | undefined>(undefined);

export const AstronautProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [astronauts] = useState<AstronautProfile[]>(() => StorageService.getAstronauts());
  const [activeAstronautId, setActiveAstronautIdState] = useState<string>(() =>
    StorageService.getActiveAstronautId()
  );
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [settings, setSettings] = useState<SystemSettings>(() => StorageService.getSettings());

  // Active Astronaut object
  const activeAstronaut = useMemo(() => {
    return astronauts.find(a => a.id === activeAstronautId) || astronauts[0];
  }, [astronauts, activeAstronautId]);

  // Telemetry and clinical sub-system state
  const [vitalsHistory, setVitalsHistory] = useState<VitalsReading[]>(() =>
    StorageService.getVitals(activeAstronautId)
  );
  const [boneRecords, setBoneRecords] = useState<BoneDensityRecord[]>(() =>
    StorageService.getBoneRecords(activeAstronautId)
  );
  const [exerciseSessions, setExerciseSessions] = useState<ExerciseSession[]>(() =>
    StorageService.getExerciseSessions(activeAstronautId)
  );
  const [immuneRecords, setImmuneRecords] = useState<ImmuneBiomarkers[]>(() =>
    StorageService.getImmuneRecords(activeAstronautId)
  );
  const [radiationData, setRadiationData] = useState<RadiationData>(() =>
    StorageService.getRadiationData(activeAstronautId)
  );
  const [mentalCheckIns, setMentalCheckIns] = useState<MentalWellnessCheckIn[]>(() =>
    StorageService.getMentalCheckIns(activeAstronautId)
  );
  const [alerts, setAlerts] = useState<HealthAlert[]>(() =>
    StorageService.getAlerts(activeAstronautId)
  );
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>(() =>
    StorageService.getRecommendations(activeAstronautId)
  );
  const [reports, setReports] = useState<HealthReport[]>(() =>
    StorageService.getReports(activeAstronautId)
  );

  // Switch astronaut
  const setActiveAstronautId = useCallback((id: string) => {
    StorageService.setActiveAstronautId(id);
    setActiveAstronautIdState(id);
    setVitalsHistory(StorageService.getVitals(id));
    setBoneRecords(StorageService.getBoneRecords(id));
    setExerciseSessions(StorageService.getExerciseSessions(id));
    setImmuneRecords(StorageService.getImmuneRecords(id));
    setRadiationData(StorageService.getRadiationData(id));
    setMentalCheckIns(StorageService.getMentalCheckIns(id));
    setAlerts(StorageService.getAlerts(id));
    setRecommendations(StorageService.getRecommendations(id));
    setReports(StorageService.getReports(id));
  }, []);

  const currentVitals = useMemo(() => {
    if (vitalsHistory.length > 0) {
      return vitalsHistory[vitalsHistory.length - 1];
    }
    const baseline = activeAstronaut.baselineVitals;
    return {
      timestamp: 'NOW',
      heartRate: baseline.restingHeartRate,
      bloodPressureSystolic: baseline.systolicBP,
      bloodPressureDiastolic: baseline.diastolicBP,
      oxygenSaturation: baseline.spo2,
      temperature: baseline.temperature,
      respiratoryRate: baseline.respiratoryRate,
      heartRateVariability: baseline.baselineHRV
    };
  }, [vitalsHistory, activeAstronaut]);

  // Continuous AI Analysis Computation
  const aiAnalysis = useMemo(() => {
    return AIEngine.analyze(
      activeAstronaut,
      currentVitals,
      vitalsHistory,
      boneRecords,
      immuneRecords,
      radiationData,
      mentalCheckIns
    );
  }, [
    activeAstronaut,
    currentVitals,
    vitalsHistory,
    boneRecords,
    immuneRecords,
    radiationData,
    mentalCheckIns
  ]);

  // Merge any high-priority AI-detected alerts into alerts list if not present
  useEffect(() => {
    if (aiAnalysis.generatedAlerts.length > 0) {
      setAlerts(prev => {
        let changed = false;
        const updated = [...prev];
        aiAnalysis.generatedAlerts.forEach(newAlt => {
          const exists = updated.some(
            a => a.category === newAlt.category && a.severity === newAlt.severity && a.status === 'active'
          );
          if (!exists) {
            updated.unshift(newAlt);
            changed = true;
          }
        });
        if (changed) {
          StorageService.saveAlerts(activeAstronautId, updated);
          return updated;
        }
        return prev;
      });
    }
  }, [aiAnalysis.generatedAlerts, activeAstronautId]);

  // Simulation Loop
  useEffect(() => {
    if (!settings.simulationEnabled) return;

    const interval = setInterval(() => {
      // 1. Generate next simulated vitals reading
      setVitalsHistory(prev => {
        const last = prev[prev.length - 1] || {
          timestamp: 'NOW',
          heartRate: activeAstronaut.baselineVitals.restingHeartRate,
          bloodPressureSystolic: activeAstronaut.baselineVitals.systolicBP,
          bloodPressureDiastolic: activeAstronaut.baselineVitals.diastolicBP,
          oxygenSaturation: activeAstronaut.baselineVitals.spo2,
          temperature: activeAstronaut.baselineVitals.temperature,
          respiratoryRate: activeAstronaut.baselineVitals.respiratoryRate,
          heartRateVariability: activeAstronaut.baselineVitals.baselineHRV
        };

        const nextReading = SimulationEngine.generateNextReading(
          last,
          activeAstronaut.baselineVitals,
          settings.activeAnomalyInjection
        );

        // Keep rolling 30 readings window for real-time smoothness
        const updated = [...prev.slice(-29), nextReading];
        StorageService.saveVitals(activeAstronautId, updated);
        return updated;
      });

      // 2. Update radiation telemetry if solar flare active
      if (settings.activeAnomalyInjection === 'solar_flare') {
        setRadiationData(prev => {
          const updated = SimulationEngine.updateRadiationState(
            prev,
            settings.activeAnomalyInjection
          );
          StorageService.saveRadiationData(activeAstronautId, updated);
          return updated;
        });
      }
    }, settings.simulationIntervalMs);

    return () => clearInterval(interval);
  }, [
    settings.simulationEnabled,
    settings.simulationIntervalMs,
    settings.activeAnomalyInjection,
    activeAstronaut,
    activeAstronautId
  ]);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      StorageService.saveSettings(updated);
      return updated;
    });
  }, []);

  // Quick Anomaly Injection
  const injectAnomaly = useCallback((anomaly: SystemSettings['activeAnomalyInjection']) => {
    updateSettings({ activeAnomalyInjection: anomaly });
  }, [updateSettings]);

  // Add Manual Vital Entry
  const addManualVitalReading = useCallback((reading: Partial<VitalsReading>) => {
    setVitalsHistory(prev => {
      const last = prev[prev.length - 1] || {
        timestamp: 'NOW',
        heartRate: activeAstronaut.baselineVitals.restingHeartRate,
        bloodPressureSystolic: activeAstronaut.baselineVitals.systolicBP,
        bloodPressureDiastolic: activeAstronaut.baselineVitals.diastolicBP,
        oxygenSaturation: activeAstronaut.baselineVitals.spo2,
        temperature: activeAstronaut.baselineVitals.temperature,
        respiratoryRate: activeAstronaut.baselineVitals.respiratoryRate,
        heartRateVariability: activeAstronaut.baselineVitals.baselineHRV
      };

      const now = new Date().toTimeString().slice(0, 8);
      const manualEntry: VitalsReading = {
        timestamp: now,
        heartRate: reading.heartRate ?? last.heartRate,
        bloodPressureSystolic: reading.bloodPressureSystolic ?? last.bloodPressureSystolic,
        bloodPressureDiastolic: reading.bloodPressureDiastolic ?? last.bloodPressureDiastolic,
        oxygenSaturation: reading.oxygenSaturation ?? last.oxygenSaturation,
        temperature: reading.temperature ?? last.temperature,
        respiratoryRate: reading.respiratoryRate ?? last.respiratoryRate,
        heartRateVariability: reading.heartRateVariability ?? last.heartRateVariability
      };

      const updated = [...prev.slice(-29), manualEntry];
      StorageService.saveVitals(activeAstronautId, updated);
      return updated;
    });
  }, [activeAstronaut, activeAstronautId]);

  // Add Mental Check-in
  const addMentalCheckIn = useCallback((checkIn: Omit<MentalWellnessCheckIn, 'id'>) => {
    const newCheckIn: MentalWellnessCheckIn = {
      ...checkIn,
      id: `chk-${Date.now()}`
    };
    setMentalCheckIns(prev => {
      const updated = [...prev, newCheckIn];
      StorageService.saveMentalCheckIns(activeAstronautId, updated);
      return updated;
    });
  }, [activeAstronautId]);

  // Add Exercise Session
  const addExerciseSession = useCallback((session: Omit<ExerciseSession, 'id'>) => {
    const newSession: ExerciseSession = {
      ...session,
      id: `ex-${Date.now()}`
    };
    setExerciseSessions(prev => {
      const updated = [newSession, ...prev];
      StorageService.saveExerciseSessions(activeAstronautId, updated);
      return updated;
    });
  }, [activeAstronautId]);

  // Acknowledge Alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => {
      const updated = prev.map(a =>
        a.id === alertId ? { ...a, status: 'acknowledged' as const } : a
      );
      StorageService.saveAlerts(activeAstronautId, updated);
      return updated;
    });
  }, [activeAstronautId]);

  // Resolve Alert
  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => {
      const updated = prev.map(a =>
        a.id === alertId ? { ...a, status: 'resolved' as const } : a
      );
      StorageService.saveAlerts(activeAstronautId, updated);
      return updated;
    });
  }, [activeAstronautId]);

  // Acknowledge Recommendation
  const acknowledgeRecommendation = useCallback((recId: string) => {
    setRecommendations(prev => {
      const updated = prev.map(r =>
        r.id === recId ? { ...r, acknowledged: true } : r
      );
      StorageService.saveRecommendations(activeAstronautId, updated);
      return updated;
    });
  }, [activeAstronautId]);

  // Download Report PDF
  const downloadReportPDF = useCallback((reportId?: string) => {
    const targetReport = (reportId ? reports.find(r => r.id === reportId) : reports[0]) || {
      id: 'rep-now',
      astronautId: activeAstronaut.id,
      reportDate: `SOL ${activeAstronaut.missionDay}`,
      missionDay: activeAstronaut.missionDay,
      reportType: 'daily' as const,
      overallReadinessScore: aiAnalysis.overallReadinessScore,
      cardiovascularScore: aiAnalysis.categoryScores.cardiovascular,
      boneHealthScore: aiAnalysis.categoryScores.musculoskeletal,
      immuneScore: aiAnalysis.categoryScores.immune,
      mentalWellnessScore: aiAnalysis.categoryScores.cognitive,
      radiationSafetyScore: aiAnalysis.categoryScores.radiation,
      summaryNotes: 'Real-time telemetry report generated from onboard ASTRA clinical engine.',
      clinicalFlightSurgeonComments: 'Astronaut cleared for ongoing flight operations with recommended countermeasures.',
      criticalAlertCount: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
      warningAlertCount: alerts.filter(a => a.severity === 'warning' && a.status === 'active').length,
      keyActionItems: recommendations.slice(0, 3).map(r => r.suggestedAction)
    };

    const latestBone = boneRecords[boneRecords.length - 1] || {
      month: 'Current',
      missionDay: activeAstronaut.missionDay,
      femoralNeckTScore: -0.85,
      lumbarSpineTScore: -0.5,
      totalHipTScore: -0.75,
      monthlyLossRatePct: 1.15,
      calciumTurnoverMgDay: 285
    };

    const latestImmune = immuneRecords[immuneRecords.length - 1] || {
      date: 'Current',
      whiteBloodCellCount: 5.2,
      neutrophilLymphocyteRatio: 2.8,
      salivaryCortisol: 0.55,
      cytokineIL6: 3.8,
      latentViralTiterEBV: 'dormant' as const,
      overallImmuneIndex: 82
    };

    const latestMental = mentalCheckIns[mentalCheckIns.length - 1] || {
      id: 'chk-def',
      date: 'Current',
      missionDay: activeAstronaut.missionDay,
      moodRating: 7,
      stressRating: 4,
      sleepHours: 6.8,
      sleepQualityRating: 80,
      remSleepPct: 20,
      deepSleepPct: 18,
      lightSleepPct: 62,
      pvtReactionTimeMs: 255,
      isolationIndex: 4,
      notes: 'Nominal operational status.',
      earthCommDelayMinutes: 4.4
    };

    PDFService.generateHealthReportPDF(
      activeAstronaut,
      targetReport,
      currentVitals,
      radiationData,
      latestBone,
      latestImmune,
      latestMental
    );
  }, [
    reports,
    activeAstronaut,
    aiAnalysis,
    alerts,
    recommendations,
    boneRecords,
    immuneRecords,
    mentalCheckIns,
    currentVitals,
    radiationData
  ]);

  // Reset all to defaults
  const resetToDefaults = useCallback(() => {
    StorageService.resetAllData();
    window.location.reload();
  }, []);

  return (
    <AstronautContext.Provider
      value={{
        astronauts,
        activeAstronaut,
        activeAstronautId,
        activeTab,
        vitalsHistory,
        currentVitals,
        boneRecords,
        exerciseSessions,
        immuneRecords,
        radiationData,
        mentalCheckIns,
        alerts,
        recommendations,
        reports,
        settings,
        aiAnalysis,
        setActiveAstronautId,
        setActiveTab,
        updateSettings,
        addManualVitalReading,
        addMentalCheckIn,
        addExerciseSession,
        acknowledgeAlert,
        resolveAlert,
        acknowledgeRecommendation,
        injectAnomaly,
        resetToDefaults,
        downloadReportPDF
      }}
    >
      {children}
    </AstronautContext.Provider>
  );
};

export const useAstronaut = () => {
  const context = useContext(AstronautContext);
  if (!context) {
    throw new Error('useAstronaut must be used within an AstronautProvider');
  }
  return context;
};
