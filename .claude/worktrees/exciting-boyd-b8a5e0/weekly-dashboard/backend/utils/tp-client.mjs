import fetch from 'node-fetch';

const TP_BASE = process.env.TP_API_BASE || 'https://api.trainingpeaks.com/v2';
const ATHLETE_ID = process.env.TP_ATHLETE_ID;
const API_TOKEN = process.env.TP_API_TOKEN;

function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  };
}

export async function getAthleteWorkouts(weeks = 12) {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);

  const url = `${TP_BASE}/athletes/${ATHLETE_ID}/workouts?from=${startDate.toISOString().split('T')[0]}&to=${endDate.toISOString().split('T')[0]}`;

  const response = await fetch(url, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`TP API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Parse and structure
  return (data || []).map(w => ({
    date: w.workoutDate,
    type: w.workoutType,
    tss: w.tssScore || 0,
    distance: w.distance || 0,
    duration: w.duration || 0,
    pace: w.avgPace || '0:00/km',
    cadence: w.avgCadence || 0,
    restingHR: w.restingHeartRate || 0,
    notes: w.notes || ''
  }));
}

export async function getAthleteRestingHR(date) {
  // Fetch resting HR for specific date if available
  const url = `${TP_BASE}/athletes/${ATHLETE_ID}/wellness?date=${date}`;
  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.restingHeartRate || null;
}
