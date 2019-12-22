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
    app.get('/hr_home', function (req, res) {
        sess = req.session;
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var record1, record2;
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM postion_applicant;', function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                    record1 = rows;
                });
            }).then(function (rows) {
                new Promise(function (resolve, reject) {
                    connection.query('SELECT * FROM exam;', function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                        record2 = rows;
                    });
                }).then(function (rows) {
                    res.render('hr_home', { record: record1, exam: record2 });
                }).catch((err) => setImmediate(() => { throw err; }));
            });
        }
    });
    app.post('/hr_home', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var records = req.body;
            new Promise(function (resolve, reject) {
                connection.query('INSERT INTO applicant_postion_exam (email,postionid,postionname,examid,examtype,deadline,number)VALUES(?,?,?,?,?,?,?),(?,?,?,?,?,?,?),(?,?,?,?,?,?,?);',
                    [records['record1[email]'], records['record1[pid]'], records['record1[name]'], records['record1[eid]'], records['record1[examtype]'], ((records['record1[deadline]'] == '') ? null : records['record1[deadline]']), records['record1[seq]'],
                    records['record2[email]'], records['record2[pid]'], records['record2[name]'], records['record2[eid]'], records['record2[examtype]'], ((records['record2[deadline]'] == '') ? null : records['record2[deadline]']), records['record2[seq]'],
                    records['record3[email]'], records['record3[pid]'], records['record3[name]'], records['record3[eid]'], records['record3[examtype]'], ((records['record3[deadline]'] == '') ? null : records['record3[deadline]']), records['record3[seq]']],
                    function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
            }).then(function (rows) {
                res.send("sucess");
                res.end();
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
    app.delete('/hr_home', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var record = req.body;
            new Promise(function (resolve, reject) {
                connection.query('DELETE FROM postion_applicant WHERE email=? AND cv=? AND postionid=?;',
                    [record.email, record.cv, record.id], function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
            }).then(function (rows) {
                res.send("sucess");
                res.end();
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
};