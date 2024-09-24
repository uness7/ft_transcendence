import { canvas, ctx, canvasWidth, canvasHeight } from "./canvas.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js"
import TextHUD from "./text-hud.js"


// set canvas dimensions
canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);

const paddleLeft = new Paddle(15, 100, 20);
const paddleRight = new Paddle(15, 100, 20, "right");
const ball = new Ball();
const mainText = new TextHUD("Hello", 50);
const gameEntities = [paddleLeft, paddleRight, ball, mainText];
const timeBeforeGameStarts = 5;

document.addEventListener("keydown", event => {
	// w: 		  player left  - move up
	// s: 		  player left  - move down
	if (event.key == "w") {
		paddleLeft.position.y -= 5;
	} else if (event.key == "s") {
		paddleLeft.position.y += 5;
	}

});

// const GameState = {
// 	Init: "init",
// 	Menu: "menu",
// 	Serve: "serve",
// 	Play: "play"
// }

// let isPlayerServe = true;
// let currentGameState = GameState.Init;

const render = entities => {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	entities.forEach(entity => {
		if (entity.render) {
			entity.render();
		}
	});
}

const mainLoop = () => {
	render(gameEntities);
	requestAnimationFrame(mainLoop);
}

const gameLoadTimer = () => {
	return new Promise(resolve => {
		let timeToWait = timeBeforeGameStarts;
		const timer = setInterval(() => {
			mainText.text = `Game starts in ${timeToWait}...`;
			render(gameEntities);
			timeToWait--;
			if (timeToWait <= 0)
			{
				clearInterval(timer);
				resolve();
			}
		}, 1_000);
	});
}

const loadGame = () => {
	gameLoadTimer()
		.then(() => console.log("START"));
}



window.addEventListener("load", loadGame);
