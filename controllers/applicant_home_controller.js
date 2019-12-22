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
    app.get('/applicant_home', function (req, res) {
        sess = req.session;
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM postion;', function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            }).then(function (rows) {
                res.render('applicant_home', { sess: sess, postion: rows });
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
    app.post('/applicant_home', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var record = req.body;
            new Promise(function (resolve, reject) {
                connection.query('INSERT INTO postion_applicant(email, cv, postionid, postionname)VALUES (?,?,?,?);',
                    [record.email, record.cv, record.id, record.pname], function (err, rows, fields) {
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