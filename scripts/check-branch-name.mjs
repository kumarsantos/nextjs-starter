import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const allowedTypes = [
  'feature',
  'fix',
  'hotfix',
  'chore',
  'refactor',
  'docs',
  'style',
  'perf',
  'test',
  'build',
  'revert',
];
export const exemptBranches = ['main', 'master', 'develop', 'stage', 'release', 'test'];

export function isValidBranchName(branch) {
  if (exemptBranches.includes(branch)) return true;
  return allowedTypes.some((type) => branch === type || branch.startsWith(`${type}/`));
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();

  if (isValidBranchName(branch)) {
    process.exit(0);
  }

  console.error(
    `\nBranch name "${branch}" does not follow convention.\n` +
      `Allowed prefixes: ${allowedTypes.join(', ')}\n` +
      `Examples: feature/timesheet-grid, chore/lint-setup, fix/expense-calc, refactor/api-client\n`
  );
  process.exit(1);
}
