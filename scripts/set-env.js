const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

function readEnvVar(key) {
  if (process.env[key]) return process.env[key];
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(new RegExp(`^${key}=(.+)$`, 'm'));
    if (match) return match[1].trim();
  }
  return null;
}

const apiUrl = readEnvVar('API_BASE_URL');
const kcUrl = readEnvVar('KEYCLOAK_URL');
const kcRealm = readEnvVar('KEYCLOAK_REALM');
const kcClientId = readEnvVar('KEYCLOAK_CLIENT_ID');

if (!apiUrl) {
  console.log('No API_BASE_URL set — using default from environment.ts');
  process.exit(0);
}

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  keycloak: {
    url: '${kcUrl || 'http://localhost:9090'}',
    realm: '${kcRealm || 'bookworms'}',
    clientId: '${kcClientId || 'bookworms-client'}',
  },
};
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts'),
  content,
  'utf-8'
);
console.log('environment.prod.ts generated');
