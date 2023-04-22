let bgImage; // element of Background
let bgAlpha;
let bgOffsetX;
let bgOffsetY;
let sound; // element of Sound[Song]
let fft; // fft object
let snowflakes = []; // array of holding snow
let ps = 0;
let shAlpha;
let btfAlpha;
let btfOffset;

const time = [12, 23, 65, 90, 114, 137, 158, 184, 208, 235];

function preload() {
  sound = loadSound("sound.mp3");
  bgImage = loadImage("bg.png");
}

function setup() {
  // canvas
  const cnv = createCanvas(1280, 720);
  cnv.mouseClicked(togglePlay);
  // sound and fft
  fft = new p5.FFT();
  sound.amp(0.5);
  // variable control
  shadowOffset = 0;
  shadowArrow = 1;
  bgAlpha = 2;
  // background
}

function draw() {
  background(bgImage);
  console.log(`x:${mouseX} y:${mouseY}`)
  if (bgAlpha >= 0.05) {
    displayBackground(0, 0);
    displayDarkShadow(bgAlpha)
    displayTitle(bgAlpha);
    bgAlpha -= 0.01;
  } else {
    displayBackground(0, 0);
    // If Ready Play Sound
    setTimeout(() => {
      if (ps < 50 && (sound.isPaused() || !sound.isPlaying())) {
        sound.loop();
      }
    }, 0);
    if (ps < 100) {
      ps++;
    }
    // Display Frequency
    displayFrequency();
    // Display Information
    displayInfo();
    //testing code
    timeEvents();
  }
}

// Time handling
const timeEvents = () => {
  const cur = sound.currentTime();
  if (cur >= time[0] && cur <= time[1]) {
    //console.log("Snow ?");
    drawSnow(cur, time[0]);
  }
  if (cur >= time[2] && cur <= time[3]) {
    //console.log("Snow ?");
    drawSnow(cur, time[2]);
  }
  if (cur >= time[3] && cur <= time[4]) {
      if(cur <= time[3]+1){
        shAlpha = 0.01
      }
      displayDarkShadow(shAlpha);
      if(shAlpha < 0.8 && shAlpha >= 0.01){
        shAlpha += 0.01;
      }else{
        shAlpha = 0;
      }
  }
  if (cur >= time[5] && cur <= time[6]) {
    if(cur <= time[5]+1){
      shAlpha = 0.01
    }
    displayDarkShadow(shAlpha);
    if(shAlpha < 0.8 && shAlpha >= 0.01){
      shAlpha += 0.01;
    }else{
      shAlpha = 0;
    }
}
};

/** Function Toggle Play */
function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

/** Function Display Background */
const displayBackground = (ox, oy) => {
  const w = bgImage.width / 1.5;
  const h = bgImage.height / 1.5;
  image(bgImage, 0 + ox, 0 + oy, w, h); // create image to canvas
};

/** */
const displayTitle = (a) => {
  const fontColor = `rgba(238,238,238,${a})`; //rgb(255, 255, 255)
    stroke(fontColor);
    fill(fontColor);
    textFont("Arial");
    textAlign(CENTER, CENTER);
    select("canvas").elt.style.letterSpacing = "0.5rem"; // Font Space By CSS
    textSize(92);
    text("Ninelie", width / 2, height / 2);
}

/** Function Display Title and Author */
const displayInfo = () => {
  const fontSize = { title: 38, author: 24 };
  const fontColor = "rgba(238,238,238,1)"; //rgb(255, 255, 255)
  const fontFamily = "Arial";
  const position = { x: 200, y: bgImage.height / 1.5 / 3 };

  fill(fontColor);
  textFont(fontFamily);
  select("canvas").elt.style.letterSpacing = "0.25rem"; // Font Space By CSS
  textSize(fontSize.title);
  text("Ninelie", position.x, position.y);
  textSize(fontSize.author);
  text("Aimer with chelly", position.x, position.y + 35);
};

/** Function of Display Black Dark Shadow */
const displayDarkShadow = (a,c) => {
  stroke(`rgba(20,20,20,0.8)`);
  fill(`rgba(25,25,25,${a})`);
  rect(0, 0, width, height);
}

/** Function Display Sound */
const displayFrequency = () => {
  let spectrum = fft.analyze();
  const fwidth = (width - spectrum.length) / 2;
  const fheight = bgImage.height / 1.5 / 2;
  var space = 0;

  const offset = spectrum[5] + spectrum[7] / 2;
  controlFreqShadow(height + offset);

  //console.log(spectrum);
  stroke(255);
  for (i = 0; i < spectrum.length; i += 2) {
    const amp = spectrum[i];
    const y = map(amp, 0, 1023, fheight, 0);
    if (i < 700) {
      line(i + fwidth + space, fheight, i + fwidth + space, y);
    }
    space++;
  }
  // time 6
  const cur = sound.currentTime();
  if(cur >= time[6] && cur <= time[7]){
    if(cur <= time[6]+4){
      const offset = spectrum[5] + spectrum[7] / 2 / 10;
      displayButterflyEffect(0.8,offset,255)
    }
  }
};

