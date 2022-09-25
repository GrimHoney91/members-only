const Message = require('../models/message');
const User = require('../models/user');

const async = require('async');
const {body, validationResult} = require('express-validator');
const passport = require('passport');

exports.index = (req, res, next) => {
    Message.find().populate('user').exec((err, messages) => {
        if (err) return next(err);
        res.render('index', {title: 'Home', messages});
    });
};

exports.create_message_get = (req, res, next) => {
    res.render('message_form', {title: 'Create Message'});
};

exports.create_message_post = [
    body('title').trim().isLength({min: 1, max: 100}).escape(),
    body('text').trim().isLength({min: 1, max: 500}).escape(),
    body('user').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        let message = {
            title: req.body.title,
            text: req.body.text,
        };

        if (!errors.isEmpty()) {
            res.render('message_form', {
                title: 'Create Message',
                message,
                errors: errors.array()
            });
            return;
        }
        message.user = req.body.user;
        message.timeStamp = Date.now();

        const newMessage = new Message(message);
        newMessage.save((err) => {
            if (err) return next(err);

            res.redirect('/');
        });
    }
];

exports.message_delete = (req, res, next) => {
    Message.findByIdAndRemove(req.body.messageid, (err) => {
        if (err) return next(err);
        res.redirect('/');
    });
};