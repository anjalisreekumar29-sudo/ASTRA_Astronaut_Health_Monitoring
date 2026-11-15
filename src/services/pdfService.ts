import { jsPDF } from 'jspdf';
import {
  AstronautProfile,
  HealthReport,
  VitalsReading,
  RadiationData,
  BoneDensityRecord,
  ImmuneBiomarkers,
  MentalWellnessCheckIn
} from '../types';

export class PDFService {
  static generateHealthReportPDF(
    astronaut: AstronautProfile,
    report: HealthReport,
    currentVitals: VitalsReading,
    radiation: RadiationData,
    bone: BoneDensityRecord,
    immune: ImmuneBiomarkers,
    mental: MentalWellnessCheckIn
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [14, 165, 233]; // Cyan
    const darkBg = [8, 13, 26]; // Deep space
    const textLight = [241, 245, 249];
    const textMuted = [148, 163, 184];
    const accentBorder = [30, 41, 59];

    // Page Background
    doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
    doc.rect(0, 0, 210, 297, 'F');

    // Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 36, 'F');

    // NASA / ASTRA Header
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('ASTRA // NASA SPACE APPS CHALLENGE 2026', 15, 14);

    doc.setFontSize(10);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('ASTRONAUT SMART TRACKING AND RISK ANALYSIS SYSTEM', 15, 20);
    doc.text('AEROSPACE MEDICAL DIVISION - GATEWAY TELEMETRY DESK', 15, 26);

    // Official Stamp Box
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(145, 8, 52, 22, 2, 2, 'D');
    doc.setFontSize(8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('CLASSIFICATION: UNCLASSIFIED', 148, 14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textLight[0], textLight[1], textLight[2]);
    doc.text(`SOL ${astronaut.missionDay} // MET`, 148, 20);
    doc.text(`DATE: ${report.reportDate}`, 148, 25);

    // Astronaut Profile Card Box
    doc.setFillColor(17, 24, 39);
    doc.roundedRect(15, 42, 180, 32, 2, 2, 'F');
    doc.setDrawColor(accentBorder[0], accentBorder[1], accentBorder[2]);
    doc.roundedRect(15, 42, 180, 32, 2, 2, 'D');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textLight[0], textLight[1], textLight[2]);
    doc.text(`CREW MEMBER: ${astronaut.rank} ${astronaut.name} (${astronaut.callsign})`, 20, 50);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`ROLE: ${astronaut.role}`, 20, 57);
    doc.text(`MISSION: ${astronaut.missionName}`, 20, 64);
    doc.text(`AGENCY: ${astronaut.agency} | BLOOD: ${astronaut.bloodType} | AGE: ${astronaut.age}`, 20, 71);

    // Overall Readiness Score Dial
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(152, 46, 38, 24, 2, 2, 'F');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${report.overallReadinessScore}%`, 160, 58);
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('READINESS INDEX', 154, 65);

    // Section 1: Real-time Telemetry Snapshot
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('1. PHYSIOLOGICAL TELEMETRY VITALS', 15, 83);

    doc.setFillColor(17, 24, 39);
    doc.roundedRect(15, 86, 180, 24, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);

    doc.text('HEART RATE', 20, 93);
    doc.text('BLOOD PRESSURE', 55, 93);
    doc.text('SpO2 SATURATION', 95, 93);
    doc.text('CORE TEMP', 135, 93);
    doc.text('RESPIRATORY RATE', 162, 93);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textLight[0], textLight[1], textLight[2]);
    doc.text(`${currentVitals.heartRate} BPM`, 20, 102);
    doc.text(`${currentVitals.bloodPressureSystolic}/${currentVitals.bloodPressureDiastolic} mmHg`, 55, 102);
    doc.text(`${currentVitals.oxygenSaturation}%`, 95, 102);
    doc.text(`${currentVitals.temperature} °C`, 135, 102);
    doc.text(`${currentVitals.respiratoryRate} /min`, 162, 102);

    // Section 2: Physical & Subsystem Health Breakdown
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('2. MULTI-SYSTEM SPECIALTY CLINICAL METRICS', 15, 119);

    doc.setFillColor(17, 24, 39);
    doc.roundedRect(15, 122, 180, 36, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

    doc.text('CARDIOVASCULAR', 20, 129);
    doc.text('BONE DENSITY (DEXA)', 65, 129);
    doc.text('IMMUNOLOGY', 110, 129);
    doc.text('RADIATION DOSIMETRY', 155, 129);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textLight[0], textLight[1], textLight[2]);
    doc.text(`Cardio Score: ${report.cardiovascularScore}/100`, 20, 136);
    doc.text(`Resting HR: ${currentVitals.heartRate} bpm`, 20, 142);
    doc.text(`HRV: ${currentVitals.heartRateVariability || 65} ms`, 20, 148);

    doc.text(`Femoral T: ${bone.femoralNeckTScore}`, 65, 136);
    doc.text(`Spine T: ${bone.lumbarSpineTScore}`, 65, 142);
    doc.text(`Loss: ${bone.monthlyLossRatePct}%/mo`, 65, 148);

    doc.text(`WBC: ${immune.whiteBloodCellCount} k/uL`, 110, 136);
    doc.text(`NLR: ${immune.neutrophilLymphocyteRatio}`, 110, 142);
    doc.text(`Cortisol: ${immune.salivaryCortisol} ug/dL`, 110, 148);

    doc.text(`Daily: ${radiation.dailyDoseMicroSv} uSv`, 155, 136);
    doc.text(`Mission: ${radiation.cumulativeMissionDoseMSv} mSv`, 155, 142);
    doc.text(`SPE: ${radiation.solarParticleActivity}`, 155, 148);

    // Section 3: Mental Health & Behavioral Wellness
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('3. PSYCHOLOGICAL & SLEEP ARCHITECTURE REVIEW', 15, 168);

    doc.setFillColor(17, 24, 39);
    doc.roundedRect(15, 171, 180, 26, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Sleep Duration: ${mental.sleepHours} hrs (${mental.sleepQualityRating}% efficiency)`, 20, 178);
    doc.text(`Sleep Architecture: REM ${mental.remSleepPct}% | Deep ${mental.deepSleepPct}% | Light ${mental.lightSleepPct}%`, 20, 184);
    doc.text(`Cognitive Vigilance (PVT): ${mental.pvtReactionTimeMs} ms | Stress: ${mental.stressRating}/10 | Mood: ${mental.moodRating}/10`, 20, 190);

    // Section 4: AI Health Intelligence Summary
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('4. ASTRA AI INTELLIGENCE & FLIGHT SURGEON SYNTHESIS', 15, 206);

    doc.setFillColor(17, 24, 39);
    doc.roundedRect(15, 209, 180, 48, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textLight[0], textLight[1], textLight[2]);

    const splitSummary = doc.splitTextToSize(report.summaryNotes, 170);
    doc.text(splitSummary, 20, 216);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('PRESCRIBED COUNTERMEASURES:', 20, 232);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textLight[0], textLight[1], textLight[2]);
    report.keyActionItems.forEach((item, index) => {
      doc.text(`• ${item}`, 20, 238 + (index * 5));
    });

    // Medical Disclaimer Footer
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      'NOTICE: Simulated telemetry data for NASA Space Apps Challenge demonstration. Does not substitute formal clinical diagnosis.',
      15,
      275
    );
    doc.text('OFFICIAL TELEMETRY ARCHIVE // ASTRO-MED-GATEWAY-2026', 15, 280);

    // Save PDF
    doc.save(`ASTRA_Medical_Report_${astronaut.callsign}_SOL_${astronaut.missionDay}.pdf`);
  }
}
