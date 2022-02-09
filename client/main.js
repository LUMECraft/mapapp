import './main.html'
import {render} from 'solid-js/web'
import {Harp} from './imports/Harp.jsx'
import {Messages} from './imports/Messages.jsx'

function Main() {
	return (
		<>
			<Harp />
			<Messages />
		</>
	)
}

render(Main, document.querySelector('#main'))
