// Methods related to messages

import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Messages} from './messages.js'

Meteor.methods({
	'messages.insert'(value) {
		check(value, String)

		// NOTE, do not add a 'shouldShowTime' field! The UI relies on this.
		// TODO, add a runtime check or a test case for not having shouldShowTime.
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
