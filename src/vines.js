import PF from "pathfinding";

import isElement from "./util/isElement.js";
import random from "./util/random.js";

import Point from "./object/Point.js";
import Obstical from "./object/Obstical.js";
import CollisionMap from "./object/CollisionMap.js";


(()=>{

    class Vines {
        
        constructor(el,startPoint,endPoint){
            if(!isElement(el)) return;
            
            this.el = el;

            this.startPoint = startPoint;
            this.endPoint = endPoint;
            
            this.init();
            
            window.addEventListener("resize",e=>{
                this.scaleCanvas();
                this.updateObsticals();
                this.updateCollisionMap();
                this.plotVine();
                this.drawGuides();
            },true);
            
        }
        
        
        init(){
            this.canvas = document.createElement("canvas");
            this.scaleCanvas();
            this.el.prepend(this.canvas);
            
            this.ctx = this.canvas.getContext("2d");
            
            this.findObsticals();
            this.updateCollisionMap();
            this.plotVine();
            
            this.drawGuides();
        }
        
        
        scaleCanvas(){
            let rect = this.el.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }
        
        
        findObsticals(){
            this.obsticals = [];
            let rect = this.el.getBoundingClientRect();
            Array.from(this.el.children).forEach(child=>{
                if( child !== this.canvas )
                    this.obsticals.push(new Obstical(child,rect));
            });
        }
        
        updateObsticals(){
            let rect = this.el.getBoundingClientRect();
            this.obsticals.forEach(obs=>obs.update(rect));
        }
        
        updateCollisionMap(){
            if( !this.collisionMap ){
                this.collisionMap = new CollisionMap(this.canvas.width, this.canvas.height);
            }
            this.collisionMap.update(this.obsticals, this.canvas.width, this.canvas.height);
        }
        
        
        drawGuides(){
            if( !true ) return;
            this.ctx.fillStyle = "black";
            this.ctx.drawImage(
                this.collisionMap.canvas,0,0,
                this.canvas.width,this.canvas.height
            );
            
            this.ctx.fillStyle = "green";
            this.drawPoint(this.startPoint.x, this.startPoint.y, 8);
            
            this.ctx.fillStyle = "red";
            this.drawPoint(this.endPoint.x, this.endPoint.y, 8);
            
            this.ctx.fillStyle = "orange";
            this.vinePoints.forEach(point=>this.drawPoint(point.x,point.y,4));
        }
        
        
        drawPoint(x = 0, y = 0, size = 5){
            let pX = this.canvas.width / 100 * x;
            let pY = this.canvas.height / 100 * y;
            this.ctx.beginPath();
            this.ctx.arc(pX, pY, size, 0, Math.PI*2);
            this.ctx.fill();
        }
        
        
        plotVine(){
            this.vinePoints = [];
            this.vinePoints.push(new Point(this.startPoint.x,this.startPoint.y));


            let matrix = this.collisionMap.getGrid();
            let grid = new PF.Grid(matrix);

            let sX = Math.round(( (this.canvas.width/100) * this.startPoint.x ) / this.collisionMap.scale);
            let sY = Math.round(( (this.canvas.height/100) * this.startPoint.y ) / this.collisionMap.scale);
            let eX = Math.round(( (this.canvas.width/100) * this.endPoint.x ) / this.collisionMap.scale);
            let eY = Math.round(( (this.canvas.height/100) * this.endPoint.y ) / this.collisionMap.scale);

            if( sX >= this.collisionMap.width ) sX = this.collisionMap.width - 1;
            if( sY >= this.collisionMap.height ) sY = this.collisionMap.height - 1;
            if( eX >= this.collisionMap.width ) eX = this.collisionMap.width - 1;
            if( eY >= this.collisionMap.height ) eY = this.collisionMap.height - 1;

            console.log(matrix);
            console.log(this.collisionMap.width,this.collisionMap.height);
            console.log(sX,sY,eX,eY);

            let finder = new PF.AStarFinder({
                    allowDiagonal: true,
                    dontCrossCorners: true
                });
            let path = finder.findPath(sX,sY,eX,eY,grid);

            path.forEach(point=>{
                let x = (point[0] / this.collisionMap.width) * 100;
                let y = (point[1] / this.collisionMap.height) * 100;
                this.vinePoints.push(new Point(x,y));
            });


            this.vinePoints.push(new Point(this.endPoint.x,this.endPoint.y));
        }
        
        
    }


    window.Vines = Vines;

})();