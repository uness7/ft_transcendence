const canvas = document.querySelector("#game-canvas")

// global
const aspectRatio = 16 / 9;
const canvasWidth = 1280;
const canvasHeight = canvasWidth / aspectRatio;

// set canvas dimensions
canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);

const render = () => {
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "white";
		ctx.fillRect(10, 10, 100, 100);
	}
}

window.addEventListener("load", render);
