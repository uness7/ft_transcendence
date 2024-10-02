export default class TextHUD {
	constructor(ctx, text, position, font, color) {
		this.color = color;
		this.font = font;
		this.position = position;
		this.text = text;
		this.ctx = ctx;
	}

	render = () => {
		this.ctx.fillStyle = this.color;
		this.ctx.font = this.font;
		this.ctx.textAlign = "center";
		this.ctx.fillText(this.text, this.position.x, this.position.y);
	}
}
