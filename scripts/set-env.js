const fs = require('fs');
const path = require('path');

let apiUrl = process.env['API_BASE_URL'];

if (!apiUrl) {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^API_BASE_URL=(.+)$/m);
    if (match) {
      apiUrl = match[1].trim();
    }
  }
}

if (!apiUrl) {
  console.log('No API_BASE_URL set — using default from environment.ts');
  process.exit(0);
}

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts'),
  content,
  'utf-8'
);
console.log(`environment.prod.ts generated with API_BASE_URL: ${apiUrl}`);
