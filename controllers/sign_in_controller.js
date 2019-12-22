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
    app.get('/sign_in', function (req, res) {
        res.render('sign_in');
    });
    app.get('/', function (req, res) {
        res.render('sign_in');
    });
    app.post('/sign_in', urlencodedParser, function (req, res) {
        sess = req.session;
        var getacc = req.body;
        if (getacc.ha == '1') {
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM hr WHERE email=? AND password=?;',
                    [getacc.email, getacc.pass], function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
            }).then(function (rows) {
                if (rows[0] != null) {
                    sess.email = rows[0].email;
                    sess.cv = rows[0].cv;
                }
                res.send(rows[0]);
                res.end();
            }).catch((err) => setImmediate(() => { throw err; }));
        } else {
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM applicant WHERE email=? AND password=?;',
                    [getacc.email, getacc.pass], function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
            }).then(function (rows) {
                if (rows[0] != null) {
                    sess.email = rows[0].email;
                    sess.cv = rows[0].cv;
                }
                res.send(rows[0]);
                res.end();
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
};