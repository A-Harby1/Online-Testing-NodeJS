const express = require('express');
const session = require('express-session');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

var signUpController = require('./controllers/sign_up_controller');
var signInController = require('./controllers/sign_in_controller');
var applicantHomeController = require('./controllers/applicant_home_controller');
var applicantNotifyController = require('./controllers/applicant_notify_controller');
var hrHomeController = require('./controllers/hr_home_controller');
var applicantExamController = require('./controllers/applicant_exam_controller');
var profileController = require('./controllers/profile_controller');
var hrFeaturesController = require('./controllers/hr_features_controller');
var questionsController = require('./controllers/questions_controller');
var hrNotifyController = require('./controllers/hr_notify_controller');

//template engine
app.set('view engine', 'ejs');

//static files
app.use('/assets', express.static('assets'));

app.use(session({
    secret: 'secret', saveUninitialized: true, resave: true,
    expires: new Date(Date.now() + (24 * 3600 * 1000))
}));

signUpController(app);
signInController(app);
applicantHomeController(app);
applicantNotifyController(app);
hrHomeController(app);
applicantExamController(app);
profileController(app);
hrFeaturesController(app);
questionsController(app);
hrNotifyController(app);

app.listen(port, function () { console.log('Port ' + port + ' Now Working...'); });