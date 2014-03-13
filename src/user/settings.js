
'use strict';

var	meta = require('./../meta'),
	db = require('./../database');

module.exports = function(User) {

	User.getSettings = function(uid, callback) {
		function sendDefaultSettings() {
			callback(null, {
				showemail: false,
				usePagination: parseInt(meta.config.usePagination, 10) === 1,
				topicsPerPage: parseInt(meta.config.topicsPerPage, 10) || 20,
				postsPerPage: parseInt(meta.config.postsPerPage, 10) || 10
			});
		}

		if(!parseInt(uid, 10)) {
			return sendDefaultSettings();
		}

		db.getObject('user:' + uid + ':settings', function(err, settings) {
			if(err) {
				return callback(err);
			}

			if(!settings) {
				settings = {};
			}

			settings.showemail = settings.showemail ? parseInt(settings.showemail, 10) !== 0 : false;
			settings.usePagination = settings.usePagination ? parseInt(settings.usePagination, 10) === 1 : parseInt(meta.config.usePagination, 10) === 1;
			settings.topicsPerPage = settings.topicsPerPage ? parseInt(settings.topicsPerPage, 10) : parseInt(meta.config.topicsPerPage, 10) || 20;
			settings.postsPerPage = settings.postsPerPage ? parseInt(settings.postsPerPage, 10) : parseInt(meta.config.postsPerPage, 10) || 10;

			callback(null, settings);
		});
	};

	User.saveSettings = function(uid, data, callback) {

		if(!data.topicsPerPage || !data.postsPerPage || parseInt(data.topicsPerPage, 10) <= 0 || parseInt(data.postsPerPage, 10) <= 0) {
			return callback(new Error('Invalid pagination value!'));
		}

		db.setObject('user:' + uid + ':settings', {
			showemail: data.showemail,
			usePagination: data.usePagination,
			topicsPerPage: data.topicsPerPage,
			postsPerPage: data.postsPerPage
		}, callback);
	};
};