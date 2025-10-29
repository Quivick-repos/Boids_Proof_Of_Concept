class coordinates{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

class boid {
    constructor(_x,_y,index){
        this.x                  = _x;
        this.y                  = _y; 
        this.id                 = index+1;
        //this.avoidanceFactor    = avoidanceFactor;
        this.name               = `Boid ${index+1}`;
        this.color              = Color.randomColor();//getRandomColor();
        this.height             = 12.5;
        this.width              = 6.25;
        this.size               = 10;
        this.center             = new coordinates((this.x+(this.size/2)),(this.y-(this.size/3)))
        this.speed              = boidSpeed;
        this.speedX             = boidSpeed;
        this.speedY             = boidSpeed;
        //this.detectionRange     = boidRange;
        this.angleDegrees       = Math.random()*360;
        this.angle              = this.angleDegrees*(Math.PI/180);
        this.randomizedColor    = false;
    }

    draw(context){
        context.save()
        context.beginPath();
        
        //this.angle = this.angleDegrees*(Math.PI/180);
        this.angle = Math.atan2(this.speedY   ,  this.speedX ) + (90*(Math.PI/180));
        var x1 = this.x;
        var y1 = this.y - this.height / 2;
        var x2 = this.x + this.width / 2;
        var y2 = this.y + this.height / 2;
        var x3 = this.x - this.width / 2;
        var y3 = y2;

        var x1r = ((x1 - this.x) * Math.cos(this.angle) - (y1 - this.y) * Math.sin(this.angle) + this.x);
        var y1r = ((x1 - this.x) * Math.sin(this.angle) + (y1 - this.y) * Math.cos(this.angle) + this.y);
        var x2r = ((x2 - this.x) * Math.cos(this.angle) - (y2 - this.y) * Math.sin(this.angle) + this.x);
        var y2r = ((x2 - this.x) * Math.sin(this.angle) + (y2 - this.y) * Math.cos(this.angle) + this.y);
        var x3r = ((x3 - this.x) * Math.cos(this.angle) - (y3 - this.y) * Math.sin(this.angle) + this.x);
        var y3r = ((x3 - this.x) * Math.sin(this.angle) + (y3 - this.y) * Math.cos(this.angle) + this.y);
        let centerX = (x1r+x2r+x3r)/3;
        let centerY = (y1r+y2r+y3r)/3;

        this.center =  new coordinates(centerX,centerY)


        context.moveTo(x1r, y1r);
        context.lineTo(x2r, y2r);
        context.lineTo(x3r, y3r);
        context.lineTo(x1r, y1r);


        context.fillStyle = this.color.getValue();
        context.fill();
        context.closePath();
        context.restore();
    }

    drawInfo(context, boid){
        if(showContactRange){
            context.beginPath();
            context.arc(this.center.x,this.center.y,boidRange,0,2 * Math.PI);
            context.strokeStyle = "pink";
            context.stroke();
            context.closePath();
        }
        if(showVisualRange){
            context.beginPath();
            context.arc(this.center.x,this.center.y,boidVisualRange,0,2 * Math.PI);
            context.strokeStyle = "purple";
            context.stroke();
            context.closePath();
        }
        if (showInteractions){
            context.beginPath();
            context.strokeStyle = "white";       
            context.moveTo(boid.center.x,boid.center.y);
            context.lineTo(this.center.x,this.center.y);
            context.stroke();
            context.closePath(); 
        }
    }

    checkBorderPosition(){
        if (this.x > containerDivWidth){
            this.x = 1;
        }else if (this.x < 0){
            this.x = containerDivWidth;
        }
        if (this.y > containerDivHeight){
            this.y = 1;
        }else if (this.y < 0){
            this.y = containerDivHeight;
        }
    }

    

    checkIfAnyBoidsInRange(context){
        //this.avoidanceFactor = 0.01;
        if ((Date.now() - lastTimeIteration)>0.01){
            let closestBoidCenterX      =0;
            let closestBoidCenterY      =0;
            let lastRecordedDistance    =0;
            let distanceX               =0;
            let distanceY               =0;
            let distance                =0;

            let numberInrange           =0;
            let numberInCloserange      =0;
            let averagePositionX        =0;
            let averagePositionY        =0;
            let averageSpeedX           =0;
            let averageSpeedY           =0;
            
            boidArray.forEach((boid)=>{
                if(this.id != boid.id){
                    distanceX = this.center.x - boid.center.x;
                    distanceY = this.center.y - boid.center.y;
                    distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
                    lastRecordedDistance = boidRange;
                    if (Math.abs(distance)<boidVisualRange){
                        //context.strokeStyle = "red";
                        if(Math.abs(distance)<boidRange){
                                //context.strokeStyle = "red";
                                //lastRecordedDistance = distance;
                                closestBoidCenterX  += distanceX;
                                closestBoidCenterY  += distanceY;

                                numberInCloserange++;
                        }else if (Math.abs(distance)<boidVisualRange){
                            numberInrange++;
                            //averageRed          += boid.color.red;
                            //averageGreen        += boid.color.green;
                            //averageBlue         += boid.color.blue;
                            averagePositionX    += boid.center.x;
                            averagePositionY    += boid.center.y;
                            averageSpeedX       += boid.speedX;
                            averageSpeedY       += boid.speedY;
                            //averageColor        += boid.color;

                        }




                        //this.angleDegrees++;

                        this.drawInfo(context,boid);

                            
                        
                        
                        this.angleDegrees = Math.atan2(distanceY,distanceY) * (Math.PI/180);

                        //context.beginPath();       
                        //context.moveTo(boid.center.x,boid.center.y);
                        //context.lineTo(this.center.x,this.center.y);
                        //context.stroke();
                        //context.closePath();
                    }
                }
                
            });
            //this.avoidanceFactor = 0.01;
            if(numberInrange>0){
                this.randomizedColor = false;
                if(numberInrange>15){
                    
                    //averageRed          = Math.floor(averageRed     /   numberInrange);
                    if (this.color.red>255){
                        this.color.red = 255;
                    }else if(this.color.red<255){
                        this.color.red += 1;
                    }
    
                    //averageGreen        = Math.floor(averageGreen   /   numberInrange);
                    if (this.color.green>187){
                        this.color.green -= 1;
                    }else if(this.color.green<187){
                        this.color.green  += 1;
                    }
    
                    //averageBlue         = Math.floor(averageBlue    /   numberInrange);
                    if (this.color.blue>217){
                        this.color.blue -= 1;
                    }else if(this.color.blue<217){
                        this.color.blue += 1;
                    }
                    //this.color          = new Color (averageRed,averageGreen,averageBlue);
                }else{
                        //this.avoidanceFactor = 0.1;

                        //averageRed          = Math.floor(averageRed     /   numberInrange);
                        if (this.color.red>213){
                            this.color.red -= 1;
                        }else if(this.color.red<213){
                            this.color.red += 1;
                        }
        
                        //averageGreen        = Math.floor(averageGreen   /   numberInrange);
                        if (this.color.green>0){
                            this.color.green -= 1;
                        }else if(this.color.green<0){
                            this.color.green  = 0;
                        }
        
                        //averageBlue         = Math.floor(averageBlue    /   numberInrange);
                        if (this.color.blue>4){
                            this.color.blue -= 1;
                        }else if(this.color.blue<4){
                            this.color.blue += 1;
                        }

                        /*if (numberInrange>20){
                            this.avoidanceFactor = 5;
                        }*/
    
            }
                



                averagePositionX    = averagePositionX  / numberInrange;
                averagePositionY    = averagePositionY  / numberInrange;
                averageSpeedX       = averageSpeedX     / numberInrange;
                averageSpeedY       = averageSpeedY     / numberInrange;

                //let angleFromClosest = Math.atan2(closestBoidCenterY - this.y   , closestBoidCenterX - this.x)* 180 / Math.PI;
                this.speedCalculations(averagePositionX,averagePositionY,averageSpeedX,averageSpeedY, closestBoidCenterX,closestBoidCenterY);
                
            }

            
            this.speedX +=  (closestBoidCenterX*avoidanceFactor) ;
            this.speedY +=  (closestBoidCenterY*avoidanceFactor) ;
            this.speedAdjustment();
        }
    }

    speedAdjustment(){
        this.speed = Math.sqrt(this.speedX*this.speedX + this.speedY*this.speedY);

        if(this.speed<=minSpeed){
            this.speedX = (this.speedX/this.speed)* minSpeed;
            this.speedY = (this.speedY/this.speed)* minSpeed;

        }else if(this.speed>maxSpeed){
            this.speedX = (this.speedX/this.speed)* maxSpeed;
            this.speedY = (this.speedY/this.speed)* maxSpeed;
        }
    }

    update(context){
        
        
        this.checkBorderPosition();
        this.checkIfAnyBoidsInRange(context);
        this.movement();
        this.draw(context);
        
    }   

    separation(){}
    alignment(){}
    cohesion(){}

    speedCalculations(averagePositionX,averagePositionY,averageSpeedX,averageSpeedY,closestBoidCenterX,closestBoidCenterY,){
        this.speedX += (((averagePositionX - this.center.x)*cohesionFactor) + ((averageSpeedX - this.speedX)*matchingFactor ))  ;
        this.speedY += (((averagePositionY - this.center.y)*cohesionFactor) + ((averageSpeedY - this.speedY)*matchingFactor ))  ;
    }


    movement(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
}
class Color{
    constructor(r,g,b){
        this.red = r;
        this.green = g;
        this.blue = b;
        //this.value = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }
    static randomColor(){
        return new Color(this.red = Math.floor(Math.random() * 255),this.red = Math.floor(Math.random() * 255),this.red = Math.floor(Math.random() * 255));
    }
    getValue(){
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }
}



let arrayMinLength      = 0;
let arrayLength         = 250;
let arrayLengthTemp     = arrayLength;
let arrayMaxLength      = 500;
let arrayLengthSlider   = document.getElementById("numberOfBoidsSlider");

let showContactRange    = false;
let showVisualRange     = false;
let showInteractions    = false;
let boidMinRange        = 1;
let boidRange           = 25;
let boidRangeTemp       = boidRange;
let boidMaxRange        = 50;
let boidRangeSlider           = document.getElementById("boidsContactRangeSlider");

let boiMinVisualRange   = boidMaxRange;
let boidVisualRange     = 80;
let boidVisualRangeTemp = boidVisualRange;
let boidMaxVisualRange  = 110;
let boidVisualRangeSlider = document.getElementById("boidsVisualRangeSlider");

let minCohesionFactor   = 0.00001;
let cohesionFactor      = 0.0005;
let cohesionFactorTemp  = cohesionFactor;
let maxCohesionFactor   = 0.001;
let cohesionSlider      = document.getElementById("cohesionSlider");

let minAvoidanceFactor  = 0.001;
let avoidanceFactor     = 0.01;
let avoidanceFactorTemp = avoidanceFactor;
let maxAvoidanceFactor  = 0.02;
let avoidanceSlider     = document.getElementById("avoidanceSlider");

let boidSpeed           = 1;
let maxSpeed            = 3.5;
let minSpeed            = 1;

let boidArray           = [];

let matchingFactor      = 0.05;
let containerDivHeight;
let containerDivWidth
let canvasCtx;
let lastTimeIteration   = Date.now();


function sliderListener(){
    let display = this.parentElement.querySelector('.valueDisplay');
    display.textContent = this.value;
    switch (this.id){
        case "numberOfBoidsSlider":
            arrayLengthTemp     = this.value;
            break;
        case "boidsContactRangeSlider":
            boidRangeTemp       = this.value;
            break;
        case "boidsVisualRangeSlider":
            boidVisualRangeTemp = this.value;
            break;
        case "cohesionSlider":
            cohesionFactorTemp  = this.value;
            break;
        case "avoidanceSlider":
            avoidanceFactorTemp = this.value;
            break;
        default :
            console.log("uh?");
            break;
        
    }
    

}
function checkboxListener(){
    switch(this.id){
        case "showContactRange":
            showContactRange = this.checked;
            break;
        case "showVisualRange":
            showVisualRange = this.checked;
            break;
        case "showInteractions":
            showInteractions = this.checked;
            break;
        default:
            console.log("checkbox: uh?");
            break;
    }
}

function setupCanvas(){
    let container = document.getElementById("containerDiv");
    containerDivHeight = document.getElementById("containerDiv").clientHeight;
    containerDivWidth = document.getElementById("containerDiv").clientWidth;
    let canvas = document.createElement('canvas');
    canvas.width = containerDivWidth;
    canvas.height = containerDivHeight;
    canvasCtx = canvas.getContext("2d");
    container.appendChild(canvas);
    spawnBoids();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function getRandomColorRGB() {
    let red =Math.floor(Math.random() * 255) ;
    let green=Math.floor(Math.random() * 255) ;;
    let blue=Math.floor(Math.random() * 255) ;;
    var color = `rgb(${red}, ${green}, ${blue})`;
    return color;
}


function spawnBoids(){
    boidArray=[];
    for (let i = 0; i<arrayLength;i++){
        let boidling = new boid((Math.random() * (containerDivWidth )),((Math.random() * (containerDivHeight))),i)
        boidling.draw(canvasCtx)
        boidArray.push(boidling)
    }
}

const animate = () =>{
    canvasCtx.clearRect(0, 0, containerDivWidth, containerDivHeight);
    boidArray.forEach((boid)=>{
        canvasCtx.save();
        boid.update(canvasCtx);
        canvasCtx.restore();
    });
    requestAnimationFrame(animate);
}

function setMinsAndMax(slider){
    switch (slider.id){
        case "numberOfBoidsSlider":
            slider.min      = arrayMinLength;
            slider.max      = arrayMaxLength;
            slider.step     ="1.0";
            slider.value    = arrayLength;
            break;
        case "boidsContactRangeSlider":
            slider.min      = boidMinRange;
            slider.max      = boidMaxRange;
            slider.step     ="1.0";
            slider.value    = boidRange;
            break;
        case "boidsVisualRangeSlider":
            slider.min      = boiMinVisualRange;
            slider.max      = boidMaxVisualRange;
            slider.step     ="1.0";
            slider.value    = boidVisualRange;
            break;
        case "cohesionSlider":
            slider.min      = minCohesionFactor;
            slider.max      = maxCohesionFactor;
            slider.step     ="0.00001";
            slider.value    = cohesionFactor;
            break;
        case "avoidanceSlider":
            slider.min      = minAvoidanceFactor;
            slider.max      = maxAvoidanceFactor;
            slider.step     ="0.001";
            slider.value    = avoidanceFactor;
            break;
        default :
            console.log("uh?");
            break;
        
    }
}

function buttonListener(){
    arrayLength     = arrayLengthTemp;
    cohesionFactor  = cohesionFactorTemp;
    avoidanceFactor = avoidanceFactorTemp;
    boidRange       = boidRangeTemp;
    boidVisualRange = boidVisualRangeTemp;
    canvasCtx.clearRect;
    spawnBoids();
}



//###############################   MAIN   #############################//
window.onload = function(){
    document.getElementById("currentNumberBoids")       .innerHTML= arrayLength;
    document.getElementById("currentBoidsContact")      .innerHTML= boidRange;
    document.getElementById("currentVisualRange")       .innerHTML= boidVisualRange;
    document.getElementById("currentCohesionFactor")    .innerHTML= cohesionFactor;
    document.getElementById("currentAvoidanceFactor")   .innerHTML= avoidanceFactor;

    document.getElementById("applyChangeBtn").addEventListener('click',buttonListener);

    document.querySelectorAll('.slider').forEach(slider => {
        setMinsAndMax(slider);
        slider.addEventListener('input', sliderListener)
    });
    document.querySelectorAll('.checkbox').forEach(checkbox =>{
        checkbox.checked = false;
        checkbox.addEventListener('input', checkboxListener)
    });
}



setupCanvas();

animate();

//###############################   MAIN   #############################//







