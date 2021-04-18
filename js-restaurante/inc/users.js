var conn = require('./db');

module.exports = {
    render(req, res, error) {
        res.render('admin/login', {
            body: req.body,
            error
        });
    },
    login(email, password) {
        return new Promise((res, rej) => {
            conn.query(
                'SELECT * from tb_users WHERE email = ?',
                [
                    email
                ],
                (err, results) => {
                    if (err) {
                        rej(err);
                    } else {
                        if(!results.length > 0) {
                            rej('Usuário ou senha incorretos.');
                        } else {
                            let row = results[0];
                            if(row.password !== password) {
                                rej('Usuário ou senha incorretos')
                            } else {
                                res(row);
                            }
                        }
                    }
                    
                }
            );
        })
    },
    getUsers() {
        return new Promise((res, rej) => {
            conn.query(`
                SELECT * FROM tb_users ORDER BY id
            `, (err, results) => {
                if(err) { rej(err); } else { res(results) }
            });
        })
    },
    save(fields) {
        return new Promise((res, rej) => {
            let query;
            let params = [fields.name, fields.email];

            if (+fields.id > 0) {
                params.push(fields.id);
                query = `
                    UPDATE tb_users
                    SET name = ?,
                        email = ?
                    WHERE id = ?
                `;
            } else {
                query = `
                    INSERT INTO tb_users (name, email, password)
                    VALUES (?, ?, ?)
                `;
                params.push(fields.password);
            }

            conn.query(query, params, (err, results) => {
                if(err) { rej(err); } else { res(results) }
            });
        });
    },
    delete(id) {
        return new Promise((res, rej) => {
            conn.query(`
                DELETE FROM tb_users WHERE id = ?
            `, [id], (err, results) => {
                if(err) { rej(err); } else { res(results) }
            })
        })
    },
    changePassword(req) {
        return new Promise((res, rej) => {
            if(!req.fields.password) {
                rej('Preencha a senha');
            } else if (req.fields.password !== req.fields.passwordConfirm) {
                rej('Confirme a senha corretamente')
            } else {
                conn.query(`
                    UPDATE tb_users
                    SET password = ?
                    WHERE id = ?
                `, [req.fields.password, req.fields.id], (err, results) => {
                    if(err) { rej(err.message); } else { res(results) }
                });
            }
        });
    }
}