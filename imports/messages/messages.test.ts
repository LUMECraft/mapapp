// Tests for the behavior of the messages collection
//
// https://guide.meteor.com/testing.html

import {Meteor} from 'meteor/meteor'
import {assert} from 'meteor/practicalmeteor:chai'
import {Messages} from './messages'

if (Meteor.isServer) {
	describe('messages collection', function () {
		it('insert correctly', function () {
			const id = Messages.insert({
				user: 'foo@bar.baz',
				value: "Hey, what's up?",
				time: Date.now(),
			})
			const added = Messages.find({_id: id})
			const collectionName = added._getCollectionName()
			const count = added.count()

			assert.equal(collectionName, 'messages')
			assert.equal(count, 1)
		})
	})
}
