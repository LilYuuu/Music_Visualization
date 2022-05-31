let mic, analyzer, fft;
let song;

let particles = [];


function preload() {
  song = loadSound("../audio/lover.mp3");
  // song = loadSound("../audio/chopin.m4a");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  noFill();
  
  analyzer = new p5.Amplitude();

  // mic = new p5.AudioIn();
  // mic.start();
  fft = new p5.FFT();
  // fft.setInput(mic);
  
  colorMode(HSB);
  // angleMode(DEGREES);
}

function draw() {
  push();
  colorMode(RGB);
  background(0, 15);
  pop();
  // stroke(255);
  
  level = analyzer.getLevel();
  fft.analyze();
  
  let bass = fft.getEnergy(100, 150);
  let treble = fft.getEnergy(150, 250);
  // let bass = fft.getEnergy("bass");
  // let treble = fft.getEnergy("treble");
  let mid = fft.getEnergy("mid");
  let amp = fft.getEnergy(20, 200);
  let wave = fft.waveform();
  
  let mapMid = map(mid, 0, 255, -100, 200);
  let scaleMid = map(mid, 0, 255, 1, 1.5);

  let mapTreble = map(treble, 0, 255, 200, 350);
  // let scaleTreble = map(treble, 0, 255, 0, 1);
  let scaleTreble = map(treble, 150, 220, 0, 360);
  // console.log(treble);

  let mapBass = map(bass, 0, 255, 50, 200);
  // let scaleBass = map(bass, 0, 255, 0.05, 1.2);
  let scaleBass = map(bass, 0, 255, 1, 10);
  // console.log(bass);
  
  pieces = 20;
  radius = 100;
  
  // push();
  translate(windowWidth / 2, windowHeight / 2);


  for (i = 0; i < pieces; i += 0.1) {

      rotate(TWO_PI / (pieces / 2));

      noFill();
    
      push();
      stroke(scaleTreble, 60, 60);
      strokeWeight(0.2);
      polygon(mapMid + i / 2, mapMid - i * 2, scaleBass * i, 7);
      pop();

  }
  
  // particles
  // if (bass >= 210 && particles.length == 0) {
  //   let p = new Particle();
  //   particles.push(p);
  // }
  
  if (frameCount % 2 == 0) {
    let p = new Particle();
    particles.push(p);
  }

  
  for (let i=particles.length - 1; i>=0; i--) {
    let p = particles[i];
    if (p.isDone()) {
      particles.splice(i, 1);
    } else {
      p.update(bass>210);
      p.display();
    }
  }
  
  
  // pop();
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(random(200, 250));
    this.vel = createVector();
    this.acc = this.pos.copy().mult(random(0.0001, 0.000001));
    // this.acc = this.pos.copy().mult(0.001);
    this.size = random(1, 3);
  }
  update(condition) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    if (condition) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
    
    // rotate(0.005);
  }
  isDone() {
    if (this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2) {
      return true;
    } else {
      return false;
    }
  }
  display() {
    push();
    colorMode(RGB);
    noStroke();
    fill(255, 100);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    pop();
  }
}

function polygon(x, y, radius, npoints) {
	var angle = TWO_PI / npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a) * radius;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}