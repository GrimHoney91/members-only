const User = require('../models/user');
const Message = require('../models/message');

const async = require('async');
const {body, validationResult} = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

exports.user_signup_get = (req, res, next) => {
    res.render('sign_up_form', {title: 'Sign up'});
};

exports.user_signup_post = [
    body('username').trim().isLength({min: 5, max: 30}).escape(),
    body('password').trim().isLength({min: 5}).escape(),
    body('cpassword').trim().isLength({min: 5}).escape().custom((value, {req}) => value === req.body.password),

    (req, res, next) => {
        const errors = validationResult(req);

        let user = {
            username: req.body.username,
            password: req.body.password,
            status: 'regular'
        };

        if (!errors.isEmpty()) {
            res.render('sign_up_form', {
                title: 'Sign up',
                user,
                errors: errors.array() 
            });
            return;
        }

        bcrypt.hash(user.password, 10, (err, hashedPassword) => {
            if (err) return next(err);
            
            user.password = hashedPassword;
            const newUser = new User(user);

            newUser.save((err) => {
                if (err) return next(err);

                res.redirect('/forum/log-in');
            });
        });
    }
];

exports.user_login_get = (req, res, next) => {
    res.render('login_form', {title: 'Log in'});
};

exports.user_login_post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/forum/log-in'
});

exports.user_log_out = (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        res.redirect('/');
    });
}
exports.user_member_get = (req, res, next) => {
    res.render('member_form', {title: 'Become a member'});
};

exports.user_member_post = [
    body('passcode').trim().isLength({min: 1}).escape().custom((value, {req}) => value === 'honey'),
    body('userid').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('member_form', {
                title: 'Become a member',
                errors: errors.array()
            });
            return;
        }

        User.findByIdAndUpdate(req.body.userid, {status: 'member'}, (err) => {
            if (err) return next(err);

            res.redirect('/');
        });
    }
];

exports.user_admin_get = (req, res, next) => {
    res.render('admin_form', {title: 'Become an admin'});
};

exports.user_admin_post = [
    body('passcode').trim().isLength({min: 1}).escape().custom((value, {req}) => value === 'grimhoney'),
    body('userid').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('admin_form', {
                title: 'Become an admin',
                errors: errors.array()
            });
            return;
        }

        User.findByIdAndUpdate(req.body.userid, {status: 'admin'}, (err) => {
            if (err) return next(err);

            res.redirect('/');
        });
    }
];