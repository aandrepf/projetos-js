const conn = require('./db');

module.exports = {
    render(req, res, error, success) {
        res.render('contact', {
            title: 'Contato - Restaurante Saboroso',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga um oi!',
            body: req.body,
            error,
            success
          });
    },

    getContacts() {
        return new Promise((res, rej) => {
            conn.query(`
                SELECT * FROM tb_contacts ORDER BY id
            `, (err, results) => {
                if(err) { rej(err); } else { res(results) }
            });
        })
    },

    save(fields) {
        return new Promise((res, rej) => {
            conn.query(`
            INSERT INTO tb_contacts (name, email, message)
            VALUES(?, ?, ?)`,
            [
                fields.name,
                fields.email,
                fields.message
            ], (err, results) => {
                if(err) rej(err);
                res(results);
            });
        });
    },

    delete(id) {
        return new Promise((res, rej) => {
            conn.query(`
                DELETE FROM tb_contacts WHERE id = ?
            `, [id], (err, results) => {
                if(err) { rej(err); } else { res(results) }
            })
        })
    }
}