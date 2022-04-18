import {render} from 'solid-js/web'
import {BlazeComponent} from './imports/BlazeComponent'
import {Harp} from './imports/Harp'
import {Messages} from './imports/Messages'

// Type import of solid-styled-jsx so that the attribute types for
// <style> elements are available.
import type {} from 'solid-styled-jsx'

function Main() {
	return (
		<>
			<Harp />

			<Messages />

			<BlazeComponent
				name="loginButtons"
				onRendered={container => {
					console.log('blaze mounted', container.children)
				}}
			/>

			<style global>{
				/*css*/ `
					/* This moves harp controls up to the top */
					.harp-gl_controls {
						right: 320px !important;
						height: calc(100% - 20px) !important;
						top: 10px !important;
					}
					.harp-gl_controls > span {
						display: none;
					}

					#login-buttons {
						position: absolute;
						left: 10px;
						top: 10px;
						padding: 10px;
						color: white;
						background: rgba(0, 0, 0, 0.6);
						border-radius: 4px;
					}
				`
			}</style>
		</>
	)
}

render(Main, document.querySelector('#main')!)
