var serial;          // variable to hold an instance of the serialport library
var portSelector; // a select menu for the port list
var locH = 320;
var locV = 320;        // location of the circle
var newLocH = 320;
var newLocV = 240;       //temporary storage of the new location
var speedX = 0;        //speed of the circle
var speedY = 0;
var circleColor = 255; // color of the circle
let walls = [];    //the array of maze wall
var r = 14; 
let ballHitsWallH = false; //the ball stops when hitting the wall
let ballHitsWallV = false;
 
function setup() {
  createCanvas(640, 640);          // make canvas
  smooth();                        // antialias drawing lines
  walls[0] = new wall(50, 50, 7, 500);
  walls[1] = new wall(50, 50, 500, 7);
  walls[2] = new wall(150, 50, 7, 250);
  walls[3] = new wall(100, 100, 150, 7);
  walls[4] = new wall(50, 150, 50, 7);
  walls[5] = new wall(100, 200, 50, 7);
  walls[6] = new wall(50, 250, 50, 7);
  walls[7] = new wall(100, 300, 57, 7);
  walls[8] = new wall(50, 350, 50, 7);
  walls[9] = new wall(100, 400, 200, 7);
  walls[10] = new wall(50, 450, 50, 7);
  walls[11] = new wall(100, 450, 7, 50);
  walls[12] = new wall(50, 550, 500, 7);
  walls[13] = new wall(150, 400, 7, 100);
  walls[14] = new wall(200, 100, 7, 50);
  walls[15] = new wall(200, 200, 7, 150);
  walls[16] = new wall(200, 350, 250, 7);
  walls[17] = new wall(200, 450, 7, 100);
  walls[18] = new wall(200, 200, 50, 7);
  walls[19] = new wall(200, 450, 50, 7);
  walls[20] = new wall(250, 150, 100, 7);
  walls[21] = new wall(250, 150, 7, 57);
  walls[22] = new wall(250, 250, 7, 50);
  walls[23] = new wall(250, 250, 100, 7);
  walls[24] = new wall(250, 500, 50, 7);
  walls[25] = new wall(300, 100, 200, 7);
  walls[26] = new wall(300, 200, 100, 7);
  walls[27] = new wall(300, 400, 7, 107);
  walls[28] = new wall(350, 250, 7, 100);
  walls[29] = new wall(300, 450, 100, 7);
  walls[30] = new wall(350, 500, 7, 50);
  walls[31] = new wall(400, 100, 7, 200);
  walls[32] = new wall(400, 150, 50, 7);
  walls[33] = new wall(400, 250, 100, 7);
  walls[34] = new wall(350, 400, 150, 7);
  walls[35] = new wall(400, 450, 7, 50);
  walls[36] = new wall(400, 500, 100, 7);
  walls[37] = new wall(450, 200, 100, 7);
  walls[38] = new wall(450, 300, 50, 7);
  walls[39] = new wall(450, 300, 7, 57);
  walls[40] = new wall(450, 400, 7, 50);
  walls[41] = new wall(500, 150, 7, 50);
  walls[42] = new wall(500, 250, 7, 57);
  walls[43] = new wall(500, 350, 7, 157);
  walls[44] = new wall(500, 350, 50, 7);
  walls[45] = new wall(550, 50, 7, 307);
  walls[46] = new wall(550, 400, 7, 157);
  
  serial = new p5.SerialPort();    // make a new instance of the serialport library
  serial.on('list', printList);    // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);     // callback for the port opening
  serial.on('data', serialEvent);  // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose);   // callback for the port closing
 
  serial.list();                   // list the serial ports
}

function draw() {
  background(0);               // black background
  //text('Color will lead your way.', 50, 30);
  //fill(255, 0, 0);
  //text('C', 50, 30);
  //text('l', 66, 30);
  //text('r', 76, 30);
  //fill(0, 255, 255);
  //text('o', 58, 30);
  //text('o', 69, 30);
  fill(255, 0, 0);
  rect(370, 280, 50, 50);    //draw the red button
  for (var i = 0; i < walls.length; i++){
    walls[i].show();
  }
  fill(circleColor);
  ellipse(locH, locV, 2 * r, 2 * r); // draw the circle
}

// get the list of ports:
function printList(portList) {
  // make a select menu and position it:
  portSelector = createSelect();
  portSelector.position(10,10);
   
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    // console.log(i + " " + portList[i]);
    // add item to the select menu:
    portSelector.option(portList[i]);
  }
  // set a handler for when a port is selected from the menu:
  portSelector.changed(openPort);
}

function openPort() {
  var thisPort = portSelector.value();
  if (thisPort != null) {
    serial.open(thisPort);
  }
}

function portOpen() {
  console.log('the serial port opened.');
  // send a byte to prompt the microcontroller to send:
  serial.write('x');
  serial.write('z');
}

function serverConnected() {
  print('connected to server.');
}
 
function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  print('The serial port closed.');
}

function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  var inString = serial.readStringUntil("\r\n");
  //check to see that there's actually a string there:
  if (inString.length > 0) {
    if (inString !== 'hello') { // if you get hello, ignore it
      var sensors = split(inString, ','); // split the string on the commas
      if (sensors.length > 2) { // if there are three elements
        
        speedX = map(sensors[0] - 525, -200, 200, -10, 10); // map the reading to the speed of the circle
        //the sensor reading is not stable, so we ignore the reading when it's too close to default
        if (sensors[0] > 535 || sensors[0] < 515){
          newLocH = locH + speedX;
        }
        speedY = map(sensors[1] - 525, -200, 200, 10, -10); 
        if (sensors[1] > 535 || sensors[1] < 515){
          newLocV = locV + speedY; 
        }
        //see if the ball will touch any wall
        for (var i = 0; i < walls.length; i++){
          if (newLocH > (walls[i].x - r) && newLocH < (walls[i].x + walls[i].a + r)){
              ballHitsWallH = true;
          }
          if (newLocV > (walls[i].y - r) && newLocV < (walls[i].y + walls[i].b + r)){
              ballHitsWallV = true;
          }
        }
        //update the position only when the ball does not hit the wall
        if (ballHitsWallH == false){
          locH = newLocH;
        }
        if (ballHitsWallV == false){
          locV = newLocV;
        }
        
        
        ballHitsWallH = false;
        ballHitsWallV = false;
        //update the location when the circle is on the canvas
        //if (newLocH > 25 && newLocH < 615){
        //  locH = newLocH; 
        //}
        //if (newLocV > 25 && newLocV < 455 ){
        //  locV = newLocV; 
        //}
        //open the door when the photocell is covered
        if (sensors[2] == 1 && walls.length == 51){
          walls.splice(2, 1); 
        }
        if (dist(locH, locV, 395, 305) < 25){
          serial.write('y');
        }
      }
    }
    serial.write('x'); // send a byte requesting more serial data
  }
  
}

class wall{
  constructor(x, y, a, b, colr = 255, colg = 255, colb = 255){
    this.x = x;
    this.y = y;
    this.a = a;
    this.b = b;
    this.colr = colr;
    this.colb = colb;
    this.colg = colg;
  }
  show(){
    fill(this.colr, this.colg, this.colb);
    noStroke();
    rect(this.x, this.y, this.a, this.b);
  }
}
