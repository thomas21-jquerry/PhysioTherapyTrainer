let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "";

let nowPose = "";
let oldPose = "";
let rep = 0;
let repti = 0;
let repLimit =0;
let oldTime="";
let msg=""

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// console.log("Hello");
// sleep(10000);
// console.log("World!");

function setup() {

  sleep(5000);
  console.log("hiyyingh");
  var myCanvas = createCanvas(640, 480);
  myCanvas.parent('booth');
  video = createCapture(VIDEO);
  video.hide();
  
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  

  let options = {
    inputs: 34,
    outputs: 3,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'model/Exercise2/model.json',
    metadata: 'model/Exercise2/model_meta.json',
    weights: 'model/Exercise2/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);

  
  
}

function brainLoaded() {
  console.log('pose classification ready!!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {

  // var elem1 = document.getElementById('name2');
  // elem1.innerHTML=round(results[0].confidence * 100)+"%";
  console.log(results);
  console.log(results[0].label);
  
  if (results[0].confidence > 0.60) {
    poseLabel = results[0].label.toUpperCase();
    console.log("woww",results[0].label);
    if (poseLabel === "B"){
      poseLabel = "Bend More"

    }
    else if(poseLabel=='C'){
      poseLabel="Bend Less"
    }
    else{
      poseLabel="Bend Correct"
    }
    nowPose = poseLabel

    let d = 0;
    let accu = 100;
    if(nowPose=="Bend More"){
      if(oldPose=="Bend More"){
     
        if(oldTime&&Date.now()-oldTime>1500){
          msg="Please Bend More"
        }
      }
      else{
        oldTime=Date.now()
      }
      
    }
    else if(nowPose=="Bend Less"){
      if(oldPose=="Bend Less"){
        if(oldTime&&Date.now()-oldTime>1500){
          msg="Please Bend Less"
        }
      }
      else{
        oldTime=Date.now()
      }
    }
    else if(nowPose=="Bend Correct"){
      let currTime=Date.now()
      if(oldPose=="Bend Correct"){
        if(oldTime&&currTime-oldTime>1500){
          msg="Excellent...Stay on this Position"
          var elem = document.getElementById('name1');
          rep+=Math.floor((currTime-oldTime)/1000);
          elem.innerHTML=rep;

        }
      }
      else{
        oldTime=Date.now()
      }
      
    }
    oldPose=nowPose
  }
  else{
    msg="Please Stand As in the Picture"
  }
  let msgDiv=document.getElementById("msg")
  msgDiv.innerHTML=msg
  //console.log(results[0].confidence);
  classifyPose();
}


function gotPoses(poses) {
  // console.log("hmm",poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready!!');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {

    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    ellipse(pose.rightShoulder.x, pose.rightShoulder.y, 32);
    ellipse(pose.leftShoulder.x, pose.leftShoulder.y, 32);
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  // fill(255, 0, 255);
  // noStroke();
  // textSize(100);
  // textAlign(CENTER, CENTER);
  // text(msg, width / 3, height / 3);
}
