import 'dotenv/config';
import app from './src/app.js';
import { cleanupExpiredTokens } from './src/utils/tokenCleanup.js';
import dns from 'dns';

// changing dns because of db not connected
dns.setServers(['1.1.1.1', '8.8.8.8']);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`server is running on http://localhost:${PORT}`);
    
    // Purge any tokens that expired while the server was asleep or offline
    await cleanupExpiredTokens();

    // In case the instance stays alive continuously, schedule a daily sweep
    setInterval(() => {
        cleanupExpiredTokens();
    }, 24 * 60 * 60 * 1000);
});