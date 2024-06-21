import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Function to seed data
async function seed() {
  try {
    const tables = ['categories', 'users', 'products', 'carts', 'orders', 'reviews', 'wishlists'];

    for (const table of tables) {
      const sqlFilePath = path.join(__dirname, `amoure_${table}.sql`);
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      await prisma.$executeRawUnsafe(sqlContent);
      if (table === 'wishlists') {
        continue;
      }
      await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), coalesce(max(id)+1, 1), false) FROM "${table}";`);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}

// Run the seed function
seed();
