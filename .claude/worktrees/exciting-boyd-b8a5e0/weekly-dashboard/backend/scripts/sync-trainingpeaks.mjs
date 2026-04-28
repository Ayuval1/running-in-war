import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { getAthleteWorkouts } from '../utils/tp-client.mjs';

dotenv.config();

const DATA_FILE = process.env.DATA_FILE || './data/training-data.json';

function groupWorkoutsByWeek(workouts, weeks = 12) {
  const weeks_data = [];
  const now = new Date();

  for (let i = 0; i < weeks; i++) {
    const weekEnd = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
    const weekStart = new Date(weekEnd.getTime() - (6 * 24 * 60 * 60 * 1000));

    const weekWorkouts = workouts.filter(w => {
      const wDate = new Date(w.date);
      return wDate >= weekStart && wDate <= weekEnd;
    });

    // Calculate weekly stats
    const tss = weekWorkouts.reduce((sum, w) => sum + (w.tss || 0), 0);
    const mileage = weekWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0);
    const paceValues = weekWorkouts.filter(w => w.pace && w.pace !== '0:00/km').map(w => {
      const [m, s] = w.pace.split(':').map(Number);
      return m * 60 + s;
    });
    const paceAvg = paceValues.length > 0
      ? `${Math.floor(paceValues.reduce((a, b) => a + b) / paceValues.length / 60)}:${String((paceValues.reduce((a, b) => a + b) / paceValues.length) % 60).padStart(2, '0')}/km`
      : 'N/A';

    const cadenceAvg = weekWorkouts.length > 0
      ? Math.round(weekWorkouts.reduce((sum, w) => sum + (w.cadence || 0), 0) / weekWorkouts.length)
      : 0;

    const peakWorkout = weekWorkouts.reduce((peak, w) => w.tss > (peak?.tss || 0) ? w : peak, null);

    weeks_data.push({
      weekNumber: weeks - i,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      tss: Math.round(tss),
      mileage: Math.round(mileage * 10) / 10,
      restingHR: Math.round((weekWorkouts.reduce((sum, w) => sum + (w.restingHR || 0), 0) / (weekWorkouts.length || 1))),
      sleepAvg: 7.5, // TODO: integrate with sleep tracking API if available
      paceAvg,
      cadenceAvg,
      peakWorkout: peakWorkout ? {
        type: peakWorkout.type,
        description: peakWorkout.notes,
        tss: peakWorkout.tss
      } : null
    });
  }

  return weeks_data;
}

async function syncData() {
  console.log('🔄 Syncing TrainingPeaks data...');

  try {
    const workouts = await getAthleteWorkouts(12);
    console.log(`✅ Fetched ${workouts.length} workouts from TrainingPeaks`);

    const weeks = groupWorkoutsByWeek(workouts);

    const data = {
      lastUpdated: new Date().toISOString(),
      weeks,
      targets: {
        weeklyTSS: 80,
        weeklyMileage: 60,
        sleepTarget: 8
      }
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Data saved to ${DATA_FILE}`);

  } catch (err) {
    console.error('❌ Sync failed:', err.message);
    process.exit(1);
  }
}

syncData();
