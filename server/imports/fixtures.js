// Fill the DB with example data on startup

import moment from 'moment'
import {Messages} from '../../imports/messages/messages'

const isDev = true

export function createFixtures() {
	if (isDev || Messages.find().count() === 0) {
		Messages.remove({})

		// prettier-ignore
		const data = [
			{user: "trusktr@gmail.com", value: 'This is a message.', time: moment('01/12/2022 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is another message.', time: moment('01/14/2022 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is the third message.', time: moment('01/14/2022 8:36pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is a message.', time: moment('01/14/2022 8:42pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is another message.', time: moment('01/16/2022 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is the third message.', time: moment('01/16/2022 8:55pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is a message.', time: moment('01/21/2022 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is another message.', time: moment('01/22/2022 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is another message.', time: moment('01/22/2022 8:35pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is another message.', time: moment('01/22/2022 8:36pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is the third message.', time: moment('01/22/2022 8:55pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is the third message.', time: moment('01/22/2022 8:56pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is the third message.', time: moment('01/22/2022 9:20pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is a message.', time: moment('01/25/2022 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is another message.', time: moment('01/25/2022 8:40pm', 'MM/DD/YYYY h:mma').toDate()},
			{user: "trusktr@gmail.com", value: 'This is another message.', time: moment('01/25/2022 9:40pm', 'MM/DD/YYYY h:mma').toDate()},
		]

		data.forEach(msg => Messages.insert(msg))
	}
}
