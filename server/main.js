import {Meteor} from 'meteor/meteor'
import {createFixtures} from './imports/fixtures.js'
import './imports/register-api.js'

main()

async function main() {
	await new Promise(r => Meteor.startup(r))

	createFixtures()

	console.log('Server started.')
}
