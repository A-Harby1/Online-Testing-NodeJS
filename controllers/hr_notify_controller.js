const mysql = require('mysql');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'online_testing'
});
module.exports = function (app) {
    app.get('/hr_notify', function (req, res) {
        sess = req.session;
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var record_1, record_2;
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM applicant_exam;',
                    function (err, rows, field) {
                        if (err) {
                            return reject;
                        }
                        resolve(rows);
                        record_1 = rows;
                    });
            }).then(function (rows) {
                new Promise(function (resolve, reject) {
                    connection.query('SELECT * FROM exam;', function (err, rows, field) {
                        if (err) {
                            return reject;
                        }
                        resolve(rows);
                        record_2 = rows;
                    });
                }).then(function (rows) {
                    res.render('hr_notify', { candidates: record_1, exam: record_2 });
                }).catch((err) => setImmediate(() => { throw err; }));
            });
        }
    });
};