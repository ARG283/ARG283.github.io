

let drawCirc = (x, y, rad, color, canvas, ctx) => {//draws a circle  
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
}

let teamWon = (x, y, canvas, ctx) => { // checks down, then side to side, then diags
  /*** DOWN checker ***/
  let numCon = 0; //number of connected coins
  let testx = x;
  let testy = y;
  while((ctx.getImageData(x, y, 1, 1).data[0] == ctx.getImageData(testx, testy, 1, 1).data[0]) && // checks if the color of the chip at testx and testy is the same color as the one you dropped
        (ctx.getImageData(x, y, 1, 1).data[1] == ctx.getImageData(testx, testy, 1, 1).data[1])){  
    numCon++;
    testy = testy + canvas.height / 6;  // moves testy to the next slot below it
  }
  if(numCon >= 4){ //if someone won it draws a line and returns true (determining who won is done outside of this function)
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(testx,testy - canvas.height / 6);
    ctx.stroke();
    return true;
  }
  //NOTE : dont need to check for connections above because you can only drop a chip on top of a stack in the game
  //Note 2: you dont need to check if you went off the board, turns out canvas still sees the pixels as white if it checks beyond its border, so it auto fails cause it doesnt match the color of the chip
  //        i think it is because technically you can still draw outside of canvas boarder, its just not rendered so technically still white if you havent drawn outside the boarder
/******/

/*** Side to side checker  ***/
  numCon = 0;
   testx = x;
   testy = y;
  while((ctx.getImageData(x, y, 1, 1).data[0] == ctx.getImageData(testx - canvas.width / 7, testy, 1, 1).data[0]) && // goes as far left as it can while remaining in the same chip color
        (ctx.getImageData(x, y, 1, 1).data[1] == ctx.getImageData(testx - canvas.width / 7, testy, 1, 1).data[1])){  
    testx = testx - canvas.width / 7; //moves test x to the left
  }
  let tx = testx; //used later for drawing
  let ty = testy; //used later for drawing
  while((ctx.getImageData(x, y, 1, 1).data[0] == ctx.getImageData(testx, testy, 1, 1).data[0]) && // checks if testx, testy is same color as one dropped
        (ctx.getImageData(x, y, 1, 1).data[1] == ctx.getImageData(testx, testy, 1, 1).data[1])){
    numCon++;
    testx = testx + canvas.width / 7; //moves test x to right
  }
  if(numCon >= 4){
    ctx.beginPath();
    ctx.moveTo(tx,ty);  
    ctx.lineTo(testx - canvas.width / 7,testy);
    ctx.stroke();
    return true;
  }
  //NOTE: this can detect connect "5s" and greater
  /******/

/*** "\" diagonal checker ***/
  numCon = 0;
   testx = x;
   testy = y;
  while((ctx.getImageData(x, y, 1, 1).data[0] == ctx.getImageData(testx - canvas.width / 7, testy - canvas.height / 6, 1, 1).data[0]) &&  //goes as far up and left as it can while still remaining in the same color
        (ctx.getImageData(x, y, 1, 1).data[1] == ctx.getImageData(testx - canvas.width / 7, testy - canvas.height / 6, 1, 1).data[1])){
    testx = testx - canvas.width / 7;
    testy = testy - canvas.height / 6;
  }
   tx = testx;
   ty = testy;
  while((ctx.getImageData(x, y, 1, 1).data[0] == ctx.getImageData(testx, testy, 1, 1).data[0]) && //begins moving down and to the right to check number connected
        (ctx.getImageData(x, y, 1, 1).data[1] == ctx.getImageData(testx, testy, 1, 1).data[1])){
    numCon++;
    testx = testx + canvas.width / 7;
    testy = testy + canvas.height / 6;
  }
  if(numCon >= 4){
    ctx.beginPath();
    ctx.moveTo(tx,ty);
    ctx.lineTo(testx - canvas.width / 7,testy - canvas.height / 6);
    ctx.stroke();
    return true;
  }
  /******/

/*** "/" diagonal checker ***/
  numCon = 0;
  testx = x;
  testy = y;
    while((ctx.getImageData(x, y, 1, 1).data[0] == ctx.getImageData(testx + canvas.width / 7, testy - canvas.height / 6, 1, 1).data[0]) && //goes as far up to the right as it can while in the same color
          (ctx.getImageData(x, y, 1, 1).data[1] == ctx.getImageData(testx + canvas.width / 7, testy - canvas.height / 6, 1, 1).data[1])){
      testx = testx + canvas.width / 7;
      testy = testy - canvas.height / 6;
    }
     tx = testx;
     ty = testy;
    while((ctx.getImageData(x, y, 1, 1).data[0] == ctx.getImageData(testx, testy, 1, 1).data[0]) && //moves down and to the left to check number connected
          (ctx.getImageData(x, y, 1, 1).data[1] == ctx.getImageData(testx, testy, 1, 1).data[1])){
      numCon++;
      testx = testx - canvas.width / 7;
      testy = testy + canvas.height / 6;
    }
    if(numCon >= 4){
      ctx.beginPath();
      ctx.moveTo(tx,ty);
      ctx.lineTo(testx + canvas.width / 7,testy - canvas.height / 6);
      ctx.stroke();
      return true;
    }
    /*****/

  return false; //returns false if did not detect win
}

