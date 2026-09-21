import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { isValidBranchName } from './check-branch-name.mjs';

const protectedRefs = [
  'refs/heads/main',
  'refs/heads/master',
  'refs/heads/develop',
  'refs/heads/staging',
  'refs/heads/release',
];

const stdin = readFileSync(0, 'utf8').trim();
if (!stdin) {
  process.exit(0);
}

const pushes = stdin
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [localRef, , remoteRef] = line.split(/\s+/);
    return { localRef, remoteRef };
  });

const branchPushes = pushes.filter(({ remoteRef }) => remoteRef.startsWith('refs/heads/'));
const invalidNames = branchPushes
  .map(({ remoteRef }) => remoteRef.replace('refs/heads/', ''))
  .filter((name) => !isValidBranchName(name));

if (invalidNames.length > 0) {
  console.error(
    `\n[push-guard] Branch name(s) do not follow convention: ${invalidNames.join(', ')}\n` +
      `Use prefixes like feature/, fix/, hotfix/, chore/, refactor/ (see scripts/check-branch-name.mjs).\n`
  );
  process.exit(1);
}

const blocked = branchPushes.filter(({ remoteRef }) => protectedRefs.includes(remoteRef));

if (blocked.length > 0) {
  console.error(
    `\n[push-guard] Direct push to protected branch(es) is blocked: ${blocked
      .map(({ remoteRef }) => remoteRef.replace('refs/heads/', ''))
      .join(', ')}\n` +
      `Push a feature branch to origin and open a Pull Request into main instead.\n`
  );
  process.exit(1);
}

execSync('pnpm check', { stdio: 'inherit', shell: true });
