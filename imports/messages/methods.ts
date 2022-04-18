// Methods related to messages

import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Messages} from './messages'

Meteor.methods({
	'messages.insert'(value) {
		check(value, String)

		const email = Meteor.user()?.emails?.[0].address
		if (!email) throw new TypeError('User should have email')

		return Messages.insert({user: email, value, time: Date.now()})
	},
})
