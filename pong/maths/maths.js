export default class MyMaths {

	static pointConversion(pointA, originalStart, originalEnd, newStart, newEnd) {
		const length = originalEnd - originalStart;
		const newLength = newEnd - newStart;
		return ((pointA - originalStart) * (newLength / length) + newStart);
	}
}
