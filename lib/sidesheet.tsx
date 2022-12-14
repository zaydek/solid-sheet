import { batch, createEffect, createSignal, on, onCleanup, onMount, ParentProps, Setter } from "solid-js"
import { cx, only, round } from "./utils"

export type SidesheetState =
	| "closed"
	| "open"
	| "expanded"

export function Sidesheet(props: ParentProps<{
	initialState: SidesheetState // Uncontrolled API
} | {
	state:    SidesheetState // Controlled API
	setState: Setter<SidesheetState>
}>) {
	const [draggableRef, setDraggableRef] = createSignal<HTMLElement>()

	const [state, setState] = "initialState" in props
		? createSignal(props.initialState)
		: [() => props.state, props.setState]
	const [pointerDown, setPointerDown] = createSignal<true>()
	const [pointerOffset, setPointerOffset] = createSignal<number>()
	const [point1, setPoint1] = createSignal<number>()
	const [point2, setPoint2] = createSignal<number>()

	const [transition, setTransition] = createSignal<true>()

	function forceState(state: SidesheetState) {
		batch(() => {
			setState(state)
			setPointerDown()
			setPointerOffset()
			setPoint1()
			setPoint2()
			setTransition(true)
		})
	}

	// Synchronize transition
	if (!("initialState" in props)) {
		createEffect(on(state, () => {
			if (!transition()) {
				setTransition(true)
			}
		}, { defer: true }))
	}

	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (!(e.button === 0 || e.buttons === 1)) { return }
			if (!draggableRef()!.contains(e.target as HTMLElement)) { return }
			e.preventDefault() // COMPAT/Safari: Prevent cursor from changing
			batch(() => {
				const clientRect = draggableRef()!.getBoundingClientRect()
				setPointerDown(true)
				setPointerOffset(round(clientRect.right - e.clientX, { precision: 1 }))
				setPoint1(round(e.clientX, { precision: 1 }))
				setTransition()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setPoint2(round(e.clientX, { precision: 1 }))
		}
		function handlePointerUp(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				const delta = (point2()! + pointerOffset()!) - (point1()! + pointerOffset()!)
				if (state() === "closed") {
					if (delta < -448) {
						setState("expanded")
					} else if (delta < 0) {
						setState("open")
					}
				} else if (state() === "open") {
					if (delta < 0) {
						setState("expanded")
					} else if (delta > 0) {
						setState("closed")
					}
				} else if (state() === "expanded") {
					if (delta > 672 - 448) {
						setState("closed")
					} else if (delta > 0) {
						setState("open")
					}
				}
				setPointerDown()
				setPointerOffset()
				setPoint1()
				setPoint2()
				setTransition(true)
			})
		}
		document.addEventListener("pointerdown", handlePointerDown, false)
		document.addEventListener("pointermove", handlePointerMove, false)
		document.addEventListener("pointerup",   handlePointerUp,   false)
		onCleanup(() => {
			document.removeEventListener("pointerdown", handlePointerDown, false)
			document.removeEventListener("pointermove", handlePointerMove, false)
			document.removeEventListener("pointerup",   handlePointerUp,   false)
		})
	})

	return <>
		<div
			class="sidesheet-backdrop"
			onClick={e => forceState("open")}
			// @ts-expect-error
			inert={only(state() === "closed" || state() === "open")}
		></div>
		<aside
			class={cx(`sidesheet ${`state-${state()}`} ${transition() ? "state-transition" : ""}`)}
			style={{
				"--__drag-translate-x":
					(pointerOffset() !== undefined && point1() !== undefined && point2() !== undefined)
						? `${(point2()! + pointerOffset()!) - (point1()! + pointerOffset()!)}px`
						: "0px", // Use px because of calc
			}}
			onTransitionEnd={e => setTransition()}
		>
			<div
				ref={setDraggableRef}
				class="sidesheet-draggable"
				onKeyDown={e => {
					if (e.key === "ArrowLeft") {
						if (state() === "closed") {
							forceState("open")
						} else {
							forceState("expanded")
						}
					} else if (e.key === "ArrowRight") {
						if (state() === "expanded") {
							forceState("open")
						} else {
							forceState("closed")
						}
					}
				}}
				tabIndex={0}
			>
				<div class="sidesheet-drag-indicator"></div>
			</div>
			{/* @ts-expect-error */}
			<div class="sidesheet-card" inert={only(state() === "closed")}>
				<div class="sidesheet-content">
					{props.children}
				</div>
			</div>
		</aside>
	</>
}
