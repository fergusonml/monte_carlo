/*<!--Copyright 2014 Matthew Lee Ferguson-->*/
/*<!--Javascript μLecture Demonstrations by Matthew Lee Ferguson is distrubuted under terms of the GNU General Public License as published by the Free Software Foundation.
Based on a work at http://physics.boisestate.edu/ferguson/.-->*/
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var chart2 = document.getElementById('chart2');
var context_chart2 = chart2.getContext('2d'); 

var radius = 5;
var red = "#330000";
var green = "#0000ff";
var yellow = "#333300";
var red2 = "#ff0000";
var green2 = "#00ff00";
var yellow2 = "#ffff00";
var blue = "#0000ff";
var balls;
var data1= new TimeSeries();
var data2= new TimeSeries();
var t1=0;
var graph1;
var lambda=1;
var N=100;
var numBalls = 1*N;
var D=1;
var dt = 1;
var w=canvas.width/2.,z=canvas.height/2.;
var photons=2.0;
var win=100;
var xmin=0,xmax=canvas.width;
var ymin=0,ymax=canvas.height;
var photons_green=0, photons_blue=0;
var piEstimate=0.;
var BD=true;
var reflective=false;

window.onload = init;

function P(x,y,w,z){
        if (x*x+y*y<w*z) return 1;
        else return 0;
}

function init() {
	graph1 = new Graph(context_chart2,xmin,xmax,ymin,ymax,0,chart2.width,chart2.width,chart2.height);	
	context_chart2.clearRect(0, 0, chart2.width, chart2.height); 
        context_chart2.clearRect(0, 0, chart2.width, chart2.height); 
	graph1.drawgrid((xmax-xmin)/2,(xmax-xmin)/4,(ymax-ymin)/2,(ymax-ymin)/4);					


	t1=0;
	balls = new Array();
	for (var i=0; i<numBalls; i++){
		if (i<N) var ball = new Ball(radius,green);	
		else if (i<2*N) var ball = new Ball(radius,red);	
		else var ball = new Ball(radius,yellow);	
		ball.x = Math.random()*canvas.width-radius;
		ball.y = Math.random()*canvas.height-radius;
		ball.draw(context);
		balls.push(ball);
	}  
	setInterval(onEachStep, dt); // 60 fps
};
 
function onEachStep() {
	context.clearRect(0, 0, canvas.width, canvas.height); 
        context.fillStyle = '#ffffff';
	context.ellipse(canvas.width/2, canvas.height/2, w, z, 0, 0, Math.PI*2,true);
	//context.arc(canvas.width/2,canvas.height/2,50,0,2*Math.PI,true);
	context.fill();
	for (var i=0; i<numBalls; i++){
		var ball = balls[i];
        if (BD) {
         ball.x += (2*Math.random()-1)*Math.sqrt(3)*Math.sqrt(2*D*dt); // horizontal speed increases horizontal position 
         ball.y += (2*Math.random()-1)*Math.sqrt(3)*Math.sqrt(2*D*dt); // vertical speed increases vertical position
        } else {
         ball.x = Math.random()*canvas.width; // horizontal speed increases horizontal position 
         ball.y = Math.random()*canvas.height; // vertical speed increases vertical position
        }
                        //if (ball.y > canvas.height - radius){ 
        if (ball.y > canvas.height){ 
            if (reflective) ball.y = canvas.height - radius; 
            else ball.y -=canvas.height;
        }
	//if (ball.x > canvas.width - radius){ 
        if (ball.x > canvas.width){ 
            if (reflective) ball.x = canvas.width - radius; 
            else ball.x -=canvas.width;
        }
	//if (ball.y < radius){ 
	if (ball.y < 0){ 
            if (reflective) ball.y = radius; 
            else ball.y += canvas.height;
	}
	//if (ball.x < radius){ 
	if (ball.x < 0){ 
            if (reflective) ball.x = radius;
            else ball.x += canvas.width;
	}
        if (Math.random()<P(ball.x-canvas.width/2.0,ball.y-canvas.height/2.0,w,z)) 
        {
        	if (i<N) ball.color=green2;	
			else if (i<2*N) ball.color=red2;	
			else if (i<4*N) ball.color=yellow2;
		graph1.plot([ball.x],[ball.y],'#00ff00',true,true);
                photons_green+=1.;
        } else {
        	if (i<N) ball.color=green;	
			else if (i<2*N) ball.color=red;	
			else if (i<4*N) ball.color=yellow;	
		graph1.plot([ball.x],[ball.y],'#0000ff',true,true);
                photons_blue+=1.;
        }			

		ball.draw(context); 
	}
        piEstimate=4.*photons_green/(photons_green+photons_blue);
	data1.append(new Date().getTime(), piEstimate);
	if (Math.floor(t1/dt)%1000 ==0) {
            console.log(t1,piEstimate);
            console.log(piEstimate);
        }
       	t1+=dt;
};
 