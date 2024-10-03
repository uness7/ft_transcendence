import Paddle from "./paddle.js";
import Rect2 from "../maths/rect2.js";
import Vec2 from "../maths/vec2.js";
import gameConfig from "../game/config.js";
import MyMaths from "../maths/maths.js";


export default class AiPaddle extends Paddle {
	constructor(ctx, boundBox, isLeftSide=true) {
		super();
		this.ctx = ctx;
		this.size = new Vec2(
			gameConfig.paddle.sizeAi.x,
			gameConfig.paddle.sizeAi.y
		);
		this.halfHeight = this.size.y / 2;
		this.resetSpeed = new Vec2(0, gameConfig.paddle.speedAi);
		this.speed = this.resetSpeed.clone();
		this.boundBox = boundBox;
		const x = isLeftSide
			? this.padding
			: boundBox.getSize().x - this.padding - this.size.x;
		this.resetPos = new Vec2(
			x,
			this.boundBox.getHalfHeight() - this.halfHeight
		);
		this.pos = this.resetPos.clone();
		this.rect = new Rect2(this.pos, this.size);
		this.chasePos = this.halfHeight;
		this.impactPos = new Vec2(this.pos.x, this.boundBox.getHalfHeight());
	}

	moveUp = (dt) => {
		this.pos.y -= this.speed.y * dt;
	}

	moveDown = (dt) => {
		this.pos.y += this.speed.y * dt;
	}

	changePosition = () => {
		const randomNbr = MyMaths.primitiveRandomDistribution();
		const randomMin = 0;
		const randomMax = 1;
		const chaseBufferMin = 0;
		const chaseBufferMax = this.size.y;
		this.chasePos = MyMaths.pointConversion(
			randomNbr,
			randomMin,
			randomMax,
			chaseBufferMin,
			chaseBufferMax
		);
	}

	checkMovement = (dt, ballPos, chaseBuffer) => {
		if (ballPos.y <= this.pos.y + this.chasePos - chaseBuffer)
			this.moveUp(dt)
		else if (ballPos.y >= this.pos.y + this.chasePos + chaseBuffer)
			this.moveDown(dt);
		this.updatePosition();
	}

	predictImpact = (ballPos, ballSpeed) => {
		if (ballSpeed.x <= 0)
			return;
		const k = (this.pos.x - ballPos.x) / ballSpeed.x;
		const impact = Vec2.rAdd(ballPos, Vec2.rScale(ballSpeed, k));
		this.impactPos = impact;
		if (this.boundBox.isBeyondTopBound(impact) || this.boundBox.isBeyondBottomBound(impact)) {
			const kI = this.boundBox.isBeyondBottomBound(impact) ?
				(this.boundBox.bottomBound - ballPos.y) / ballSpeed.y
				: (this.boundBox.topBound - ballPos.y) / ballSpeed.y;
			const pI = Vec2.rAdd(ballPos, Vec2.rScale(ballSpeed, kI));
			const newSpeed = new Vec2(ballSpeed.x, -ballSpeed.y);
			const kF = (this.pos.x - pI.x) / newSpeed.x;
			const pF = Vec2.rAdd(pI, Vec2.rScale(newSpeed, kF));
			this.impactPos = pF;
		}
	}
}
