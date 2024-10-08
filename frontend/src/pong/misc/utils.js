export const timer = (timeToWait) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeToWait * 1000);
    });
}

export const clamp = (value, min, max) => {
    if (value <= min)
        return min;
    else if (value >= max)
        return max;
    else
        return value;
}
