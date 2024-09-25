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
		timeBeforeGameStarts: 1
	}

};

export default defaultConfig;
