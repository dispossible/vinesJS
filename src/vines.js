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

            this.collisionScale = 10;

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

            if( this.collisionMap ){
                this.collisionMap.update(this.obsticals);
            } else {
                this.collisionMap = new CollisionMap(this.obsticals);
            }

            let canvas = document.createElement("canvas");
            canvas.width = this.canvas.width / this.collisionScale;
            canvas.height = this.canvas.height / this.collisionScale;
            let ctx = canvas.getContext("2d");
            this.obsticals.forEach(obs=>{
                ctx.beginPath();
                if( obs.radius >= 25 ){
                    ctx.arc(
                        obs.left/this.collisionScale + (obs.width/(2*this.collisionScale)),
                        obs.top/this.collisionScale + (obs.height/(2*this.collisionScale)),
                        obs.width/(2*this.collisionScale),
                        0,
                        Math.PI*2
                    );
                } else {
                    ctx.rect(
                        obs.left/this.collisionScale,
                        obs.top/this.collisionScale,
                        obs.width/this.collisionScale,
                        obs.height/this.collisionScale
                    );
                }
                ctx.fill();
            });
            this.collisionMap = canvas;
            /*var matrix = [
                [0, 0, 0, 1, 0],
                [1, 0, 0, 0, 1],
                [0, 0, 1, 0, 0],
            ];
            var grid = new PF.Grid(matrix);*/

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
            this.vinePoints.push(new Point(this.endPoint.x,this.endPoint.y));
        }
        
        
    }


    window.Vines = Vines;

})();