import "./sidesheet.css"

import { batch, createSignal, DEV, onCleanup, onMount, ParentProps } from "solid-js"
import { cx, only, round } from "./utils"

export type SidesheetState = "closed" | "open" | "expanded"

export function Sidesheet(props: ParentProps<{ initialState?: SidesheetState }>) {
	const [backdrop, setBackdrop] = createSignal<HTMLElement>()
	const [draggable, setDraggable] = createSignal<HTMLElement>()

	const [state, setState] = createSignal(props.initialState ?? "open")
	const [pointerDown, setPointerDown] = createSignal<undefined | true>()
	const [pointerOffset, setPointerOffset] = createSignal<number>()
	const [p1, setP1] = createSignal<number>()
	const [p2, setP2] = createSignal<number>()

	const [transition, setTransition] = createSignal<undefined | true>()

	function forceState(state: SidesheetState) {
		batch(() => {
			setState(state)
			setPointerDown()
			setPointerOffset()
			setP1()
			setP2()
			setTransition(true)
		})
	}

	if (DEV) {
		document.addEventListener("keydown", e => {
			if (e.key !== "d") { return }
			if (state() === "closed") {
				batch(() => {
					setState("open")
					setTransition(true)
				})
			} else if (state() === "open") {
				batch(() => {
					setState("expanded")
					setTransition(true)
				})
			} else if (state() === "expanded") {
				batch(() => {
					setState("closed")
					setTransition(true)
				})
			}
		})
	}

	onMount(() => {
		function handlePointerDown(e: PointerEvent) {
			if (!(e.button === 0 || e.buttons === 1)) { return }
			if (!(backdrop()!.contains(e.target as HTMLElement) ||
				draggable()!.contains(e.target as HTMLElement))) { return }
			e.preventDefault() // COMPAT/Safari: Prevent cursor from changing
			batch(() => {
				const clientRect = draggable()!.getBoundingClientRect()
				setPointerDown(true)
				setPointerOffset(round(clientRect.right - e.clientX, { precision: 1 }))
				setP1(round(e.clientX, { precision: 1 }))
				setTransition()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setP2(round(e.clientX, { precision: 1 }))
		}
		function handlePointerUp(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				const delta = (p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)
				if (state() === "closed") {
					if (delta < -384) {
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
					if (delta > 384) {
						setState("closed")
					} else if (delta > 0) {
						setState("open")
					}
				}
				setPointerDown()
				setPointerOffset()
				setP1()
				setP2()
				setTransition(true)
			})
		}
		document.addEventListener("pointerdown",  handlePointerDown, false)
		document.addEventListener("pointermove",  handlePointerMove, false)
		document.addEventListener("pointerup",    handlePointerUp,   false)
		document.addEventListener("pointerleave", handlePointerUp,   false)
		onCleanup(() => {
			document.removeEventListener("pointerdown",  handlePointerDown, false)
			document.removeEventListener("pointermove",  handlePointerMove, false)
			document.removeEventListener("pointerup",    handlePointerUp,   false)
			document.removeEventListener("pointerleave", handlePointerUp,   false)
		})
	})

	return <>
		<div
			ref={setBackdrop}
			class="solid-sheet-sidesheet-backdrop"
			onClick={e => forceState("closed")}
			// @ts-expect-error
			inert={only(state() === "closed" || state() === "open")}
		></div>
		<div
			class={cx(`solid-sheet-sidesheet is-${state()} ${transition() ? "is-transition" : ""}`)}
			style={{
				"--solid-sheet-sidesheet-drag-translate-x":
					(!pointerOffset() || !p1() || !p2())
						? "0px"
						: `${(p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)}px`,
			}}
			onTransitionEnd={e => setTransition()}
		>
			<div
				ref={setDraggable}
				class="solid-sheet-sidesheet-draggable"
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
				<div class="solid-sheet-sidesheet-drag-indicator"></div>
			</div>
			{/* @ts-expect-error */}
			<div class="solid-sheet-sidesheet-card" inert={only(state() === "closed")}>
				<div class="solid-sheet-sidesheet-content">
					{props.children}
				</div>
			</div>
		</div>
	</>
}
