import fetch from 'node-fetch';

async function seed() {
  await fetch('http://localhost:4001/seed', { method: 'POST' });
  console.log('Seeded basic users/teams.');
}

seed();
