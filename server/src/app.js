import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get('/', (req, res) => {
    console.log('first');
    res.send('Hii from the vaultDrive');
});

// import all the routes here


// use all the routes here


export default app;