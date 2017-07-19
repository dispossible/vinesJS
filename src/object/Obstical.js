import isElement from "../util/isElement.js";

class Obstical {

    constructor(el,parentRect){
        if(!isElement(el)) return;
        this.el = el;
        this.update(parentRect);
    }

    update(parentRect){
        let rect = this.el.getBoundingClientRect();
        this.top = rect.top - parentRect.top;
        this.left = rect.left - parentRect.left;
        this.bottom = rect.bottom - parentRect.bottom;
        this.right = rect.right - parentRect.right;
        this.width = rect.width;
        this.height = rect.height;
        this.radius = Math.round(this.getRadius());
    }

    getRadius(){
        let style = window.getComputedStyle(this.el).borderRadius;
        if( style.endsWith("px") ){
            let num = parseInt(style);
            let percent = ( num / this.width ) * 100;
            return percent;
        } else
        if( style.endsWith("%") ){
            let num = parseFloat(style);
            return num;
        }
    }

}

export default Obstical;