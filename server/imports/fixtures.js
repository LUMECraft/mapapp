// Fill the DB with example data on startup

import dayjs from '../../imports/day.js'
import {Messages} from '../../imports/messages/messages'

const isDev = true

export function createFixtures() {
	console.log('--------- dayjs:', dayjs)

	if (isDev || Messages.find().count() === 0) {
		Messages.remove({})

		const data = [
			{value: 'This is a message.', time: dayjs('01/12/2018 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is another message.', time: dayjs('01/14/2018 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is the third message.', time: dayjs('01/14/2018 8:36pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is a message.', time: dayjs('01/14/2018 8:42pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is another message.', time: dayjs('01/16/2018 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is the third message.', time: dayjs('01/16/2018 8:55pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is a message.', time: dayjs('01/21/2018 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is another message.', time: dayjs('01/22/2018 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is another message.', time: dayjs('01/22/2018 8:35pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is another message.', time: dayjs('01/22/2018 8:36pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is the third message.', time: dayjs('01/22/2018 8:55pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is the third message.', time: dayjs('01/22/2018 8:56pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is the third message.', time: dayjs('01/22/2018 9:20pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is a message.', time: dayjs('01/25/2018 8:34pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is another message.', time: dayjs('01/25/2018 8:40pm', 'MM/DD/YYYY h:mma').toDate()},
			{value: 'This is another message.', time: dayjs('01/25/2018 9:40pm', 'MM/DD/YYYY h:mma').toDate()},
		]

		data.forEach(msg => Messages.insert(msg))
	}
}
