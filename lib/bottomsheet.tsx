import "./bottomsheet.css"

import { batch, createSignal, DEV, onCleanup, onMount, ParentProps } from "solid-js"
import { cx, only, round } from "./utils"

export type BottomsheetState = "closed" | "open"

export function Bottomsheet(props: ParentProps<{ initialState: BottomsheetState }>) {
	const [backdrop, setBackdrop] = createSignal<HTMLElement>()
	const [draggable, setDraggable] = createSignal<HTMLElement>()

	const [state, setState] = createSignal(props.initialState ?? "open")
	const [pointerDown, setPointerDown] = createSignal<undefined | true>()
	const [pointerOffset, setPointerOffset] = createSignal<number>()
	const [p1, setP1] = createSignal<number>()
	const [p2, setP2] = createSignal<number>()

	const [transition, setTransition] = createSignal<undefined | true>()

	function forceState(state: BottomsheetState) {
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
				setPointerOffset(round(clientRect.top - e.clientY, { precision: 1 }))
				setP1(round(e.clientY, { precision: 1 }))
				setTransition()
			})
		}
		function handlePointerMove(e: PointerEvent) {
			if (!pointerDown()) { return }
			setP2(round(e.clientY, { precision: 1 }))
		}
		function handlePointerUp(e: PointerEvent) {
			if (!pointerDown()) { return }
			batch(() => {
				const delta = (p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)
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
			class="bottomsheet-backdrop"
			onClick={e => forceState("closed")}
			// @ts-expect-error
			inert={only(state() === "closed")}
		></div>
		<div
			class={cx(`bottomsheet is-${state()} ${transition() ? "is-transition" : ""}`)}
			style={{
				"--__drag-translate-y":
					(!pointerOffset() || !p1() || !p2())
						? "0px"
						: `${(p2()! + pointerOffset()!) - (p1()! + pointerOffset()!)}px`,
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
