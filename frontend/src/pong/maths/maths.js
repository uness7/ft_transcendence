export default class MyMaths {

    static pointConversion(pointA, originalStart, originalEnd, newStart, newEnd) {
        const length = originalEnd - originalStart;
        const newLength = newEnd - newStart;
        return ((pointA - originalStart) * (newLength / length) + newStart);
    }

    static primitiveRandomDistribution = () => {
        const iterations = 6;
        let res = 0;

        for (let i = 0; i < iterations; i++) {
            res += Math.random();
        }
        return res / iterations;
    }
}
