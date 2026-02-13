import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTAINER = 'chronos_work_db';
const DB_USER = process.env.DB_USERNAME || 'postgres';
const DB_NAME = process.env.DB_DATABASE || 'chronos_work';
const SEED_FILE = join(__dirname, 'seed.sql');

try {
  if (!existsSync(SEED_FILE)) {
    console.error('Erro: Arquivo seed.sql nao encontrado em scripts/');
    console.error("Execute 'npm run db:backup' primeiro para criar o backup.");
    process.exit(1);
  }

  const running = execSync('docker ps --format "{{.Names}}"', { encoding: 'utf-8' });
  if (!running.includes(CONTAINER)) {
    console.error(`Erro: Container '${CONTAINER}' nao esta rodando.`);
    console.error('Inicie com: docker-compose up -d postgres');
    process.exit(1);
  }

  console.log(`Resetando banco '${DB_NAME}' com dados do seed.sql...`);

  // Encerra conexões ativas
  try {
    execSync(
      `docker exec ${CONTAINER} psql -U ${DB_USER} -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();"`,
      { stdio: 'ignore' }
    );
  } catch {
    // ignora se não houver conexões
  }

  // Dropa e recria o banco
  execSync(`docker exec ${CONTAINER} psql -U ${DB_USER} -d postgres -c "DROP DATABASE IF EXISTS \\"${DB_NAME}\\";"`, { stdio: 'inherit' });
  execSync(`docker exec ${CONTAINER} psql -U ${DB_USER} -d postgres -c "CREATE DATABASE \\"${DB_NAME}\\";"`, { stdio: 'inherit' });

  // Restaura o seed via stdin
  execSync(`docker exec -i ${CONTAINER} psql -U ${DB_USER} -d ${DB_NAME}`, {
    input: readFileSync(SEED_FILE, 'utf-8'),
    stdio: ['pipe', 'inherit', 'inherit'],
    maxBuffer: 50 * 1024 * 1024,
  });

  console.log('Banco resetado com sucesso!');
} catch (err) {
  console.error('Erro ao resetar o banco:', err.message);
  process.exit(1);
}
