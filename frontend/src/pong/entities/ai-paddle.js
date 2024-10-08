import Paddle from "./paddle.js";
import Rect2 from "../maths/rect2.js";
import Vec2 from "../maths/vec2.js";
import MyMaths from "../maths/maths.js";


export default class AiPaddle extends Paddle {
	constructor(ctx, size, speedY, boundBox, isLeftSide=true) {
		super(size, speedY);
		this.ctx = ctx;
		this.halfHeight = this.size.y / 2;
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

		const impactScalingFactor = (this.pos.x - ballPos.x) / ballSpeed.x;
		const impactPoint = Vec2.rAdd(ballPos, Vec2.rScale(ballSpeed, impactScalingFactor));
		this.impactPos = impactPoint;

		if (this.boundBox.isBeyondTopBound(impactPoint) || this.boundBox.isBeyondBottomBound(impactPoint)) {
			
			const ricochetScalingFactor = this.boundBox.isBeyondBottomBound(impactPoint) ?
				(this.boundBox.bottomBound - ballPos.y) / ballSpeed.y
				: (this.boundBox.topBound - ballPos.y) / ballSpeed.y;
			const ricochetImpactPoint = Vec2.rAdd(ballPos, Vec2.rScale(ballSpeed, ricochetScalingFactor));

			const finalBallSpeed = new Vec2(ballSpeed.x, -ballSpeed.y);
			const finalScalingFactor = (this.pos.x - ricochetImpactPoint.x) / finalBallSpeed.x;
			const finalImpactPoint = Vec2.rAdd(ricochetImpactPoint, Vec2.rScale(finalBallSpeed, finalScalingFactor));
			this.impactPos = finalImpactPoint;
		}
	}
}
