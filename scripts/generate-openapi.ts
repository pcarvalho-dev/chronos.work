import { generateOpenApiDocument } from '../src/utils/openapi-generator.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openApiDoc = generateOpenApiDocument();

const outputPath = join(__dirname, '..', 'openapi.json');
writeFileSync(outputPath, JSON.stringify(openApiDoc, null, 2), 'utf-8');

console.log('✅ OpenAPI documentation generated successfully at:', outputPath);
