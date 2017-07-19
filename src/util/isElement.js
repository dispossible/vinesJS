function isElement(el){
    return (
        el !== undefined &&
        el !== null &&
        el.nodeType === 1 &&
        typeof el.getBoundingClientRect === "function"
    );
}

export default isElement;