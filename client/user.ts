import {Meteor} from 'meteor/meteor'
import {Tracker} from 'meteor/tracker'
import {createSignal} from 'solid-js'

const [user, setUser] = createSignal()

// Only export the getter, not the setter, making it readonly outside of this module.
export {user}

// Maps a Meteor signal to a Solid signal for use in Solid components.
Tracker.autorun(() => {
	const user = Meteor.user()

	// TODO allow username input during signup.

	setUser(
		user
			? {
					...user,
					username: user.emails?.[0]?.address.split('@')[0] ?? 'anon',
			  }
			: user,
	)
})
