require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const analysisRouter = require('./routes/analysis');

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Resume Analyzer API!' });
});

app.use('/api', analysisRouter);


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
