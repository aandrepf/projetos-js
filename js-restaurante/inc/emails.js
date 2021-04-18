const conn = require('./db');

module.exports = {
    getEmails() {
        return new Promise((res, rej) => {
            conn.query(`
                SELECT * FROM tb_emails ORDER BY id
            `, (err, results) => {
                if(err) { rej(err); } else { res(results) }
            });
        });
    },

    save(req) {
        return new Promise((res, rej) => {
            if (!req.fields.email) { 
                rej('Preencha o email');
            } else {
                conn.query(`
                    INSERT INTO tb_emails (email) VALUE (?)
                `, [req.fields.email],  (err, results) => {
                    if(err) { rej(err.message); } else { res(results) }
                });
            }

        });
    },

    delete(id) {
        return new Promise((res, rej) => {
            conn.query(`
                DELETE FROM tb_emails WHERE id = ?
            `, [id], (err, results) => {
                if(err) { rej(err); } else { res(results) }
            })
        })
    }
}