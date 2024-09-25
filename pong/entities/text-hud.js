import { ctx } from "../misc/canvas.js";


export default class TextHUD {
	constructor(text, position, font, color) {
		this.color = color;
		this.font = font;
		this.position = position;
		this.text = text;
	}

	render = () => {
		ctx.fillStyle = this.color;
		ctx.font = this.font;
		ctx.textAlign = "center";
		ctx.fillText(this.text, this.position.x, this.position.y);
	}
}
