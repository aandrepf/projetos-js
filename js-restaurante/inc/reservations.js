var conn = require('./db');
const Pagination = require('./pagination');
var moment = require('moment');

module.exports = {
    render(req, res, error, success) {
        res.render('reservation', {
            title: 'Reservas - Restaurante Saboroso',
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma Mesa!',
            body: req.body,
            error,
            success
        });
    },

    getReservations(req) {
        return new Promise((res, rej) => {

            let page = req.query.page;
            let dtstart = req.query.start;
            let dtend = req.query.end;

            if(!page) page = 1;
        
            let params = [];
            if (dtstart && dtend) params.push(dtstart, dtend);

            let pag = new Pagination(
                `SELECT SQL_CALC_FOUND_ROWS * 
                FROM tb_reservations 
                ${(dtstart && dtend) ? 'WHERE date BETWEEN ? AND ?' : ''}
                ORDER BY name LIMIT ?, ?`,
                params
            );

            pag.getPage(page).then(data => {
                res({
                    data,
                    links: pag.getPageNavigation(req.query)
                })
            });
        });
    },

    save(fields) {
        return new Promise((res, rej) => {
            if (fields.date.indexOf('/') > -1) {
                let date = fields.date.split('/');
                fields.date = `${date[2]}/${date[1]}/${date[0]}`;
            }

            let query;
            let params = [fields.name, fields.email, fields.people, fields.date, fields.time];

            if(+fields.id > 0) {
                query = `
                UPDATE tb_reservations
                SET name = ?, email = ?, people = ?, date = ?, time = ?
                WHERE id = ?`;
                params.push(fields.id);
            } else {
                query = `
                INSERT INTO tb_reservations (name, email, people, date, time)
                VALUES(?, ?, ?, ?, ?)`;
            }
            conn.query(query, params, (err, results) => {
                if(err) { rej(err) } else { res(results); };
            });
        });
    },

    delete(id) {
        return new Promise((res, rej) => {
            conn.query(`
                DELETE FROM tb_reservations WHERE id = ?
            `, [id], (err, results) => {
                if(err) { rej(err); } else { res(results) }
            })
        })
    },

    chart(req) {
        return new Promise((res, rej) => {
            conn.query(`
                SELECT
                    CONCAT(YEAR(date), '-', MONTH(date)) AS date,
                    COUNT(*) AS total,
                    SUM(people) / COUNT(*) as avg_people
                FROM saboroso.tb_reservations
                WHERE
                    date BETWEEN ? AND ?
                GROUP BY YEAR(date) DESC, MONTH(date) DESC
                ORDER BY YEAR(date) DESC, MONTH(date) DESC;
            `, [req.query.start, req.query.end], (err, results) => {
                if (err) { rej(err) } else {
                    let month = [];
                    let values = [];

                    results.forEach(row => {
                        month.push(moment(row.date).format('MMM YYYY'));
                        values.push(row.total);
                    });

                    res({
                        month, values
                    });
                }
            })
        });
    }, 
    
    dashboard() {
        return new Promise((res, rej) => {
            conn.query(`
            SELECT
                (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                (SELECT COUNT(*) FROM tb_users) AS nrusers;
            `, (err, results) => {
                if(err) { rej(err); } else { res(results[0]) }
            });
        });
    }
}