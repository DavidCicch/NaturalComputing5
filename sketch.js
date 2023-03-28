let Scene = {
  w : 400, h : 400, swarm : [], data : [],
  neighbours : function(x) {
    let r = []
    for(let p  of this.swarm) {
      if (dist(p.pos.x, p.pos.y, x.x, x.y) <= 75) {
        r.push(p)
      }
    }
    return r
  },
  wrap : function(x) {
    if(x.x < 0) x.x += this.w
    if(x.y < 0) x.y += this.h
    if(x.x >= this.w) x.x -= this.w
    if(x.y >= this.h) x.y -= this.h
  }
}

class Particle{
  constructor(){
    this.pos = createVector(random(0, Scene.w), 
                           random(0, Scene.h))
    this.dir = p5.Vector.random2D()
  }
  step(){
    let N = 0, avg_sin = 0, avg_cos = 0, 
        avg_p = createVector(0, 0), 
        avg_d = createVector(0, 0)
    for (let n of Scene.neighbours(this.pos)){
      avg_p.add(n.pos)
      if (n != this) {
        let away = p5.Vector.sub(this.pos, n.pos)
        away.div(away.magSq())
        avg_d.add(away)
      }  
      
      avg_sin += Math.sin(n.dir.heading())
      avg_cos += Math.cos(n.dir.heading())
      N++
    }
    avg_sin /= N; avg_cos /= N, avg_p.div(N), avg_d.div(N), avg_d.mult(20)
    let avg_angle = Math.atan2(avg_sin, avg_cos)
    avg_angle += random(-0.25, 0.25)
    
    // let midpoint = Math.sqrt(200**2 + 200**2)
    let radius1 = 50
    let point1 = createVector(this.pos.x - 100, this.pos.y - 200)
    let length1 = point1.mag()
    let point2 = createVector(this.pos.x - 300, this.pos.y - 200)
    let length2 = point2.mag()
    let point3 = createVector(this.pos.x - 200, this.pos.y - 200)
    
    let radius2 = 80
    let point4 = createVector(this.pos.x - 100, this.pos.y - 200)
    let length4 = point4.mag()
    let point5 = createVector(this.pos.x - 300, this.pos.y - 200)
    let length5 = point5.mag()
    let point6 = createVector(this.pos.x - 200, this.pos.y - 200)
    //let length3 = point3.magSq()
    
    //if((length1 < radius1) || (length2 < radius1) || ((Math.abs(this.pos.y - 200) < 50) && (Math.abs(this.pos.x - 200) < 50))){
    // inner area 
    if(length1 < radius1){
      avg_angle = point1.heading()
      this.dir = p5.Vector.fromAngle(avg_angle)
      this.pos.add(this.dir)
    }
    else if(length2 < radius1){
      avg_angle = point2.heading()
      this.dir = p5.Vector.fromAngle(avg_angle)
      this.pos.add(this.dir)
    }
    else if((Math.abs(point3.x) < 100) && (Math.abs(point3.y) < 50)){
      avg_angle = point3.heading()
      this.dir = p5.Vector.fromAngle(avg_angle)
      this.pos.add(this.dir)
    }
    // outer area
    else if((length4 > radius2) && (length5 > radius2) && ((Math.abs(point6.x) > 100) || (Math.abs(point6.y) > 80))){
      avg_angle = Math.atan2(Math.sin(point6.heading()), Math.cos(point6.heading())) + 180
      this.dir = p5.Vector.fromAngle(avg_angle)
      this.pos.add(this.dir)
    }
    else{      
      this.dir = p5.Vector.fromAngle(avg_angle)
      let cohesion = p5.Vector.sub(avg_p, this.pos)
      cohesion.div(30)
      this.dir.add(cohesion)
      this.dir.add(avg_d)
      this.pos.add(this.dir)
    }
    Scene.wrap(this.pos)
  }
  draw(){
    fill(0)
    ellipse(this.pos.x, this.pos.y, 5, 5)
  }
}

function setup() {
  createCanvas(1000, 1000);
  //print(createVector(random(0, Scene.w)-200, 
   //                        random(0, Scene.h)-200).heading())
  let numBoids = 25
  for(let i = 0; i < numBoids; i++) {
    Scene.swarm.push(new Particle())
    Scene.data.push([])
  }
  // Create a button for saving text
  saveTextBtn = createButton("Save Text");
  saveTextBtn.position(500, 500);
  saveTextBtn.mousePressed(saveAsText);
  //print(Scene.data)
}

function saveAsText() {
  let data = Scene.data
  save(data, "output_data.txt");
}

function draw() {
  clear()
  textSize(24);
  text(`${(millis()/1000).toFixed(1)} seconds have gone by!`, 500, 50);
  circle(100, 200, 100)
  circle(300, 200, 100)
  rect(100, 150, 200, 100)
  noFill();
  circle(100, 200, 180)
  circle(300, 200, 180)
  rect(100, 110, 200, 180)
  //var p,c;
  // for(p in Scene.swarm, c in Scene.data){
  var Scene_vals = [Scene.swarm, Scene.data]
  for (var i = 0; i < Scene_vals[0].length; i++){
    let p = Scene_vals[0][i]
    let d = Scene_vals[1][i]
    p.step()
    p.draw()
    d.push(createVector(p.pos.x, p.pos.y))
  }
  //for(let [p, c] of [Scene.swarm, Scene.data]){
  //  p.step()
  //  p.draw()
  //}
}