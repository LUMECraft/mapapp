// Definition of the messages collection

import {Mongo} from 'meteor/mongo'

export const Messages = new Mongo.Collection<Message>('messages')

export interface Message {
	// time in millisecond timestamp
	time: number
	user: string
	value: string
}
