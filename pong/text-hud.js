import Vec2 from "./vec2.js";
import { ctx, canvasWidth } from "./canvas.js";


export default class TextHUD {
	#color;
	#font;
	#text;
	#position

	constructor(text, yPadding, font="48px serif", color="white") {
		this.#color = color;
		this.#font = font;
		this.#position = new Vec2();
		this.#position.y = yPadding;
		this.text = text;
	}

	set text(newText) {
		ctx.font = "";
		this.#text = newText.str;
		this.#position.x = canvasWidth / 2 - newText.width / 2;
		console.log(this.#position.x, canvasWidth, newText.width);
	}

	render() {
		ctx.font = this.#font;
		ctx.textAlign = "center";
		ctx.fillStyle = this.#color;
		ctx.fillText(this.#text, this.#position.x, this.#position.y);
	}
}
