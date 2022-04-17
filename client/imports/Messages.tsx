import {Meteor} from 'meteor/meteor'
import {Tracker} from 'meteor/tracker'
import moment from 'moment'
import {createEffect, createMemo, For, Show} from 'solid-js'
import {createMutable} from 'solid-js/store'
import {Messages as Msgs} from '../../imports/messages/messages'
import {user} from '../user'

export function Messages() {
	let scroller

	const data = createMutable({
		/** @type {any[]} */
		messages: [],
		newMessage: '',
		stayAtBottom: true,
		subReady: false,
	})

	const sub = Meteor.subscribe('messages.all')

	// Meteor's version of Solid createEffect.
	Tracker.autorun(() => {
		data.subReady = sub.ready()
	})

	Tracker.autorun(() => {
		data.messages = Msgs.find({}).fetch()
	})

	// Solid's version of Meteor Tracker.autorun.
	createEffect(() => {
		data.messages

		// Use rAF to defer until after Vue has updated the DOM (maybe not needed in Solid anymore, test it out)
		requestAnimationFrame(() => {
			// if the user is not scrolled up and viewing older content,
			if (data.stayAtBottom) {
				// then scroll back to the bottom.
				scroller.scrollTop = scroller.scrollHeight
			}
		})
	})

	const messagesFormatted = createMemo(() => {
		const result = []

		if (!data.messages.length) return result

		const fiveMinutes = 5 * 60 * 1000
		const oneDay = 24 * 60 * 60 * 1000
		const oneWeek = 7 * oneDay
		// show the day once per day at most, otherwise we only show
		// the time of day
		let showDay = true
		// we don't show week day names until we're within one week of
		// now. For example, at first we show something like "Jan
		// 18th" for a message group, then once we're within a week, we
		// show something like "Thursday".
		let showWeekdayName = false
		let shouldShowTime = null
		let lastShownTime = data.messages[0].time

		for (const msg of data.messages) {
			const time = msg.time
			const msgMoment = moment(time)
			if (!showWeekdayName && Date.now() - time < oneWeek) showWeekdayName = true

			if (shouldShowTime === null || msgMoment.day() !== moment(lastShownTime).day()) showDay = true
			else showDay = false

			// we should show time if the last message was more than
			// five minutes after the last one.
			// TODO: also show time if we've already seen too many
			// messages in the list so just show time for convenience.
			if (shouldShowTime === null) shouldShowTime = true
			else shouldShowTime = time - lastShownTime > fiveMinutes

			if (shouldShowTime) {
				let day = ''
				if (showDay) {
					if (showWeekdayName) day = msgMoment.format('dddd')
					else day = msgMoment.format('MMM Do')
				}
				const timeOfDay = msgMoment.format('h:mm a')
				result.push({
					shouldShowTime: day ? `${day}, ${timeOfDay}` : timeOfDay,
				})
				lastShownTime = time
			}

			// and also insert the message
			result.push({
				...msg,
				time: moment(time).format('MMMM, Do'),
			})
		}

		return result
	})

	return (
		<>
			<div className="messages">
				<div className="scrollerWrapper">
					<div className="scroller" ref={scroller} onscroll={onScroll}>
						<Show when={data.subReady} fallback={<h3> Loading... </h3>}>
							<div className="conversation">
								<For each={messagesFormatted()}>
									{msg => (
										<Show
											when={msg.shouldShowTime}
											fallback={
												<div className="message">
													<span style="font-weight: bold;">{msg.user.split('@')[0]}:&nbsp;</span>
													<span>{msg.value}</span>
												</div>
											}
										>
											<div className="time">
												<b>{msg.shouldShowTime}</b>
											</div>
										</Show>
									)}
								</For>
							</div>
						</Show>
					</div>
				</div>

				<Show when={user()} fallback={<input placeholder="Sign in to comment." disabled />}>
					<form className="message-form" onsubmit={addMessage}>
						<input
							type="text"
							use:model={[() => data.newMessage, v => (data.newMessage = v)]}
							placeholder="enter a message"
							required
						/>
						<input type="submit" value="Send message" />
					</form>
				</Show>
			</div>

			<style jsx>{
				/*css*/ `
					.messages {
						box-sizing: border-box;
						position: absolute;
						width: 300px;
						height: calc(100vh - 20px);
						top: 10px;
						right: 10px;
						padding: 10px;

						/* overflow: hidden; */
						background: rgba(0, 0, 0, 0.6);
						border-radius: 4px;
						color: white;

						display: flex;
						flex-direction: column;
					}

					.messages .scrollerWrapper {
						flex-grow: 1;

						/*
						CSS is full of dumb tricks, like this one to make a
						flex-grow container not exceed the maximum size
						available in the layout. What the hell were CSS spec
						authors thinking?
						*/
						min-height: 0;

						margin-bottom: 10px;
					}
					.messages .scrollerWrapper .scroller {
						width: 100%;
						height: 100%;
						overflow-x: hidden;
						overflow-y: auto;
					}

					.messages form {
					}
				`
			}</style>
		</>
	)

	function addMessage(event) {
		event.preventDefault()

		Meteor.call('messages.insert', data.newMessage, error => {
			if (error) alert(error.error)
		})
		// clear the input field
		data.newMessage = ''
	}

	function onScroll() {
		// This prevents the view from jumping back to the bottom if
		// the user scrolled up to read older content.
		if (!data.stayAtBottom && isScrolledToBottom(scroller)) data.stayAtBottom = true
		else if (data.stayAtBottom && !isScrolledToBottom(scroller)) data.stayAtBottom = false
	}
}

export function model(input, accessor) {
	const [getValue, setValue] = accessor()
	input.addEventListener('input', () => setValue(input.value))
	createEffect(() => (input.value = getValue()))
}

function isScrolledToBottom(el) {
	// NOTE: scrollTop is fractional, while scrollHeight and clientHeight are
	// not, so without this Math.abs() trick then sometimes the result won't
	// work because scrollTop may not be exactly equal to el.scrollHeight -
	// el.clientHeight when scrolled to the bottom.
	return Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 1
}
