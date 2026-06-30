#!/usr/bin/env node

const { readFileSync, readdirSync } = require('fs');
const { join, resolve } = require('path');
const { Client } = require('pg');

const ROOT = resolve(__dirname, '..');
const ENV_PATH = join(ROOT, '.env');
const MIGRATIONS_DIR = join(ROOT, 'database', 'migrations');

function loadEnv() {
  try {
    const content = readFileSync(ENV_PATH, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  } catch {
    // .env is optional — user can set env vars directly
  }
}

function getConnectionString() {
  const url =
    process.env.SUPABASE_DATABASE_URL ||
    process.env.DATABASE_URL;

  if (url) return url;

  const host = process.env.PGHOST;
  const port = process.env.PGPORT || '6543';
  const db = process.env.PGDATABASE || 'postgres';
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;

  if (host && user && password) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}`;
  }

  console.error('');
  console.error('  No database connection found. You need one of:');
  console.error('    1. SUPABASE_DATABASE_URL  (direct connection string)');
  console.error('    2. PGHOST + PGUSER + PGPASSWORD  (individual params)');
  console.error('');
  console.error('  Get your connection string from Supabase Dashboard:');
  console.error('    Project Settings → Database → Connection string → URI');
  console.error('');
  console.error('  Then add to .env:');
  console.error('    SUPABASE_DATABASE_URL=postgresql://...');
  console.error('');
  process.exit(1);
}

function getMigrations() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.error(`No SQL migration files found in ${MIGRATIONS_DIR}`);
    process.exit(1);
  }

  return files;
}

async function ensureMigrationTable(client) {
  await client.query(`
    create table if not exists public._migrations (
      id        serial primary key,
      filename  text   not null unique,
      hash      text   not null,
      applied_at timestamptz not null default now()
    );
  `);
}

function checksum(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

async function getApplied(client) {
  const { rows } = await client.query(
    'select filename, hash from public._migrations order by id'
  );
  return rows;
}

async function applyMigration(client, filename, sql) {
  await client.query(sql);
  const hash = checksum(sql);
  await client.query(
    'insert into public._migrations (filename, hash) values ($1, $2) on conflict (filename) do update set hash = excluded.hash',
    [filename, hash]
  );
}

async function main() {
  loadEnv();

  const connectionString = getConnectionString();
  const files = getMigrations();

  console.log(`\n  Found ${files.length} migration(s) in database/migrations/\n`);

  const client = new Client({ connectionString });
  await client.connect();

  try {
    await ensureMigrationTable(client);
    const applied = await getApplied(client);
    const appliedMap = new Map(applied.map((r) => [r.filename, r]));

    let pending = 0;
    for (const file of files) {
      const already = appliedMap.get(file);
      const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
      const hash = checksum(sql);

      if (already) {
        if (already.hash === hash) {
          console.log(`  [skip] ${file} (already applied)`);
          continue;
        }
        console.log(`  [reapply] ${file} (hash changed)`);
      } else {
        console.log(`  [apply] ${file}`);
      }

      await applyMigration(client, file, sql);
      pending++;
    }

    console.log(`\n  Done. ${pending} migration(s) applied.\n`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(`\n  Migration failed: ${err.message}\n`);
  process.exit(1);
});
