let audioElement;
let bgImage;
let song;
let fft;

const time = [23, 65, 92, 114, 137, 157, 184, 208, 235];

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
  displayTitle();
  displayFrequency();
  //testing code
}

// Time handling
const timeTesting = () => {
  if (audioElement.time() >= time[0]) {
    background(time[0]);
  }
  if (audioElement.time() >= time[1]) {
    background(time[1]);
  }
  if (audioElement.time() >= time[2]) {
    background(time[2]);
  }
  if (audioElement.time() >= time[3]) {
    background(time[3]);
  }
  if (audioElement.time() >= time[4]) {
    background(time[4]);
  }
  if (audioElement.time() >= time[5]) {
    background(time[5]);
  }
  if (audioElement.time() >= time[6]) {
    background(time[6]);
  }
  if (audioElement.time() >= time[7]) {
    background(time[7]);
  }
  if (audioElement.time() >= time[8]) {
    background(time[8]);
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
  const fontColor = "#EEE"; //rgb(255, 255, 255)
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

  console.log(spectrum);
  stroke(255);
  for (i = 0; i < spectrum.length; i += 2) {
    const amp = spectrum[i];
    const y = map(amp, 0, 1023, fheight, 0);
    if (i < 700) {
      line(i + fwidth + space, fheight, i + fwidth + space, y);
    }
    space++;
  }

  // 
  const offset = spectrum[5] + spectrum[7] / 2;
  controlShadow(height + offset);
};

/** Function of Shadow Control */
const controlShadow = (h) => {
  /** const */
  const y = height / 2;
  const x = width / 2
  const levels = width;
  const colorOfLevel = 25;
  /** variable */
  var radius = h;
  var color = 100;
  var alpha = 0.2;
  var color_rgba = `rgba(${color},${color},${color},${alpha})`

  
  stroke(color_rgba);
  fill(color_rgba);
  circle(x, y, radius);
  for(i=0;i<levels;i++){    
    stroke(`rgba(${color},${color},${color},${alpha})`);
    noFill()
    circle(x, y, radius);
    if(!(i%10)){alpha += 0.001;}
    if(!(i%150) && color >= colorOfLevel){color -= colorOfLevel;}
    radius += 1;
  }
};
