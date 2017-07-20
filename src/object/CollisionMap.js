class CollisionMap {

    constructor(width = 16, height = 9){

        this.scale = 10;

        this.width = Math.round(width / this.scale);
        this.height = Math.round(height / this.scale);

    }

    update(obsticals = [], width, height){
        this.obsticals = obsticals;
        if( width > 0 ) this.width = Math.round(width / this.scale);
        if( height > 0 ) this.height = Math.round(height / this.scale);
        this.buildCanvas();
    }

    buildCanvas(){
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black";
        this.obsticals.forEach(obs=>{
            this.ctx.beginPath();
            if( obs.radius >= 25 ){
                this.ctx.arc(
                    obs.left/this.scale + (obs.width/(2*this.scale)),
                    obs.top/this.scale + (obs.height/(2*this.scale)),
                    obs.width/(2*this.scale),
                    0,
                    Math.PI*2
                );
            } else {
                this.ctx.rect(
                    obs.left/this.scale,
                    obs.top/this.scale,
                    obs.width/this.scale,
                    obs.height/this.scale
                );
            }
            this.ctx.fill();
        });
    }

    getGrid(){

        if( !this.canvas ) this.buildCanvas();

        let grid = [];
        let pixels = this.ctx.getImageData(0,0,this.width,this.height);

        for( var y = 0 ; y < this.height ; y++ ){
            let row = [];
            for( var x = 0 ; x < this.width ; x++ ){

                let index = ((y * this.width) + x) * 4;
                let pixel = pixels.data[index];

                if( pixel > 200 ){
                    row.push(0);
                } else {
                    row.push(1);
                }

            }
            grid.push(row);
        }

        return grid;
    }

}

export default CollisionMap;