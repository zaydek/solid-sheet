import { createSignal, Show } from "solid-js"
import { render } from "solid-js/web"
import { Bottomsheet, Sidesheet } from "../lib"

const mq = window.matchMedia("(max-width: 500px)")
const [responsive, setResponsive] = createSignal(mq.matches)
mq.addEventListener("change", e => setResponsive(e.matches))

function App() {
	return <>
		<Show when={responsive()}>
			<Bottomsheet initialState="closed">
				<div>Hello, world!</div>
			</Bottomsheet>
		</Show>
		<Show when={!responsive()}>
			<Sidesheet initialState="closed">
				<div>Hello, world!</div>
			</Sidesheet>
		</Show>
	</>
}

render(() => <App />, document.getElementById("root")!)
