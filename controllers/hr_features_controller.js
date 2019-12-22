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
    app.get('/hr_features', function (req, res) {
        sess = req.session;
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM exam;',
                    function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
            }).then(function (rows) {
                res.render('hr_features', { data: rows });
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
    app.post('/hr_features', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            new Promise(function (resolve, reject) {
                var upexam = req.body;
                connection.query('UPDATE exam SET examtype = ? where examid = ?;',
                    [upexam.examtype, upexam.id], function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }

                        resolve(rows);
                    });
            }).then(function (rows) {
                res.render('hr_features', { data: rows });
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
    app.put('/hr_features', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            new Promise(function (resolve, reject) {
                var upexam = req.body;
                connection.query('INSERT INTO exam (examtype) VALUES (?) ;',
                    [upexam.examtype], function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
            }).then(function (rows) {
                res.render('hr_features', { data: rows });
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
    app.delete('/hr_features', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var upexam = req.body;
            new Promise(function (resolve, reject) {
                connection.query('Select qid From questions WHERE examid =(?);',
                    [upexam.id], function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                        for (var i = 0; i < rows.length; i++) {
                            connection.query('Delete From answers WHERE qid =(?);',
                                [rows[i].qid]);
                            connection.query('Delete From questions WHERE qid =(?);',
                                [rows[i].qid]);
                        }
                    });
            }).then(function (rows) {
                new Promise(function (resolve, reject) {
                    connection.query('DELETE FROM exam WHERE examid =(?);',
                        [upexam.id], function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                        });
                }).catch((err) => setImmediate(() => { throw err; }));
            });
        }
    });
};