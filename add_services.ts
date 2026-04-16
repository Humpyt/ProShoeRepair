import { pool } from './server/database.ts';

const services = [
  ['srv_heel', 'Heel', 25000, 'repair'],
  ['srv_heel_fix', 'Heel Fix', 30000, 'repair'],
  ['srv_zipper', 'Zipper', 25000, 'repair'],
  ['srv_glue', 'Glue', 10000, 'repair'],
  ['srv_stitch', 'Stitch', 20000, 'repair'],
  ['srv_insoles', 'Insoles', 20000, 'repair'],
  ['srv_pad', 'Pad', 12000, 'repair'],
  ['srv_elastic', 'Elastic', 15000, 'repair'],
  ['srv_hardware', 'Hardware', 20000, 'repair'],
  ['srv_misc', 'Misc', 15000, 'repair'],
  ['srv_heels', 'Heels', 25000, 'repair'],
  ['srv_half_soles', 'Half Soles', 25000, 'repair'],
  ['srv_sole_guard', 'Sole Guard', 20000, 'repair'],
  ['srv_dye', 'Dye', 35000, 'dyeing'],
  ['srv_shine', 'Shine', 15000, 'repair'],
  ['srv_waterproof', 'Waterproof', 20000, 'repair'],
  ['srv_clean_service', 'Clean', 25000, 'cleaning'],
];

async function addServices() {
  for (const [id, name, price, cat] of services) {
    try {
      await pool.query(
        'INSERT INTO services (id, name, price, category, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET name = $2, price = $3',
        [id, name, price, cat, 'active']
      );
      console.log('Added:', name);
    } catch (e) {
      console.error('Error adding', name, e);
    }
  }
  await pool.end();
  process.exit(0);
}

addServices();