import {render} from 'solid-js/web'
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
				`
			}</style>
		</>
	)
}

render(Main, document.querySelector('#main'))
