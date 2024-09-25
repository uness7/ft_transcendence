const defaultConfig = {
	canvas: {
		width: 1280,
		height: 720
	},
	paddle: {
		size: {
			x: 15,
			y: 100
		},
		speed: 400,
		padding: 20,
		color: "white"
	},
	ball: {
		radius: 8,
		color: "white",
		speed: 400
	},
	game: {
		maxScore: 3,
		playerIsLeftSide: true,
		timeBeforeGameStarts: 3,
		timeBeforeRoundStarts: 1.25,
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

export default defaultConfig;
