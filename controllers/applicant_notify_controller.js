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
    app.get('/applicant_notify', function (req, res) {
        sess = req.session;
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var record_1, record_2;
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM applicant_postion_exam WHERE email="' + sess.email + '";',
                    function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                        record_1 = rows;
                    });
            }).then(function (rows) {
                new Promise(function (resolve, reject) {
                    connection.query('SELECT * FROM applicant_exam WHERE email="' + sess.email + '" ORDER BY examid;',
                        function (err, rows, field) {
                            if (err) {
                                return reject;
                            }
                            resolve(rows);
                            record_2 = rows;
                        });
                }).then(function (rows) {
                    new Promise(function (resolve, reject) {
                        connection.query('SELECT * FROM exam;', function (err, rows, field) {
                            if (err) {
                                return reject;
                            }
                            resolve(rows);
                        });
                    }).then(function (rows) {
                        res.render('applicant_notify', { sess: sess, exams: record_1, candidates: record_2, exam: rows });
                    }).catch((err) => setImmediate(() => { throw err; }));
                });
            });
        }
    });
    app.delete('/applicant_notify', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var record = req.body;
            new Promise(function (resolve, reject) {
                connection.query('DELETE FROM applicant_postion_exam WHERE postionid=? AND examid=? AND number=?;',
                    [record.pid, record.eid, record.order], function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
            }).then(function (rows) {
                sess.examid = record.eid;
                res.send("sucess");
                res.end();
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
};