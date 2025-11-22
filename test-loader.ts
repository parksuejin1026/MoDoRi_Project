import fs from 'fs';
import path from 'path';
import { loadRuleDataFromSheet } from './lib/google-sheet-loader';

// Manually load .env.local
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('='); // Rejoin in case value contains =
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); // Remove quotes if any
        }
    });
}

async function main() {
    console.log("Testing loadRuleDataFromSheet...");
    try {
        const result = await loadRuleDataFromSheet('dongyang');
        console.log("Result:", result.substring(0, 100) + "...");
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
