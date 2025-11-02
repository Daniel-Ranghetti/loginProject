#!/bin/sh
set -e

# Opcional: esperar pelo banco (simples, espera até 60s)
# Note: este loop usa pings TCP simples; para checks mais robustos usar wait-for-it, dockerize ou pg_isready.
if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL definida, aguardando DB (se necessário)..."
  i=0
  # extrai host:porta de DATABASE_URL simples postgres://user:pass@host:port/db
  host=$(echo $DATABASE_URL | sed -E 's#.*@([^:/]+).*#\1#' || true)
  port=$(echo $DATABASE_URL | sed -E 's#.*:([0-9]+)/.*#\1#' || true)
  if [ -n "$host" ] && [ -n "$port" ]; then
    while ! nc -z $host $port >/dev/null 2>&1; do
      i=$((i+1))
      if [ $i -gt 60 ]; then
        echo "Timeout esperando DB em $host:$port"
        break
      fi
      sleep 1
    done
  fi

  echo "Rodando npx prisma generate (se aplicável)..."
  npx prisma generate || true

  # Se PRISMA_MIGRATE=deploy, aplica migrations no startup (bom para produção escalável)
  if [ "$PRISMA_MIGRATE" = "deploy" ]; then
    echo "Aplicando migrations: npx prisma migrate deploy"
    npx prisma migrate deploy
  fi
fi

# Executa o CMD dado no Dockerfile
exec "$@"