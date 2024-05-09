// It can be pasted to p5.js web editor: https://editor.p5js.org/ and should work
let whiteNoise;
let lowPassFilter;
let fft;
let cutoffSlider, resSlider, gainSlider;

function setup() {
  createCanvas(400, 320);

  // Create a white noise generator
  whiteNoise = new p5.Noise('white');
  whiteNoise.start();

  // Create a LowPass filter and connect it
  lowPassFilter = new p5.LowPass();
  whiteNoise.disconnect();  // Disconnect white noise from master output
  whiteNoise.connect(lowPassFilter);  // Connect white noise to the filter

  // Create an FFT to analyze the sound
  fft = new p5.FFT();
  fft.setInput(lowPassFilter);

  // Create interface elements for controlling the filter
  createP('Cutoff Frequency:');
  cutoffSlider = createSlider(10, 22050, 1000, 1);
  createP('Resonance:');
  resSlider = createSlider(0, 15, 0, 0.1);
  createP('Gain:');
  gainSlider = createSlider(0, 1, 0.5, 0.01);  // Slider for gain control

  createButton('Toggle White Noise').mousePressed(toggleNoise);
}

function draw() {
  background(220);

  // Update filter parameters based on slider values
  lowPassFilter.freq(cutoffSlider.value());
  lowPassFilter.res(resSlider.value());
  lowPassFilter.amp(gainSlider.value(), 0.1);  // Smooth transition of gain

  // Perform FFT analysis
  let spectrum = fft.analyze();

  // Draw the spectrum
  noStroke();
  fill(0, 255, 0);  // Green color
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }

  textSize(16);
  textAlign(CENTER);
  fill(0);
  text('Use sliders to adjust filter settings.', width / 2, 20);
}

function toggleNoise() {
  if (whiteNoise.amp().value === 0) {
    whiteNoise.amp(0.5, 0.05); // Fade the amplitude to 0.5 over 0.05 seconds
  } else {
    whiteNoise.amp(0, 0.05); // Fade the amplitude to 0 over 0.05 seconds
  }
}

