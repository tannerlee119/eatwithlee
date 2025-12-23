/* eslint-disable no-console */
const { spawnSync } = require('node:child_process');

function runPrisma(args) {
  const bin =
    process.platform === 'win32'
      ? 'node_modules\\.bin\\prisma.cmd'
      : 'node_modules/.bin/prisma';

  const result = spawnSync(bin, args, { stdio: 'inherit' });
  return result.status ?? 1;
}

function runPrismaCapture(args) {
  const bin =
    process.platform === 'win32'
      ? 'node_modules\\.bin\\prisma.cmd'
      : 'node_modules/.bin/prisma';

  const result = spawnSync(bin, args, { encoding: 'utf8' });
  const out = `${result.stdout || ''}\n${result.stderr || ''}`;
  return { status: result.status ?? 1, out };
}

// 1) Try normal deploy
let res = runPrismaCapture(['migrate', 'deploy']);
if (res.status === 0) process.exit(0);

// 2) Known case: a failed legacy migration record can block deploys on Postgres (P3009).
// We safely mark the legacy "20251007212821_init" as applied because:
// - the canonical Postgres schema is provided by `prisma/migrations/0_init`
// - `20251007212821_init` is now a no-op and exists only for history ordering
const isP3009 = res.out.includes('P3009') || res.out.includes('found failed migrations');
const mentionsLegacy = res.out.includes('20251007212821_init');

if (isP3009 && mentionsLegacy) {
  console.log('\nDetected failed legacy migration record. Resolving and retrying...\n');
  // Mark as applied (idempotent-ish; if it errors because already applied, that's okay)
  runPrisma(['migrate', 'resolve', '--applied', '20251007212821_init']);
  const retryStatus = runPrisma(['migrate', 'deploy']);
  process.exit(retryStatus);
}

// 3) Unknown failure: surface logs and fail build.
process.exit(res.status);


