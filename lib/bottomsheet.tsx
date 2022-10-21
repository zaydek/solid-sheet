import "./bottomsheet.css"

import { batch, createEffect, createSignal, on, onCleanup, onMount, ParentProps, Setter } from "solid-js"
import { cx, only, round } from "./utils"

export type BottomsheetState =
	| "closed"
	| "open"

export function Bottomsheet(props: ParentProps<{
	initialState: BottomsheetState // Uncontrolled API
} | {
	state:    BottomsheetState // Controlled API
	setState: Setter<BottomsheetState>
}>) {
	const [draggable, setDraggable] = createSignal<HTMLElement>()

	const [state, setState] = "initialState" in props
		? createSignal(props.initialState)
		: [() => props.state, props.setState]
	const [pointerDown, setPointerDown] = createSignal<true>()
	const [pointerOffset, setPointerOffset] = createSignal<number>()
	const [point1, setPoint1] = createSignal<number>()
	const [point2, setPoint2] = createSignal<number>()

	const [transition, setTransition] = createSignal<true>()

	function forceState(state: BottomsheetState) {
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
			if (!draggable()!.contains(e.target as HTMLElement)) { return }
			e.preventDefault() // COMPAT/Safari: Prevent cursor from changing
			batch(() => {
				const clientRect = draggable()!.getBoundingClientRect()
				setPointerDown(true)
				setPointerOffset(round(clientRect.top - e.clientY, { precision: 1 }))
				setPoint1(round(e.clientY, { precision: 1 }))
				setTransition()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setPoint2(round(e.clientY, { precision: 1 }))
		}
		function handlePointerUp(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				const delta = (point2()! + pointerOffset()!) - (point1()! + pointerOffset()!)
				if (state() === "closed") {
					if (delta < 0) {
						setState("open")
					}
				} else if (state() === "open") {
					if (delta > 0) {
						setState("closed")
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
			class="bottomsheet-backdrop"
			onClick={e => forceState("closed")}
			// @ts-expect-error
			inert={only(state() === "closed")}
		></div>
		<div
			class={cx(`bottomsheet is-${state()} ${transition() ? "is-transition" : ""}`)}
			style={{
				"--__drag-translate-y":
					(pointerOffset() !== undefined && point1() !== undefined && point2() !== undefined)
						? `${(point2()! + pointerOffset()!) - (point1()! + pointerOffset()!)}px`
						: "0px",
			}}
			onTransitionEnd={e => setTransition()}
		>
			<div
				ref={setDraggable}
				class="bottomsheet-draggable"
				onKeyDown={e => {
					if (e.key === "ArrowUp") {
						forceState("open")
					} else if (e.key === "ArrowDown") {
						forceState("closed")
					}
				}}
				tabIndex={0}
			>
				<div class="bottomsheet-drag-indicator"></div>
			</div>
			<div class="bottomsheet-card-hairline"></div>
			{/* @ts-expect-error */}
			<div class="bottomsheet-content" inert={only(state() === "closed")}>
				{props.children}
			</div>
		</div>
	</>
}
