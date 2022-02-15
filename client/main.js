import {render} from 'solid-js/web'
import {BlazeComponent} from './imports/BlazeComponent.jsx'
import {Harp} from './imports/Harp.jsx'
import {Messages} from './imports/Messages.jsx'

// This typedef merely imports solid-styled-jsx so that the attribute types for
// <style> elements are available.
/** @typedef {import ('solid-styled-jsx')} _ */

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

render(Main, document.querySelector('#main'))
