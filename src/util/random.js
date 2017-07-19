function random(min = 0, max = 1){
    let range = max - min;
    return (Math.random() * range) + min;
}

export default random;