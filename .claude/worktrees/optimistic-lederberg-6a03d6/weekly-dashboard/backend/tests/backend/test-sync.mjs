import fs from 'fs';
import path from 'path';

async function testSyncOutput() {
  const dataFile = path.join(process.cwd(), 'data/training-data.json');

  if (!fs.existsSync(dataFile)) {
    console.error('❌ Data file not found after sync');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

  if (!data.weeks || !Array.isArray(data.weeks)) {
    console.error('❌ Invalid data structure, missing weeks array');
    process.exit(1);
  }

  if (data.weeks.length !== 12) {
    console.error(`❌ Expected 12 weeks, got ${data.weeks.length}`);
    process.exit(1);
  }

  const week = data.weeks[0];
  const requiredFields = ['weekNumber', 'startDate', 'endDate', 'tss', 'mileage', 'restingHR', 'sleepAvg', 'paceAvg', 'cadenceAvg'];

  for (const field of requiredFields) {
    if (!(field in week)) {
      console.error(`❌ Missing field: ${field}`);
      process.exit(1);
    }
  }

  console.log('✅ Sync test passed - data structure valid');
  process.exit(0);
}

testSyncOutput();
