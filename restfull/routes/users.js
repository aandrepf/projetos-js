module.exports = (app) => {
    app.get('/users', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            users: [{
                name: 'André Figueiredo',
                email: 'figueiredoaphilippe@gmail.com'
            }]
        });
    });
    
    app.get('/users/admin', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            users: []
        });
    });
};
