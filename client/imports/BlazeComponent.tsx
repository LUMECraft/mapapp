import {ReactiveVar} from 'meteor/reactive-var'
import {Template} from 'meteor/templating'
import {Blaze} from 'meteor/blaze'
import {createEffect, onCleanup, onMount} from 'solid-js'

interface BlazeComponentProps {
	name: string
	data?: object
	onRendered: (container: HTMLDivElement) => void
}

/** A Solid component for loading Meteor Blaze components. */
export function BlazeComponent(props: BlazeComponentProps) {
	let container!: HTMLDivElement
	let blazeView!: Blaze.View

	const reactiveData = new ReactiveVar(props.data ?? {})

	createEffect(() => {
		reactiveData.set(props.data ?? {})
	})

	onMount(() => {
		console.log('blaze data', reactiveData.get())
		// TODO make new component if props.name changes. For now only the initial value is used.
		blazeView = Blaze.renderWithData(Template[props.name], () => reactiveData.get(), container)
		queueMicrotask(() => props.onRendered?.(container))
	})

	onCleanup(() => {
		Blaze.remove(blazeView)
	})

	return <div ref={container} style="display: contents;"></div>
}
