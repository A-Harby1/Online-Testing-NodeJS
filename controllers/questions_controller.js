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
    app.get('/questions', function (req, res) {
        sess = req.session;
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var exams, questions;
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM exam;',
                    function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                        exams = rows;
                    });
            }).then(function (rows) {
                new Promise(function (resolve, reject) {
                    connection.query('SELECT * FROM questions;', function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                        questions = rows;
                    });
                }).then(function (rows) {
                    new Promise(function (resolve, reject) {
                        connection.query('SELECT * FROM answers;', function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                            answers = rows;
                        });
                    }).then(function (rows) {
                        res.render('questions', { exam: exams, questions: questions, answers: answers });
                    }).catch((err) => setImmediate(() => { throw err; }));
                });
            });
        }
    });
    app.post('/questions', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var newdata = req.body;
            if (newdata.addanswer == "true") {
                new Promise(function (resolve, reject) {
                    connection.query('INSERT INTO answers (answer,correct,qid) VALUES (?, ?, ?);',
                        [newdata.answer, newdata.correct, newdata.qid], function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                        });
                }).catch((err) => setImmediate(() => { throw err; }));
            }
            else {
                new Promise(function (resolve, reject) {
                    connection.query('INSERT INTO questions (question,examtype,examid) VALUES (?, ?, ?);',
                        [newdata.question, newdata.examtype, newdata.examid], function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                        });
                }).catch((err) => setImmediate(() => { throw err; }));
            }
        }
    });
    app.delete('/questions', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var deletebody = req.body;
            if (deletebody.delanswer == "true") {
                new Promise(function (resolve, reject) {
                    connection.query('DELETE FROM answers WHERE aid =(?);',
                        [deletebody.aid], function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                        });
                })
            }
            else {
                new Promise(function (resolve, reject) {
                    connection.query('DELETE FROM answers WHERE qid =(?);',
                        [deletebody.qid], function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                        });
                }).then(function (rows) {
                    new Promise(function (resolve, reject) {
                        connection.query('DELETE FROM questions WHERE qid =(?);',
                            [deletebody.qid], function (err, rows, fields) {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(rows);
                            });
                    }).catch((err) => setImmediate(() => { throw err; }));
                });
            }
        }
    });
    app.put('/questions', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            new Promise(function (resolve, reject) {
                var upqis = req.body;
                if (upqis.updanswer == "true") {
                    connection.query('UPDATE answers SET answer = ? AND correct = ? where aid = ?;',
                        [upqis.answer, upqis.correct, upqis.aid], function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                        });
                } else {
                    connection.query('UPDATE questions SET question = ? where qid = ?;',
                        [upqis.question, upqis.qid], function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(rows);
                        });
                }
            }).catch((err) => setImmediate(() => { throw err; }));

        }
    });
};