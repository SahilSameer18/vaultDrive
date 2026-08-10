import 'dotenv/config';
import app from './src/app.js';
// import connectToDB from './src/config/database.js';

import dns from 'dns';

//changing dns because of db not connected
dns.setServers(['1.1.1.1', '8.8.8.8']);

app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
});