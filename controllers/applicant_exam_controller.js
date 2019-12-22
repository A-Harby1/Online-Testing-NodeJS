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
    app.get('/applicant_exam', function (req, res) {
        sess = req.session;
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var question, answer;
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM questions WHERE examid=' + sess.examid + ';', function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                    var arr = [];
                    while (arr.length != 5) {
                        var r = Math.floor(Math.random() * rows.length - 1) + 1;
                        arr.push(r);
                        arr = arr.filter(onlyUnique);
                    }
                    question = [rows[arr[0]], rows[arr[1]], rows[arr[2]], rows[arr[3]], rows[arr[4]]];
                });
            }).then(function (rows) {
                new Promise(function (resolve, reject) {
                    connection.query('SELECT * FROM answers;', function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                        answer = rows;
                    });
                }).then(function (rows) {
                    res.render('applicant_exam', { questions_rec: question, answers_rec: answer, sess: sess });
                }).catch((err) => setImmediate(() => { throw err; }));
            });
        }
    });

    app.post('/applicant_exam', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var record1, record2;
            var record = req.body;
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM answers WHERE aid=?;', [record.aid], function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                    record1 = rows[0];
                });
            }).then(function (rows) {
                new Promise(function (resolve, reject) {
                    connection.query('SELECT * FROM applicant_exam WHERE examid=? AND qid=? AND email=?;',
                        [record.examid, record.qid, record.email], function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                            record2 = rows;
                        });
                }).then(function (rows) {
                    new Promise(function (resolve, reject) {
                        if (record2.length == 0) {
                            connection.query('INSERT INTO applicant_exam (examid, qid, aid, correct, email, question, answer) VALUES(?,?,?,?,?,?,?);',
                                [record.examid, record.qid, record.aid, record1.correct, record.email, record.question, record1.answer], function (err, rows, fields) {
                                    if (err) {
                                        return reject(err);
                                    }
                                    resolve(rows);
                                });
                        } else {
                            connection.query('UPDATE applicant_exam SET aid = ?, correct = ?, answer = ? WHERE examid=? AND qid=? AND email=?;',
                                [record.aid, record1.correct, record1.answer, record.examid, record.qid, record.email], function (err, rows, fields) {
                                    if (err) {
                                        return reject(err);
                                    }
                                    resolve(rows);
                                });
                        }
                    }).then(function (rows) {
                        res.send("sucess");
                        res.end();
                    }).catch((err) => setImmediate(() => { throw err; }));
                });
            });
        }
    });
};