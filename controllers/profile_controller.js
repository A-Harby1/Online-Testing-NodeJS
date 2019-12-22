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
    app.get('/profile', function (req, res) {
        sess = req.session;
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var email = sess.email;
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM applicant WHERE email=?;',
                    [email], function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
            }).then(function (rows) {
                res.render('profile', { data: rows[0] });
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
    app.post('/profile', urlencodedParser, function (req, res) {
        if (sess.email == null) {
            res.render('sign_in');
        } else {
            var email = sess.email;
            var upacc = req.body;
            new Promise(function (resolve, reject) {
                connection.query('UPDATE applicant SET password = ?, firstname= ? ,lastname= ?, telephone = ?, cv = ? WHERE email = ?;',
                    [upacc.password, upacc.firstname, upacc.lastname, upacc.tel, upacc.cv, email], function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
            }).then(function (rows) {
                sess.cv = upacc.cv;
                res.render('profile', { data: upacc });
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
};


