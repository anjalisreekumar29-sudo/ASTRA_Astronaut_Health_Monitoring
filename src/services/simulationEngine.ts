import { VitalsReading, AstronautProfile, SystemSettings, RadiationData } from '../types';

export class SimulationEngine {
  /**
   * Generates a realistic next telemetry reading based on baseline and active anomalies.
   */
  static generateNextReading(
    current: VitalsReading,
    baseline: AstronautProfile['baselineVitals'],
    anomaly: SystemSettings['activeAnomalyInjection']
  ): VitalsReading {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);

    // Natural microgravity physiological jitter
    const hrJitter = (Math.random() - 0.48) * 2;
    const bpSysJitter = (Math.random() - 0.5) * 3;
    const bpDiaJitter = (Math.random() - 0.5) * 2;
    const tempJitter = (Math.random() - 0.5) * 0.05;
    const respJitter = (Math.random() - 0.5) * 0.8;

    let targetHR = current.heartRate + hrJitter;
    let targetSys = current.bloodPressureSystolic + bpSysJitter;
    let targetDia = current.bloodPressureDiastolic + bpDiaJitter;
    let targetSpo2 = current.oxygenSaturation + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0);
    let targetTemp = current.temperature + tempJitter;
    let targetResp = current.respiratoryRate + respJitter;
    let targetHRV = (current.heartRateVariability || 65) + (Math.random() - 0.5) * 4;

    // Apply active simulated anomalies
    if (anomaly === 'hypoxia') {
      targetSpo2 = Math.max(86, Math.min(91, targetSpo2 - 0.6));
      targetResp = Math.min(26, targetResp + 0.5);
      targetHR = Math.min(110, targetHR + 1.2);
    } else if (anomaly === 'cardiac_arrhythmia') {
      targetHR = Math.min(145, Math.max(122, targetHR + (Math.random() - 0.45) * 8));
      targetSys = Math.min(155, targetSys + 1.5);
      targetDia = Math.min(96, targetDia + 1.0);
      targetHRV = Math.max(22, targetHRV - 5);
    } else if (anomaly === 'acute_fatigue') {
      targetHRV = Math.max(25, targetHRV - 2);
    } else {
      // Nominal restoration pull toward baseline
      targetHR += (baseline.restingHeartRate - targetHR) * 0.08;
      targetSys += (baseline.systolicBP - targetSys) * 0.08;
      targetDia += (baseline.diastolicBP - targetDia) * 0.08;
      targetSpo2 += (baseline.spo2 - targetSpo2) * 0.1;
      targetTemp += (baseline.temperature - targetTemp) * 0.05;
      targetResp += (baseline.respiratoryRate - targetResp) * 0.08;
      targetHRV += (baseline.baselineHRV - targetHRV) * 0.08;
    }

    return {
      timestamp: timeStr,
      heartRate: Math.round(targetHR),
      bloodPressureSystolic: Math.round(targetSys),
      bloodPressureDiastolic: Math.round(targetDia),
      oxygenSaturation: Math.min(100, Math.max(80, Math.round(targetSpo2))),
      temperature: Number(targetTemp.toFixed(1)),
      respiratoryRate: Math.max(8, Math.round(targetResp)),
      heartRateVariability: Math.max(15, Math.round(targetHRV))
    };
  }

  /**
   * Updates radiation telemetry if solar flare anomaly is active
   */
  static updateRadiationState(
    current: RadiationData,
    anomaly: SystemSettings['activeAnomalyInjection']
  ): RadiationData {
    if (anomaly === 'solar_flare') {
      return {
        ...current,
        solarParticleActivity: 'solar_particle_event_alert',
        dailyDoseMicroSv: 5400, // 5.4 mSv/day (storm intensity)
        gcrFluxRate: 142.5,
        cumulativeMissionDoseMSv: Number((current.cumulativeMissionDoseMSv + 0.05).toFixed(2)),
        careerDoseMSv: Number((current.careerDoseMSv + 0.05).toFixed(2))
      };
    } else {
      return {
        ...current,
        solarParticleActivity: 'nominal',
        dailyDoseMicroSv: 480,
        gcrFluxRate: 20.2
      };
    }
  }
}
