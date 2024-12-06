import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server/shoerepair.db');

// Delete the existing database file if it exists
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Existing database deleted');
}

// Import database to recreate tables
import './database';
console.log('Database tables recreated');

// Import dummy data
import './add_dummy_data';
console.log('Dummy data imported');

console.log('Database reset complete!');
