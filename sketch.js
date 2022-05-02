let audioElement;
let bgImage;
let song;
let fft;
let snowflakes = [];

const time = [12,23, 65, 92, 114, 137, 157, 184, 208, 235];

function preload() {
  sound = loadSound("/sound.mp3");
  bgImage = loadImage("/bg.png");
}

function setup() {
  // canvas
  const cnv = createCanvas(1280, 720);
  cnv.mouseClicked(togglePlay);
  // sound and fft
  fft = new p5.FFT();
  sound.amp(0.5);
  fft = new p5.FFT();
  sound.loop();
  // variable control
  shadowOffset = 0;
  shadowArrow = 1;
}

function draw() {
  //background(bgImage);
  displayBackground();
  displayFrequency();
  displayTitle();
  //testing code
  timeEvents();
}

// Time handling
const timeEvents = () => {
  const cur = sound.currentTime()
  if (cur >= time[0] && cur <= time[1]) {
    console.log("Snow ?")
    drawSnow(cur,time[0])
  }
  if (cur >= time[2] && cur <= time[3]) {
    console.log("Snow ?")
    drawSnow(cur,time[2])
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
const displayBackground = () => {
  const w = bgImage.width / 1.5;
  const h = bgImage.height / 1.5;
  image(bgImage, 0, 0, w, h); // create image to canvas
};

/** Function Display Title and Author */
const displayTitle = () => {
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

/** Function Display Sound */
const displayFrequency = () => {
  let spectrum = fft.analyze();
  const fwidth = (width - spectrum.length) / 2;
  const fheight = bgImage.height / 1.5 / 2;
  var space = 0;


  const offset = spectrum[5] + spectrum[7] / 2;
  controlShadow(height + offset);

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
};

/** Function of Shadow Control */
const controlShadow = h => {
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
const drawSnow = (ct,t) => {
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
