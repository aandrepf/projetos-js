var express = require('express');
var moment = require('moment');

var router = express.Router();

moment.locale('pt-BR');

var users = require('./../inc/users');
var admins = require('../inc/admins');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');
const { connect } = require('../inc/db');

module.exports = function(io) {
    // middlewate de controle de rotas do admin
    router.use(function(req, res, next) {
        var listRoutes = ['/login'];

        if(listRoutes.indexOf(req.url) === -1 && !req.session.user) {
            res.redirect('/admin/login');
        } else {
            next();
        }
    });

    // middleware para montar os menus laterais da area de admin
    router.use(function(req, res, next) {
        req.menus = admins.getAdminMenus(req);
        next();
    })

    router.get('/', function(req, res, next) {
        admins.adminDashBoard().then(data => {
            res.render('admin/index', admins.getAdminParams(req, {
                data
            }));
        }).catch(err => {
            console.error(err);
        });
    });

    /* DASHBOARD ADMIN */
    router.get('/dashboard', function(req, res, nex) {
        reservations.dashboard().then(data => {
            res.send(data);
        });
    })  

    /* LOGIN E LOGOUT */
    router.get('/login', function(req, res, next) {
        users.render(req, res, null);
    });

    router.post('/login', function(req, res, next) {
        if (!req.body.email) {
            users.render(req, res, 'Preencha o campo email.');
        } else if (!req.body.password) { 
            users.render(req, res, 'Preencha o campo senha.');
        } else {
            users.login(req.body.email, req.body.password).then(user => {
                req.body = {};
                req.session.user = user;
                res.redirect('/admin');
            }).catch(error => {
                users.render(req, res, error.message || error);     
            });
        }
    });

    router.get('/logout', function(req, res, mext) {
        delete req.session.user;
        res.redirect('/admin/login');
    });

    /* CONTATOS */
    router.get('/contacts', function(req, res, next) {
        contacts.getContacts().then(data => {
            res.render('admin/contacts', admins.getAdminParams(req, { contatos: data }));
        }).catch(err => res.send(err));
    });

    router.delete('/contacts/:id', function(req, res, next) {
        contacts.delete(req.params.id).then(result => {
            res.send(result);
            io.emit('dashboard update');
        }).catch(err => res.send(err));
    });

    /* EMAILS */
    router.get('/emails', function(req, res, next) {
        emails.getEmails().then(data => {
            res.render('admin/emails', admins.getAdminParams(req, { emails: data }));
        }).catch(err => res.send(err));
    });

    router.delete('/emails/:id', function(req, res, next) {
        emails.delete(req.params.id).then(result => {
            res.send(result);
        }).catch(err => res.send(err));
    });

    /* MENUS/CARDAPIOS */
    router.get('/menus', function(req, res, next) {
        menus.getMenus().then(data => {
            res.render('admin/menus', admins.getAdminParams(req, { cardapios: data }));
        }).catch(err => res.send(err));
    });

    router.post('/menus', function(req, res, next) {
        menus.save(req.fields, req.files).then(ret => {
            res.send(ret);
            io.emit('dashboard update');
        }).catch(err => res.send(err));
    });

    router.delete('/menus/:id', function(req, res, next) {
        menus.delete(req.params.id).then(result => {
            res.send(result);
            io.emit('dashboard update');
        }).catch(err => res.send(err));
    });

    /* RESERVAS */
    router.get('/reservations', function(req, res, next) {
        let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
        let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

        reservations.getReservations(req).then(pag => {
            res.render('admin/reservations', admins.getAdminParams(req, { 
                date: { start, end }, 
                reservas: pag.data, 
                moment,
                links: pag.links
            }));
        }).catch(err => res.send(err));
    });

    router.get('/reservations/chart', function(req, res, next) {
        req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
        req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

        reservations.chart(req).then(charData => {
            res.send(charData);
        });
    });

    router.post('/reservations', function(req, res, next) {
        reservations.save(req.fields).then(ret => {
            res.send(ret);
            io.emit('dashboard update');
        }).catch(err => res.send(err));
    });

    router.delete('/reservations/:id', function(req, res, next) {
        reservations.delete(req.params.id).then(result => {
            res.send(result);
            io.emit('dashboard update');
        }).catch(err => res.send(err));
    });

    /* USUÁRIOS */
    router.get('/users', function(req, res, next) {
        users.getUsers().then(data => {
            res.render('admin/users', admins.getAdminParams(req, { users: data }));
        }).catch(err => res.send(err));
    });

    router.post('/users', function(req, res, next) {
        users.save(req.fields).then(ret => {
            res.send(ret);
            io.emit('dashboard update');
        }).catch(err => res.send(err));
    });

    router.post('/users/password-change', function(req, res, next) {
        users.changePassword(req).then(ret => {
            res.send(ret);
        }).catch(err => res.send({ error: err }));
    });

    router.delete('/users/:id', function(req, res, next) {
        users.delete(req.params.id).then(result => {
            res.send(result);
            io.emit('dashboard update');
        }).catch(err => res.send(err));
    });

    return router;
};