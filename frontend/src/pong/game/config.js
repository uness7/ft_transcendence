const defaultConfig = {
	canvas: {
		width: 1280,
		height: 720
	},
	paddle: {
		size: {
			x: 15,
			y: 125
		},
		sizeAi: {
			x: 15,
			y: 125
		},
		speed: 520,
		speedAi: 520,
		padding: 20,
		color: "white"
	},
	ball: {
		radius: 8,
		color: "white",
		speed: 500
	},
	game: {
		maxScore: 3,
		playerIsLeftSide: true,
		timeBeforeGameStarts: 3,
		timeBeforeRoundStarts: 1.25,
		playerImmortal: false
	},
	text: {
		color: "white",
		fontMain: "48px serif",
		fontScores: "48px serif",
		yPaddingMain: 50,
		yPaddingScores: 100
	},
	ai: {
		chaseBuffer: 10
	}
};

const gameConfig = {
	canvas: {
		width: 1280,
		height: 720
	},
	paddle: {
		size: {
			x: 15,
			y: 125
		},
		sizeAi: {
			x: 15,
			y: 125
		},
		speed: 520,
		speedAi: 520,
		padding: 20,
		color: "white"
	},
	ball: {
		radius: 8,
		color: "white",
		speed: 500
	},
	game: {
		maxScore: 3,
		playerIsLeftSide: true,
		timeBeforeGameStarts: 3,
		timeBeforeRoundStarts: 1.25,
		playerImmortal: false
	},
	text: {
		color: "white",
		fontMain: "48px serif",
		fontScores: "48px serif",
		yPaddingMain: 50,
		yPaddingScores: 100
	},
	ai: {
		chaseBuffer: 18
	}
};
export default gameConfig;

export const togglePlayerSpeedBuff = () => {
	if (gameConfig.paddle.speed === defaultConfig.paddle.speed) {
		gameConfig.paddle.speed = 620;
	} else {
		gameConfig.paddle.speed = defaultConfig.paddle.speed;
	}
}

export const togglePlayerLargerPaddle = () => {
	if (gameConfig.paddle.size.y === defaultConfig.paddle.size.y) {
		gameConfig.paddle.size.y = 170;
	} else {
		gameConfig.paddle.size.y = defaultConfig.paddle.size.y;
	}
}

export const toggleFasterBall = () => {
	if (gameConfig.ball.speed === defaultConfig.ball.speed) {
		gameConfig.ball.speed = 700;
	} else {
		gameConfig.ball.speed = defaultConfig.ball.speed;
	}
}

export const togglePlayerImmortal = () => {
	console.log('immortal Before:', gameConfig.game.playerImmortal);
	if (gameConfig.game.playerImmortal) {
		gameConfig.game.playerImmortal = false;
	} else {
		gameConfig.game.playerImmortal = true;
	}
	console.log('immortal After:', gameConfig.game.playerImmortal);
}
