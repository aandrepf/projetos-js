let NeDB = require('nedb');
let db = new NeDB({
    filename: 'users.db',
    autoload: true
});

module.exports = (app) => {
    // rota padrão
    let route = app.route('/users');

    // FAZENDO UMA CONSULTA GERAL DOS CADASTROS
    route.get((req, res) => {

        // 1 - ordem crescente, -1 - ordem decrescente
        db.find({}).sort({name: 1}).exec((err, users)=> {
            if(err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.json({
                    users // No ES6 users === users: users, pois tem o mesmo nome
                });
            }

        }) 
        
    });

    // INSERINDO UM CADASTRO NOVO NO BD
    route.post((req, res) => {
        if(!app.utils.validator.user(app, req, res)) return false;
        db.insert(req.body, (err, user)=>{
            if(err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }
        });
    });

    let routeId = app.route('/users/:id');

    // FAZENDO UMA CONSULTA DE UM DETERMINADO ID
    routeId.get((req, res) => {
        db.findOne({ _id: req.params.id}).exec((err, users) => {
            if(err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.json({
                    users // No ES6 users === users: users, pois tem o mesmo nome
                });
            }
        });
    });

    // ATUALIZANDO O CADASTRO DE UM DETERMINADO ID
    routeId.put((req, res) => {
        if(!app.utils.validator.user(app, req, res)) return false;
        db.update({_id: req.params.id}, req.body, err => {
            if(err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(Object.assign(req.params, req.body));
            }
        });
    });

    // REMOVENDO O CADASTRO DE UM DETERMINADO ID
    routeId.delete((req, res) => {
        db.remove({_id: req.params.id}, {}, err => {
            if(err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params);
            }
        });
    });
};
