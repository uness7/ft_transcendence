export default class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add = (other) => {
        this.x += other.x;
        this.y += other.y;
    }

    scale = (k) => {
        this.x *= k;
        this.y *= k;
    }

    clone = () => {
        return new Vec2(this.x, this.y);
    }

    copy = (other) => {
        this.x = other.x;
        this.y = other.y;
    }

    static rAdd = (u, v) => {
        return new Vec2(u.x + v.x, u.y + v.y);
    }

    static rScale = (v, k) => {
        return new Vec2(v.x * k, v.y * k);
    }

    static rRotate = (v, angle) => {
        const rad = angle * Math.PI / 180;
        const sine = Math.sin(rad);
        const cosine = Math.cos(rad);
        const res = new Vec2(
            (v.x * cosine) - (v.y * sine),
            (v.x * sine) + (v.y * cosine)
        );
        return res;
    }
}
