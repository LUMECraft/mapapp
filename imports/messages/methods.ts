// Methods related to messages

import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Messages} from './messages'

Meteor.methods({
	'messages.insert'(value) {
		check(value, String)

		return Messages.insert({
			user: Meteor.user()?.emails?.[0].address ?? thro(new Error('User should have email')),
			value,
			time: Date.now(),
		})
	},
})

function thro(err) {
	throw err
}
