import React from "react";

export default function ResizeRect(props) {
	let resizing = false;
	let startX;
	let startY;
	let parentDraggable;

	function findDraggable(element) {
		let higherUp = element.parentElement;

		if (!higherUp) {
			return null;
		} else if (higherUp.draggable) {
			return higherUp;
		} else {
			return findDraggable(higherUp);
		}
	}

	function onMouseDown(event) {
		// Probably should use react ref here but it has to do for now.
		if (!parentDraggable)
			parentDraggable = findDraggable(event.target);

		if (parentDraggable)
			parentDraggable.draggable = false;

		resizing = true;
		startX = event.clientX;
		startY = event.clientY;
	}

	function onMouseUp(event) {
		if (parentDraggable)
			parentDraggable.draggable = true;
		resizing = false;
	}

	function onMouseLeave(event) {
		if (resizing) {
			let yOffset = event.clientY - startY;
			let xOffset = event.clientX - startX;

			let xDistance = Math.abs(xOffset);
			let yDistance = Math.abs(xOffset);

			if (!props.lockdirection) {
				if (yDistance > xDistance) {
					updateListeners(yOffset > 0 ? "up" : "down");
				} else {
					updateListeners(xOffset > 0 ? "right" : "left");
				}
			} else if (props.lockdirection === "vertical") {
				updateListeners(yOffset < 0 ? "up" : "down");
			} else if (props.lockdirection === "horizontal") {
				updateListeners(xOffset > 0 ? "right" : "left");
			}
		}

		if (parentDraggable)
			parentDraggable.draggable = true;
		resizing = false;
	}

	function updateListeners(direction) {
		if (props.onResize) {
			props.onResize(direction);
		}
	}

	return (
		<rect {...props}
		      onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}/>
	)
}