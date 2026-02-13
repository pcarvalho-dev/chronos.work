#!/bin/bash
# ==============================================================================
# docker-init.sh - Inicializa o banco com seed data no primeiro compose up
# Roda automaticamente pelo docker-entrypoint-initdb.d
# ==============================================================================

set -e

echo "=== Chronos.work: Inicializando banco de dados ==="

# Timezone
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SET timezone = 'America/Sao_Paulo';
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL

# Restaura seed se existir
SEED_FILE="/docker-entrypoint-initdb.d/seed.sql"
if [ -f "$SEED_FILE" ]; then
    echo "=== Restaurando seed data... ==="
    psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" < "$SEED_FILE"
    echo "=== Seed data restaurado com sucesso! ==="
else
    echo "=== Nenhum seed.sql encontrado, banco vazio ==="
fi

echo "=== Banco de dados inicializado! ==="
