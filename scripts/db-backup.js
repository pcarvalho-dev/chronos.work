import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTAINER = 'chronos_work_db';
const DB_USER = process.env.DB_USERNAME || 'postgres';
const DB_NAME = process.env.DB_DATABASE || 'chronos_work';
const SEED_FILE = join(__dirname, 'seed.sql');

try {
  const running = execSync('docker ps --format "{{.Names}}"', { encoding: 'utf-8' });
  if (!running.includes(CONTAINER)) {
    console.error(`Erro: Container '${CONTAINER}' nao esta rodando.`);
    console.error('Inicie com: docker-compose up -d postgres');
    process.exit(1);
  }

  console.log(`Fazendo backup do banco '${DB_NAME}'...`);

  const dump = execSync(
    `docker exec ${CONTAINER} pg_dump -U ${DB_USER} -d ${DB_NAME} --no-owner --no-privileges --clean --if-exists`,
    { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
  );

  writeFileSync(SEED_FILE, dump, 'utf-8');
  const lines = dump.split('\n').length;
  console.log(`Backup salvo em scripts/seed.sql (${lines} linhas)`);
} catch (err) {
  console.error('Erro ao fazer backup:', err.message);
  process.exit(1);
}
