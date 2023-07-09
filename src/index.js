const express = require('express');

const  app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Hello, sunshine!</h1>');
});

app.listen(PORT, () => {
    console.log('API is listening on port ', PORT);
});