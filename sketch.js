// Robert Sturm
// Version 0.3
// Created for Daniel Shiffman's Nature of Code course https://www.youtube.com/watch?v=XJ7HLz9VYz0

const len = 784;
const totalData = 1000;

const CAT = 0;
const RAINBOW = 1;
const TRAIN = 2;

let catsData;
let trainsData;
let rainbowsData;

let cats = {};
let trains = {};
let rainbows = {};

let nn;

let learn_message;
let test_message;
let guess_message;


function preload() {
  catsData = loadBytes('data/cats1000.bin');
  trainsData = loadBytes('data/trains1000.bin');
  rainbowsData = loadBytes('data/rainbows1000.bin');
}


function setup() {
  document.getElementById('title').innerHTML = "Doodle";
  document.getElementById('heading').innerHTML = "Doodle:  Draw a cat, train, or rainbow.";


  createCanvas(280, 280).parent('container');
  background(255);

  // Preparing the data
  prepareData(cats, catsData, CAT);
  prepareData(rainbows, rainbowsData, RAINBOW);
  prepareData(trains, trainsData, TRAIN);

  // Making the neural network
  nn = new NeuralNetwork(784, 64, 3);

  // Randomizing the data
  let training = [];
  training = training.concat(cats.training);
  training = training.concat(rainbows.training);
  training = training.concat(trains.training);

  let testing = [];
  testing = testing.concat(cats.testing);
  testing = testing.concat(rainbows.testing);
  testing = testing.concat(trains.testing);

  let trainButton = select('#train');
  let epochCounter = 0;
  trainButton.mousePressed(function() {
    learn_message = "Epoch has begun.  Learning.  Please be patient...";
    print(learn_message);
    document.getElementById('learn_message').innerHTML = learn_message;
  });
  trainButton.mouseReleased(function() {
    trainEpoch(training);
    epochCounter++;
    learn_message = "Finished Epoch #" + epochCounter;
    print(learn_message);
    document.getElementById('learn_message').innerHTML = learn_message;
  });

  let testButton = select('#test');
  testButton.mousePressed(function() {
    test_message = "Testing has begun.  200 images.  Please be patient...";
    print(test_message);
    document.getElementById('test_message').innerHTML = test_message;
  });
  testButton.mouseReleased(function() {
    let percent = testAll(testing);
    test_message = "Percent correct = " + nf(percent, 2, 2) + "%";
    print(test_message);
    document.getElementById('test_message').innerHTML = test_message;
  });

  let guessButton = select('#guess');
  guessButton.mousePressed(function() {
    let inputs = [];
    let img = get();
    img.resize(28, 28);
    img.loadPixels();
    for (let i = 0; i < len; i++) {
      let bright = img.pixels[i * 4];
      inputs[i] = (255 - bright) / 255.0;
    }
    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification = guess.indexOf(m);
    if (classification === CAT) {
      guess_message = "Cat";
      print(guess_message);
      document.getElementById('guess_message').innerHTML = guess_message;
    } else if (classification === RAINBOW) {
      guess_message = "Rainbow";
      print(guess_message);
      document.getElementById('guess_message').innerHTML = guess_message;
    } else if (classification === TRAIN) {
      guess_message = "Train";
      print(guess_message);
      document.getElementById('guess_message').innerHTML = guess_message;
    }

  });

  let clearButton = select('#clear');
  clearButton.mousePressed(function() {
    background(255);
  });
}


function draw() {
  strokeWeight(8);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
