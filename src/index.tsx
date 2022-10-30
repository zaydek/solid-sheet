import { createSignal, onCleanup, onMount } from "solid-js"
import { render } from "solid-js/web"
import { Bottomsheet, BottomsheetState, Sidesheet, SidesheetState } from "../lib"

//// const mq = window.matchMedia("(max-width: 500px)")
//// const [responsive, setResponsive] = createSignal(mq.matches)
//// mq.addEventListener("change", e => setResponsive(e.matches))

function App() {
	const [bottomsheet, setBottomsheet] = createSignal<BottomsheetState>("closed")
	const [sidesheet, setSidesheet] = createSignal<SidesheetState>("open")

	onMount(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "b") {
				if (bottomsheet() === "closed") {
					setBottomsheet("open")
				} else if (bottomsheet() === "open") {
					setBottomsheet("closed")
				}
			}
		}
		window.addEventListener("keydown", handleKeyDown, false)
		onCleanup(() => window.removeEventListener("keydown", handleKeyDown, false))
	})

	onMount(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "s") {
				if (sidesheet() === "closed") {
					setSidesheet("open")
				} else if (sidesheet() === "open") {
					setSidesheet("expanded")
				} else if (sidesheet() === "expanded") {
					setSidesheet("closed")
				}
			}
		}
		window.addEventListener("keydown", handleKeyDown, false)
		onCleanup(() => window.addEventListener("keydown", handleKeyDown, false))
	})

	return <>
		{/* <style>{`
			:root {
				position: fixed;
				inset: 0;
				overflow: hidden;
			}
		`}</style> */}
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<div>Hello, world!</div>
		<Bottomsheet state={bottomsheet()} setState={setBottomsheet}>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
			<div>Hello, world!</div>
		</Bottomsheet>
		{/* <Sidesheet state={sidesheet()} setState={setSidesheet}>
			<div>
				Hello, world! Hello, world! Hello, world! Hello, world! Hello, world!
				Hello, world! Hello, world! Hello, world! Hello, world! Hello, world!
				Hello, world! Hello, world! Hello, world! Hello, world! Hello, world!
				Hello, world! Hello, world! Hello, world! Hello, world! Hello, world!
				Hello, world! Hello, world! Hello, world! Hello, world! Hello, world!
			</div>
		</Sidesheet> */}
	</>
}

render(() => <App />, document.getElementById("root")!)
