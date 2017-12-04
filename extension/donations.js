/* eslint-disable camelcase */
'use strict';

const request = require('request-promise');

module.exports = function (nodecg) {
	nodecg.listenFor('testDonation', ({type, name, rawAmount, subTier} = {}) => {
		let formattedDonation;
		if (type === 'cash' || type === 'item') {
			formattedDonation = formatDonation({type, name, rawAmount});
			nodecg.sendMessage('donation', formattedDonation);
		} else if (type === 'subscription') {
			formattedDonation = {
				type,
				display_name: name,
				months: rawAmount,
				sub_plan: subTier
			};
			nodecg.sendMessage(type, formattedDonation);
		} else if (type === 'cheer') {
			formattedDonation = {
				type,
				display_name: name,
				bits_used: rawAmount
			};
			nodecg.sendMessage(type, formattedDonation);
		}

		nodecg.log.info('Emitted test %s:', type, formattedDonation);
	});

	if (nodecg.bundleConfig && nodecg.bundleConfig.donationSocketUrl) {
		const socket = require('socket.io-client')(nodecg.bundleConfig.donationSocketUrl);
		socket.on('connect', () => {
			nodecg.log.info('Connected to cash donation socket', nodecg.bundleConfig.donationSocketUrl);
		});
		socket.on('connect_error', err => {
			nodecg.log.error('Donation socket connect_error:', err);
		});
		socket.on('donation', data => {
			const formattedDonation = formatDonation(data);
			nodecg.log.debug('Emitting CASH donation:', formattedDonation);
			nodecg.sendMessage('donation', formattedDonation);
		});
		socket.on('disconnect', () => {
			nodecg.log.error('Disconnected from cash donation socket, can not receive cash donations!');
		});
		socket.on('error', err => {
			nodecg.log.error('Donation socket error:', err);
		});
	} else {
		nodecg.log.error(`cfg/${nodecg.bundleName}.json is missing the "donationSocketUrl" property.` +
			'\n\tThis means that we cannot receive new incoming PayPal donations from the tracker,' +
			'\n\tand that donation notifications will not be displayed as a result.' +
			'\n\tThe total will still be displayed.');
	}

	function formatDonation({name, rawAmount, type}) {
		// Truncate name to 30 characters
		name = name || 'Anonymous';
		name = name.length > 30 ? `${name.substring(0, 29)}…` : name;

		// Format amount
		let amount = parseFloat(rawAmount).toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		});

		// If a whole dollar, get rid of cents
		if (amount.endsWith('.00')) {
			amount = amount.substr(0, amount.length - 3);
		}

		return {
			name,
			amount,
			rawAmount,
			type
		};
	}
};
