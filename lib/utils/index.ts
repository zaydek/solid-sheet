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

// Returns whether an element has a class name
export function hasClass(element: HTMLElement, className: string) {
  return element.classList.contains(className)
}

// Returns whether an element has a property name
export function hasStyle(element: HTMLElement, propertyName: string) {
  return element.style.getPropertyValue(propertyName) !== "" // Zero value
}

export function createScreenEffect() {
	const root = document.documentElement
	if (hasStyle(root, "--screen-y") || hasStyle(root, "--screen-x")) { return }

	createRoot(dispose => {
		onMount(() => {
			function handleResize(e?: UIEvent) {
				const { innerHeight: screenY, innerWidth: screenX } = window
				document.documentElement.style.setProperty("--screen-y", `${screenY}px`)
				document.documentElement.style.setProperty("--screen-x", `${screenX}px`)
			}
			handleResize()
			window.addEventListener("resize", handleResize, false)
			onCleanup(() => {
				document.documentElement.style.setProperty("--screen-y", "")
				document.documentElement.style.setProperty("--screen-x", "")
				if (!document.documentElement.style.length) {
					document.documentElement.removeAttribute("style")
				}
				window.removeEventListener("resize", handleResize, false)
			})
		})
		onCleanup(dispose)
	})

	return void 0
}

export function only<T>(value: T) {
	return value || undefined
}

// https://stackoverflow.com/a/11832950
export function round(float: number, { precision }: { precision: number } = { precision: 0 }) {
	const magnitude = 10 ** precision
	return Math.round((float + Number.EPSILON) * magnitude) / magnitude
}
