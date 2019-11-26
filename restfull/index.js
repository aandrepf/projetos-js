const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

consign().include('routes').into(app);

app.listen(3000, 'localhost', () => {
    console.log('server rodando!');
});
