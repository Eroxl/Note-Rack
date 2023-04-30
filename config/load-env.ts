import fs from 'fs';

const envPath = `${__dirname}/.env`;
const clientEnvPath = `${__dirname}/client.env`;

/**
 * Loads the .env file and returns an array of lines
 * @param path The path to the .env file
 * @returns An array of lines from the .env file
 */
const loadEnv = (path: string): string[] => {
  if (!fs.existsSync(path)) {
    throw new Error(`.env file not found at ${path}`);
  }

  const file = fs.readFileSync(path, 'utf8');

  const lines = file.split('\n');

  return lines;
};

/**
 * Parses the .env file and returns an object with the key value pairs
 * @param lines The lines from the .env file
 * @param type The type of the .env file (defined by the <-- start-{{type}}-env --> flag)
 */
const parseEnv = (lines: string[], type?: string): Record<string, string> => {
  const env: Record<string, string> = {};
  const startFlag = `# <-- start-${type}-env -->`;
  const endFlag = `# <-- end-${type}-env -->`;

  let start = type === undefined

  lines.forEach((line) => {
    if (type && line.startsWith(startFlag)) {
      start = true;
      return;
    } else if (type && line.startsWith(endFlag)) {
      start = false;
      return;
    } else if (start && line.includes('=') && !line.startsWith('#')) {
      const [key, ...rest] = line.split('=');
      
      env[key] = rest.join('=')
    }
  });

  return env;
};

/**
 * Write the .env file to the given path
 * @param path The path to write the .env file to
 * @param env The object containing the key value pairs to write to the .env file
 */
const writeEnv = (path: string, env: Record<string, string>): void => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path.split('/').slice(0, -1).join('/'), { recursive: true });
  }

  const lines: string[] = [];

  Object.entries(env).forEach(([key, value]) => {
    lines.push(`${key}=${value}`);
  });

  fs.writeFileSync(path, lines.join('\n'));
};

// -=- Main Program -=-

// ~  Load the .env file
const lines = loadEnv(envPath);
const clientLines = loadEnv(clientEnvPath);

// ~  Parse the .env file
const backendEnv = parseEnv(lines, 'backend');
const frontendEnv = {
  ...parseEnv(lines, 'frontend'),
  ...parseEnv(clientLines),
}

writeEnv(`${__dirname}/../backend/.env`, backendEnv);
writeEnv(`${__dirname}/../web/src/.env.local`, frontendEnv);

console.log('Successfully loaded .env file');