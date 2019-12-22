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
    app.get('/sign_up', function (req, res) {
        res.render('sign_up');
    });
    app.post('/sign_up', urlencodedParser, function (req, res) {
        sess = req.session;
        var newacc = req.body;
        if (newacc.taken == 1) {
            new Promise(function (resolve, reject) {
                connection.query('SELECT * FROM applicant WHERE email=?;', [newacc.email], function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            }).then(function (rows) {
                res.send(rows[0]);
                res.end();
            }).catch((err) => setImmediate(() => { throw err; }));
        } else {
            new Promise(function (resolve, reject) {
                connection.query('INSERT INTO applicant (email,password,firstname,lastname,telephone)VALUES (?,?,?,?,?);',
                    [newacc.email, newacc.pass, newacc.fname, newacc.lname, newacc.tel],
                    function (err, rows, fields) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                        sess.email = newacc.email;
                    });
            }).then(function (rows) {
                res.send("sucess");
            }).catch((err) => setImmediate(() => { throw err; }));
        }
    });
};