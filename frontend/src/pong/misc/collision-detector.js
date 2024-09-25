
export default class CollisionDetector {

	static pointToPoint = (pointA, pointB) => {
		return pointA.x === pointB.x && pointA.y === pointB.y;
	}

	static pointToRect = (point, rect) => {
		const rectLeft = rect.position.x;
		const rectRight = rect.position.x + rect.size.x;
		const rectTop = rect.position.y;
		const rectBottom = rect.position.y + rect.size.y;

		return (rectLeft <= point.x && point.x <= rectRight
			&& rectTop <= point.y && point.y <= rectBottom
		);
	}
}
