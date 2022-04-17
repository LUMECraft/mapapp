import {Meteor} from 'meteor/meteor'
import {createFixtures} from './imports/fixtures'
import './imports/register-api'

main()

async function main() {
	await new Promise(r => Meteor.startup(r))

	createFixtures()

	console.log('Server started.')
}