let drop = (x, y, color, canvas, ctx) => {//Tries to drop at top of a column, if it sees empty space below, recurses to "fall"
  if(ctx.getImageData(x, y, 1, 1).data[3] != 0){
    throw( ctx.getImageData(x, y, 1, 1).data);
  }
  if(ctx.getImageData(x, y + canvas.height / 6, 1, 1).data[3] == 0 && (y + canvas.height / 6 < canvas.height)) {
    return drop(x, y + canvas.height / 6, color, canvas, ctx);  //recurses at next space
  }
  drawCirc(x, y, 15, color, canvas, ctx);  //if done recursing draws circle
  return [x, y];
}

let drawControlCanvas = (canvas, ctx) => { //draws ui
  for(let i = 0; i <= 8; i++){
    ctx.beginPath();
    ctx.moveTo(i * canvas.width / 8, 0);
    ctx.lineTo(i * canvas.width / 8, canvas.height);
    ctx.stroke();
    ctx.font = "12px Arial";
    if(i < 7){
      ctx.fillText("Drop Here", 12 + i * canvas.width / 8, 20);
    } else {
      ctx.fillText("Reset", 25 + i * canvas.width / 8, 20);
    }
  }
  for(let i = 0; i <= 1; i++){
    ctx.beginPath();
    ctx.moveTo(0, i * canvas.height);
    ctx.lineTo(canvas.width, i * canvas.height);
    
    ctx.stroke();
  }
}

let drawBoardCanvas = (canvas, ctx) => { //draws game board
  ctx.lineWidth = 1
    for(let i = 0; i <= 7; i++){
      ctx.beginPath();
      ctx.moveTo(i * canvas.width / 7, 0);
      ctx.lineTo(i * canvas.width / 7, canvas.height);
      ctx.stroke();
    }
    for(let i = 0; i <= 6; i++){
      ctx.beginPath();
      ctx.moveTo(0, i * canvas.height / 6);
      ctx.lineTo(canvas.width, i * canvas.height / 6);
      ctx.stroke();
    }
}

function getMousePos(canvas, evt) { //Mouse position finder
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

document.addEventListener("DOMContentLoaded",() => {
  let someoneWon = false;
  let turn = 1; //used to keep track of who is currently playing, also used to determine winner
  let boardCanv = document.getElementById("myCanvas");
  let boardCtx = boardCanv.getContext("2d");
  let buttonCanv = document.getElementById("myButtons");
  let buttonCtx = buttonCanv.getContext("2d");
  drawControlCanvas(buttonCanv, buttonCtx);
  drawBoardCanvas(boardCanv, boardCtx);

  
  document.querySelector("#myButtons").addEventListener("click",(e) => {
    let mouse = getMousePos(buttonCanv, e); //gets mouse's position then determines which button you pressed
    let buttonPressed = Math.trunc(mouse.x / 84);
    
    if(buttonPressed < 7){ //Handles dropper buttons
      //first drops coin, then detects if someone won
      if (!someoneWon) { //makes it so you cant continue playing after winning
        let move;
        try{
          
          if(turn % 2 == 1) { // alternates between team
            move = drop((buttonPressed) * boardCanv.width / 7 + boardCanv.width / 14, boardCanv.height / 12, '#ff0000', boardCanv, boardCtx);
          } else {
            move = drop((buttonPressed) * boardCanv.width / 7 + boardCanv.width / 14, boardCanv.height / 12, '#ffff00', boardCanv, boardCtx);
          }

          if(teamWon(move[0], move[1], boardCanv, boardCtx)){ //move[0] and move[1] are x and y coords of where the coin that dropped ended up
            if(turn % 2 == 1) {
              document.querySelector("#txt").innerText = "RED team WON!";
            } else {
              document.querySelector("#txt").innerText = "Yellow team WON!";
            }
            someoneWon = true;
          } else {
            turn++;
            if(turn % 2 == 1) {
              document.querySelector("#txt").innerText = "RED team GO!";
            } else {
              document.querySelector("#txt").innerText = "Yellow team GO!";
            }
          }
        } catch(e){}//catch statement is for trying to drop on full column
      }
    } else if(buttonPressed == 7) { // Reset Button 
      //clears board with white square and redraws it, also resets game vars
      boardCtx.clearRect(0,0,boardCanv.width,boardCanv.height);
      drawBoardCanvas(boardCanv, boardCtx);
      someoneWon = false;
      turn = 1;
      document.querySelector("#txt").innerText = "Let the game BEGIN: Red team GO!";
    }
  });
  
});
