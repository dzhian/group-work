// Initialize variables
let video;
let poseNet;
let poses = [];
let braOne, braTwo, braThree;
let chestToCameraDistance = 0;

function preload() {
  // Load the image to overlay on the chest area
  braOne = loadImage('bra1.png');
  braTwo = loadImage('bra2.png');
  braThree = loadImage('bra3.png');
}

function setup() {
  // Create a canvas
  var canvas = createCanvas(640, 480);
  canvas.parent('virtual');

  // Start capturing video from the webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Initialize PoseNet with the webcam feed
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function modelLoaded() {
  console.log('PoseNet model loaded');
}

function gotPoses(results) {
  poses = results;

  // Calculate distance between chest and camera
  if (poses.length > 0) {
    let pose = poses[0].pose;
    if (pose.keypoints[4].score > 0.5) {
      let chestPosition = pose.keypoints[4].position;
      chestToCameraDistance = dist(chestPosition.x, chestPosition.y, width * 1, height * 1);
    }
  }
}

function draw() {
  // Draw the webcam feed
  image(video, 0, 0, width, height);
  // Loop through each detected pose
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;

    // Get the position of the chest keypoint
    let chest = pose.keypoints[5].position;

    // Resize the images based on distance between chest and camera
    let size = map(chestToCameraDistance, 0, height / 2, 400, 100);

    // Overlay the image on the chest area
    if (key === 'a'){
      image(braOne, (chest.x - size / 2)-100, (chest.y - size / 2)+80, size-120, size-120);
    }
    if (key === 's'){
      image(braTwo, (chest.x - size / 2)-100, (chest.y - size / 2)+80, size-120, size-120);
    }
    if (key === 'd'){
      image(braThree, (chest.x - size / 2)-100, (chest.y - size / 2)+80, size-120, size-120);
    }
  }
  textSize(32);
  textAlign(CENTER,BOTTOM);
  fill(255,255,255);
  text("Hotkeys - A: Bra 1     S: Bra 2     D: Bra 3", 320, 460);
}
