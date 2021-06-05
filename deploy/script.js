//canvas setup
const canvas=document.getElementById('canvas1');
const ctx=canvas.getContext('2d');
canvas.width=800;
canvas.height=600;
let score=0;
let gameFrame=0;
ctx.font="19px Georgia";
let gameOver=false;
//reset game
function resetGame(){
    console.log('reset');
    gameOver=false;
     player=new Player();
     enemy1=new Enemy();
     score=0;
    animate();
}
//mouse interactivity
let canvasPosition=canvas.getBoundingClientRect();
const mouse={
    x:canvas.width/2,
    y:canvas.height/2,
    click:false
}
canvas.addEventListener('mousedown',function(event){
    mouse.click=true;
    mouse.x=event.x-canvasPosition.left;
    mouse.y=event.y-canvasPosition.top;
    //console.log(mouse.x,mouse.y);
   
});
canvas.addEventListener('mouseup',function(event){
    mouse.click=false;
});
//player
const playerLeft=new Image();
playerLeft.src="fish_swim_left.png";
const playerRight=new Image();
playerRight.src="fish_swim_right.png";
class Player{
    constructor(){
        this.x=0;
        this.y=canvas.height/4;
        this.radius=50;
        this.angle=0;
        this.frameX=0;
        this.frameY=0;
        this.spriteW=498;
        this.spriteH=327;
    }
    update(){
        const dx=this.x-mouse.x;
        const dy=this.y-mouse.y;
        let theta=Math.atan2(dy,dx);
        this.angle=theta;
        if(mouse.x!=this.x){
            this.x-=dx/30;
        }
        if(mouse.y!=this.y){
            this.y-=dy/30;
        }
    }
    draw(){
         if(mouse.click){
             ctx.lineWidth=0.3;
             ctx.beginPath();
             ctx.moveTo(this.x,this.y);
             ctx.lineTo(mouse.x,mouse.y);
             ctx.stroke();
         }
        // ctx.fillStyle='blue';
         //ctx.beginPath();
         //ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
         //ctx.fill();
         //ctx.closePath();
         //ctx.fillRect(this.x,this.y,this.radius,10);
         ctx.save();
         ctx.translate(this.x,this.y);
         ctx.rotate(this.angle);
         if(this.x>=mouse.x){
         ctx.drawImage(playerLeft,this.frameX*this.spriteW,this.frameY*this.spriteH,
            this.spriteW,this.spriteH,0-60,0-45,this.spriteW/4,this.spriteH/4);
         }else{
            ctx.drawImage(playerRight,this.frameX*this.spriteW,this.frameY*this.spriteH,
                this.spriteW,this.spriteH,0-60,0-45,this.spriteW/4,this.spriteH/4);
         }
         ctx.restore();
    }

}
//const player=new Player();
 player=new Player();
//bubble
const bubblesArray=[];
const bubblePop1=document.createElement('audio');
bubblePop1.src="sound\\plop.ogg";
const bubblePop2=document.createElement('audio');
bubblePop2.src="sound\\plop2.wav";
const bubbleImage=new Image();
bubbleImage.src="bubble-64px.png";

class Bubble{
    constructor(){
        this.x=Math.random()*canvas.width;
        this.y=canvas.height+100;
        this.radius=50;
        this.speed=Math.random()*5+1;
        this.distance;
        this.counted=false;
        this.sound=Math.random()<=0.5 ? 'sound1':'sound2';
    }
    update(){
        this.y-=this.speed;
        const dx=this.x-player.x;
        const dy=this.y-player.y;
        this.distance=Math.sqrt(dx*dx+dy*dy);
    }
    draw(){
        /*
        ctx.fillStyle="aqua";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        */
        ctx.drawImage(bubbleImage,this.x-50,this.y-50,this.radius*2.0,this.radius*2.0);
    }
    
}
function handleBubbles(){
    if(gameFrame%50==0){
        bubblesArray.push(new Bubble());
        //console.log(bubblesArray.length);
    }
    for(let i=0;i<bubblesArray.length;i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
        if(bubblesArray[i].y<0-bubblesArray[i].radius*2){
            bubblesArray.splice(i,1);
            i--
        }else if(bubblesArray[i]){
            //collision
            if(bubblesArray[i].distance<bubblesArray[i].radius+player.radius){
                if(!bubblesArray[i].counted){
                    if(bubblesArray[i].sound=='sound1'){
                        bubblePop1.play();
                    }else{
                        bubblePop2.play();
                    }
                    score++;
                    bubblesArray[i].counted=true;
                    bubblesArray.splice(i,1);
                    i--;
                }
            }
        }
       
       
    }
  

    
}
//Repeating backgrounds
const background=new Image();
background.src='background1.jpg';
function handleBackground(){
    ctx.drawImage(background,0,0,canvas.width,canvas.height);
}
//enemies
const enemyImage=new Image();
enemyImage.src='fish_enemy_swim.png';
class Enemy{
    constructor(){
        this.x=canvas.width-200;
        this.y=Math.random()*(canvas.height-150)+90;
        this.radius=60;
        this.speed=Math.random()*2+2;
        this.frame=0;
        this.frameX=0;
        this.frameY=0;
        this.spriteW=418;
        this.spriteH=397;
    }
    draw(){
        /*
        ctx.fillStyle="red";
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.radius,0,Math.PI*2);
        ctx.fill();
        */
        ctx.drawImage(enemyImage,this.frameX*this.spriteW,this.frameY*this.spriteH,this.spriteW,this.spriteH,this.x-60,this.y-70,this.spriteW/3,this.spriteH/3);
    }
    update(){
        this.x-=this.speed;
        if(this.x<0-this.radius*2){
            this.x=canvas.width+200;
            this.y=Math.random()*(canvas.height-150)+90;
            this.speed=Math.random()*4+6;
        }
        if(gameFrame%5==0){
            this.frame++;
            if(this.frame>=12) this.frame=0;
            if(this.frame==3|| this.frame==7||this.frame==11){
                this.frameX=0;
            }else{
                this.frameX++;
            }
            if(this.frame<3) this.frameY=0;
            else if(this.frameY<7) this.frameY=1;
            else if(this.frameY<11) this.frameY=2;
            else this.frameY=0;
        }
        //collision with player
        const dx=this.x-player.x;
        const dy=this.y-player.y;
        const distance=Math.sqrt(dx*dx+dy*dy);
        if(distance<this.radius+player.radius){
            handleGameOver();
        }

    }
}
//const enemy1=new Enemy();
enemy1=new Enemy();
function handleEnemies(){
    enemy1.draw();
    enemy1.update();
   

}
function handleGameOver(){
    ctx.fillStyle="black";
    ctx.fillText('GAME OVER, you reached score '+score+', cand esti prost si viata ii grea (citat de Bran David)!',10,140);
    gameOver=true;

}
//animation loop
function animate(){
   
    ctx.clearRect(0,0,canvas.width,canvas.height);
    handleBackground();
    handleEnemies();
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle='black';
    ctx.fillText('score:'+score,10,30);
    gameFrame++;
   
    if(!gameOver) requestAnimationFrame(animate);
}
animate();
window.addEventListener('resize',function(){
    canvasPosition=canvas.getBoundingClientRect();
});
