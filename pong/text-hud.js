import { ctx } from "./canvas.js";


export default class TextHUD {
	#color;
	#font;
	#text;
	#position

	constructor(text, position, font="48px serif", color="white") {
		this.#color = color;
		this.#font = font;
		this.#position = position;
		this.text = text;
	}

	set text(newText) {
		this.#text = newText;
	}

	render = () => {
		ctx.fillStyle = this.#color;
		ctx.font = this.#font;
		ctx.textAlign = "center";
		ctx.fillText(this.#text, this.#position.x, this.#position.y);
	}
}
