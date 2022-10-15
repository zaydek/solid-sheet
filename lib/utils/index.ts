import { createRoot, onCleanup, onMount } from "solid-js"

export function cx(...args: any[]) {
	const className = args
		.flat()
		.filter(Boolean)
		.join(" ")
		.trim()
		.replaceAll(/\s+/g, " ")
	if (!className) { return }
	return className
}

export function createScreenVars() {
	createRoot(dispose => {
		onMount(() => {
			function handleResize(e?: UIEvent) {
				const { innerHeight: screenH, innerWidth: screenW } = window
				document.documentElement.style.setProperty("--screen-h", `${screenH}px`)
				document.documentElement.style.setProperty("--screen-w", `${screenW}px`)
			}
			handleResize()
			window.addEventListener("resize", handleResize, false)
			onCleanup(() => {
				document.documentElement.style.setProperty("--screen-h", "")
				document.documentElement.style.setProperty("--screen-w", "")
				if (!document.documentElement.style.length) {
					document.documentElement.removeAttribute("style")
				}
				window.removeEventListener("resize", handleResize, false)
			})
		})
		onCleanup(dispose)
	})
}

export function only<T>(value: T) {
	return value || undefined
}

// https://stackoverflow.com/a/11832950
export function round(float: number, { precision }: { precision: number } = { precision: 0 }) {
	const magnitude = 10 ** precision
	return Math.round((float + Number.EPSILON) * magnitude) / magnitude
}
