let audioElement;
let slide;

const time = [
    23,
    65,
    92,
    114,
    137,
    157,
    184,
    208,
    235
];

function setup() {
  createCanvas(1280, 720);

  audioElement = createAudio('sound.mp3');
  audioElement.position(0, 720); 
  audioElement.size(300); 
  audioElement.autoplay(true);
  audioElement.showControls(); 
  
  slide = 0;
}

function draw() {
  background(220);
  console.log(audioElement.time())

  if(audioElement.time() >= time[0]){
    background(time[0]);
  }
  if(audioElement.time() >= time[1]){
    background(time[1]);
  }
  if(audioElement.time() >= time[2]){
    background(time[2]);
  }
  if(audioElement.time() >= time[3]){
    background(time[3]);
  }
  if(audioElement.time() >= time[4]){
    background(time[4]);
  }
  if(audioElement.time() >= time[5]){
    background(time[5]);
  }
  if(audioElement.time() >= time[6]){
    background(time[6]);
  }
  if(audioElement.time() >= time[7]){
    background(time[7]);
  }
  if(audioElement.time() >= time[8]){
    background(time[8]);
  }
}

const fadeIn =()=>{

}