/** Function of Shadow Control */
const controlFreqShadow = h => {
  /** const */
  const y = height / 2;
  const x = width / 2;
  const levels = width;
  const colorOfLevel = 25;
  /** variable */
  var radius = h;
  var color = 100;
  var alpha = 0.2;
  var color_rgba = `rgba(${color},${color},${color},${alpha})`;

  stroke(color_rgba);
  fill(color_rgba);
  circle(x, y, radius);
  for (i = 0; i < levels; i++) {
    stroke(`rgba(${color},${color},${color},${alpha})`);
    noFill();
    circle(x, y, radius);
    if (!(i % 10)) {
      alpha += 0.001;
    }
    if (!(i % 150) && color >= colorOfLevel) {
      color -= colorOfLevel;
    }
    radius += 1;
  }
};

/** Class of Snow */

class Snow {
  // initialize coordinates
  constructor() {
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(0, 2 * PI);
    this.size = random(4, 14);
    this.radius = sqrt(random(pow(width / 2, 2)));
  }

  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area

  update(time) {
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  }

  display() {
    ellipse(this.posX, this.posY, this.size);
  }
}

/** Function of Snow Control */
const drawSnow = (ct, t) => {
  var color = 200;
  var alpha = 0.3;
  var color_rgba = `rgba(${color},${color},${color},${alpha})`;

  //console.log(t)
  //console.log(random());

  stroke(color_rgba);
  fill(color_rgba);

  /** when current time larger than target time add Snow to the array in 3(sec)*/
  if (ct <= t + 3 && snowflakes.length < 150) {
    snowflakes.push(new Snow()); // append snowflake object
  }
  for (let flake of snowflakes) {
    flake.update(ct); // update snowflake position
    flake.display(); // draw snowflake
  }
};

const drawButterfly = (a,os,c)=>{
  const points = [
    {x:348,y:158}, // 0,+
    {x:307,y:113}, // -,-
    {x:310,y:170}, // +
    {x:297,y:180},
    {x:294,y:221},
    {x:342,y:181},
    {x:338,y:236},
    {x:367,y:186},
    {x:360,y:172},
    {x:370,y:167},
    {x:388,y:107},
    {x:348,y:158},
  ]
  stroke(`rgba(${c},${c},${c},${a})`);
  line(points[0].x-os, points[0].y-0, points[1].x-os, points[1].y-os);
  line(points[1].x-os, points[1].y-os, points[2].x-os, points[2].y+0);
  line(points[2].x-os, points[2].y+0, points[3].x-os, points[3].y+0);
  line(points[3].x-os, points[3].y+0, points[4].x-os, points[4].y+os);
  line(points[4].x-os, points[4].y+os, points[5].x+0, points[5].y+os);
  line(points[5].x+0, points[5].y+os, points[6].x+0, points[6].y+os);
  line(points[6].x+0, points[6].y+os, points[7].x+os, points[7].y+0);
  line(points[7].x+os, points[7].y+0, points[8].x+os, points[8].y+0);
  line(points[8].x+os, points[8].y+0, points[9].x+os, points[9].y)+0;
  line(points[9].x+os, points[9].y+0, points[10].x+os, points[10].y-os);
  line(points[10].x+os, points[10].y-os, points[11].x-os, points[11].y-0);
}

const displayButterflyEffect = (a,of,c) =>{
  for(i=0;i<10;i++){
    if(a>0.05){
      a -= 0.05
    }
    c-=5
  }
  var radius = 150 + of
  const x = 343
  const y = 172
  const levels = width / 24;
  const colorOfLevel = 5;
  var color = 200;
  var alpha = 0.4;
  var color_rgba = `rgba(${color},${color},${color},${alpha})`;

  stroke(color_rgba);
  fill(color_rgba);
  circle(x, y, radius);
  for (i = 0; i < levels; i++) {
    stroke(`rgba(${color-50+i},${color-30+i},${color+i},${alpha})`);
    noFill();
    circle(x, y, radius);
    if (!(i % 5)) {
      alpha -= 0.01;
    }
    if (!(i % 100) && color >= colorOfLevel) {
      color -= colorOfLevel;
    }
    radius += 1;
  }
}