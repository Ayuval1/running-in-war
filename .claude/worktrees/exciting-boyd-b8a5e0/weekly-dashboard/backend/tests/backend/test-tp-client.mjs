import { getAthleteWorkouts } from '../../utils/tp-client.mjs';

async function testAthleteData() {
  try {
    const workouts = await getAthleteWorkouts(12); // 12 weeks
    console.log('✅ Fetched workouts:', workouts.length);
    if (workouts.length === 0) {
      console.error('❌ No workouts returned');
      process.exit(1);
    }
    // Check structure
    const workout = workouts[0];
    if (!workout.date || !workout.tss || !workout.distance) {
      console.error('❌ Missing expected fields:', Object.keys(workout));
      process.exit(1);
    }
    console.log('✅ Data structure valid');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testAthleteData();
