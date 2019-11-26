let NeDB = require('nedb');

module.exports = (app) => {
    app.get('/users', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.json({
            users: [{
                id: 1,
                name: 'André Figueiredo',
                email: 'figueiredoaphilippe@gmail.com'
            }]
        });
    });
    
    app.post('/users', (req, res) => {
        res.json(req.body);
    });
};
