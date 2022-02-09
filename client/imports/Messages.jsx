import {Meteor} from 'meteor/meteor'
import {Tracker} from 'meteor/tracker'
import dayjs from '../../imports/day.js'
import {createEffect, createMemo, For, Show} from 'solid-js'
import {createMutable} from 'solid-js/store'
import {Messages as Msgs} from '../../imports/messages/messages.js'

export function Messages() {
	let scroller

	const data = createMutable({
		messages: [],
		newMessage: '',
		submitting: 0,
		stayAtBottom: true,
		subReady: false,
	})

	const sub = Meteor.subscribe('messages.all')

	// Meteor's version of Solid createEffect.
	Tracker.autorun(() => (data.subReady = sub.ready()))

	Tracker.autorun(() => (data.messages = Msgs.find({})))

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
			const msgMoment = dayjs(time)
			if (!showWeekdayName && Date.now() - time < oneWeek) showWeekdayName = true

			if (shouldShowTime === null || msgMoment.day() !== dayjs(lastShownTime).day()) showDay = true
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
				time: dayjs(time).format('MMMM, Do'),
			})
		}

		return result
	})

	return (
		<>
			<div class="messages">
				<div class="scrollerWrapper">
					<div class="scroller" ref={scroller} onscroll={onScroll}>
						<Show when={data.subReady} fallback={<h3> Loading... </h3>}>
							<div class="conversation">
								<For each={messagesFormatted()}>
									{msg => (
										<Show when={msg.shouldShowTime} fallback={<div class="message">{msg.value}</div>}>
											<div class="time">
												<b>{msg.shouldShowTime}</b>
											</div>
										</Show>
									)}
								</For>
							</div>
						</Show>
					</div>
				</div>

				<form class="info-link-add" onsubmit={addMessage}>
					<input type="text" v-model="newMessage" placeholder="enter a message" required />
					<input type="submit" value="Send message" />
				</form>

				<style jsx>{
					/*css*/ `
						.messages {
							width: 100%;
							height: 100%;
							box-sizing: border-box;
							overflow: hidden;
							position: relative;
						}
						.messages .scrollerWrapper {
							width: 100%;
							height: 100%;
							position: absolute;
							/* move content upward so we don't block the input */
							padding-top: 22px;
							transform: translateY(-22px);
						}
						.messages .scrollerWrapper .scroller {
							width: 100%;
							height: 100%;
							overflow-x: hidden;
							overflow-y: auto;
						}
						.messages form {
							bottom: 0px;
							position: absolute;
						}
						.messages li {
							margin: 10px 0;
							list-style: none;
						}
					`
				}</style>
			</div>
		</>
	)

	function addMessage(event) {
		event.preventDefault()

		data.submitting++
		Meteor.call('messages.insert', data.newMessage, error => {
			if (error) alert(error.error)
			data.submitting--
		})
		// clear the input field
		data.newMessage = ''
	}

	function onScroll() {
		// This prevents the view from jumping back to the bottom if
		// the user scrolled up to read older content.
		if (data.stayAtBottom && scroller.scrollTop < scroller.scrollHeight - scroller.clientHeight) {
			data.stayAtBottom = false
		} else if (!data.stayAtBottom && scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight) {
			data.stayAtBottom = true
		}
	}
}
