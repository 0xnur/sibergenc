//global vars
var player;  
var sign; // finish point represented by sign
var enemies = [] // array of enemie entities
var traps = []; // array of traps
var obstacles = []; // array of obstacles
var str = ""; // string of javascript commands
var once = true; // use it to only once do something
var commandCount = 0; //used to count number of commands for player
var secondsPassed = 0; //used to count time
var blockWidth = 64; // width of one block on map in pixels
var playerWidth = 28; // player sprite width in pixels
var gameWidth = blockWidth * 6; // game width in pixels
var gameHeight = gameWidth + 120; // game height in pixels
var timeoutID; // id of current timeout
var timeouts = []; //array of timeouts
var isNextObstacle = false; //is obstacle, enemie in front of player
var runClickable = true; //prevent from clicking run button twice
var eIndex = 0;
var isExecuting = false; //Are code blocks executing?
var maxCount = 2;
var movementCount = 0; //Count moves player made

//counters for blocks
var ifElseCounter = 0;
var moveForwardCounter = 0;
var moveBackwardCounter = 0;
var turnLeftCounter = 0;
var turnRightCounter = 0;
var waitCounter = 0;
var forCounter = 0;

var maxBlocks1 = {
    ifelse : 0,
    moveForward : 1,
    moveBackward : 0,
    turnLeft : 4,
    turnRight: 1,
    forblock: 2,
    wait: 0,
}

var maxBlocks2 = {
    ifelse : 3,
    moveForward : 1,
    moveBackward : 0,
    turnLeft : 0,
    turnRight: 3,
    forblock: 0,
    wait: 0,
}



// 1 - player, 2 - destination, 3 - trap, 4 - enemie, 5 - obstacle
//level matrix
var level1 = [[0,3,0,4,0,0],
              [3,1,4,0,0,0],
              [0,0,0,0,0,0],
              [0,2,0,3,3,3],
              [0,0,0,0,0,3],
              [0,0,0,3,3,3]];

var level2 = [[0,3,0,0,0,1],
              [3,0,0,0,0,0],
              [0,0,4,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [2,0,0,0,0,0]];

var level3 = [[1,0,4,0,2,0],
              [0,0,0,0,0,0],
              [0,0,0,3,0,0],
              [0,0,0,3,0,0],
              [0,0,0,3,0,0],
              [0,0,0,3,3,3]];

var level4 = [[0,3,1,0,0,0],
              [3,3,5,0,0,0],
              [0,0,4,5,5,0],
              [0,0,0,0,0,2],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0]];

var level5 = [[1,0,0,0,0,0],
              [0,4,5,5,4,0],
              [0,0,4,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,2],
              [0,0,0,3,3,3]];

var level6 = [[0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,4,3,0,0,0],
              [2,0,1,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0]];

var level7 = [[0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,0,5,0,0,0],
              [2,5,1,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0]];

var level8 = [[0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,3,0],
              [2,0,0,0,5,0],
              [0,0,0,0,5,0],
              [0,0,0,0,5,1]];

var level9 = [[2,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,4,3,0,0,0],
              [4,0,3,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,1]];

var level10 = [[0,0,0,0,0,0],
              [0,0,0,0,1,0],
              [0,0,3,0,0,0],
              [0,0,1,0,0,0],
              [0,2,0,0,0,0],
              [0,0,0,0,0,0]];
//array of levels
//var levels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10];
var levels = [];
//current level index in above array
var currentLevelIndex = 0;
//used to save current level
var currentLevel = levels[currentLevelIndex];

//creates player on x, y position
//if forPreview is true then just create player on starting position
function createPlayer(xPosition, yPosition, forPreview){

  Crafty.c('CustomControls', {
      _speed: 1,

      CustomControls: function(speed) {
        //set speed of player
        if(speed) this._speed = speed;
        //frame counter
        var frameCounter = 0;
        //this is called per every frame
        this.bind('EnterFrame', function() {

          //print count number on screen
          $("#movement-count").html(movementCount);

          //if there is no commands for executeion enable run button
          if(str === "" && secondsPassed >= 2) {
            runClickable = true;
          }
          //check if player hits trap
          for(var i in traps){
            if(this.x === traps[i].x && this.y === traps[i].y){ //check if player collide with trap
              this.trigger("die"); // player die
            }
          }
          //check is player on destination and alert
          if(secondsPassed >= 4 && isPlayerOnTargetLocation() && once){

            createNewMap(level2, maxBlocks2);

            alert("successfully finished"); //aler message
            once = false; // do this only once
            currentLevelIndex++; // increase index
            currentLevel = levels[currentLevelIndex].map; // set next level
            destroyAll(); // destroy all entities
            traps = []; // delete all traps
            loadLevel(); // load next level
          }
          else if(secondsPassed >= 20 && isExecuting){
            reset();
          }
          //check if player moved one block on map
          if(Crafty.math.abs(this.lastPosition.x-this.x) >= blockWidth ||
            Crafty.math.abs(this.lastPosition.y-this.y) >= blockWidth){
              this.isMoving = false; //if he moved on block stop him
            }
          else if(((this.faceDirection === "left" && this.isForward) ||
            (this.faceDirection === "right" && !this.isForward)) && this.isMoving) {
            frameCounter = 0;
            secondsPassed = 0;
            this.x -= this._speed;
          }
          else if(((this.faceDirection === "right" && this.isForward) ||
            (this.faceDirection === "left" && !this.isForward)) && this.isMoving) {
            frameCounter = 0;
            secondsPassed = 0;
            this.x += this._speed;
          }
          else if(((this.faceDirection === "up" && this.isForward) ||
            (this.faceDirection === "down" && !this.isForward)) && this.isMoving) {
            frameCounter = 0;
            secondsPassed = 0;
            this.y -= this._speed;

          }
          else if(((this.faceDirection === "down" && this.isForward) ||
            (this.faceDirection === "up" && !this.isForward)) && this.isMoving) {
            frameCounter = 0;
            secondsPassed = 0;
            this.y += this._speed;
          }
          if(!this.isMoving){
            frameCounter++; //count frames when player is not moving
            isNextObstacle = isNext(); //call isNext() when player is not moving
          }

          //frame timer
          if(frameCounter >= Crafty.timer.FPS()/5){
            //this is called when player don't move for some time, like 10 frames
            secondsPassed++; // these are not real time seconds, used it to count time in game
            frameCounter = 0; // reset frameCaunter to 0
          }

        });
        return this;
      }
    });
  if(forPreview){ // just draw player on starting position if preview is on
    player = Crafty.e("2D, DOM, playerDown, Controls, CustomControls, SpriteAnimation, Collision")
      .attr({x: xPosition, y: yPosition, z: 1,
        isMoving: false, isForward: true, faceDirection: "down",
        lastPosition: {x: xPosition, y: yPosition}, isDead: false});
  }else{
//createing player entity
  player = Crafty.e("2D, DOM, playerDown, Controls, CustomControls, SpriteAnimation, Collision")
      .attr({x: xPosition, y: yPosition, z: 1,
        isMoving: false, isForward: true, faceDirection: "down",
        lastPosition: {x: xPosition, y: yPosition}, isDead: false})
      .CustomControls(2)
      .reel("walk_left", 500, 0, 2, 4)
      .reel("walk_right", 500, 0, 1, 4)
      .reel("walk_up", 500, 0, 3, 4)
      .reel("walk_down", 500, 0, 0, 4)
      .reel("turn_left", 100, 0, 2, 1)
      .reel("turn_right", 100, 0, 1, 1)
      .reel("turn_up", 100, 0, 3, 1)
      .reel("turn_down", 100, 0, 0, 1)
      .reel("die_down", 500, 0, 4, 4)
      .reel("die_up", 500, 0, 7, 4)
      .reel("die_left", 500, 0, 6, 4)
      .reel("die_right", 500, 0, 5, 4)
      .bind("EnterFrame", function(e) {



        //Animating death once

        if(this.isDead && secondsPassed <= 1){
          if(this.faceDirection === "left") {
            if(!this.isPlaying("die_left")){
              this.pauseAnimation().animate("die_left", 1);
            }
          }
          else if(this.faceDirection === "right") {
            if(!this.isPlaying("die_right"))
              this.pauseAnimation().animate("die_right", 1);
          }
          else if(this.faceDirection === "up") {
            if(!this.isPlaying("die_up"))
              this.pauseAnimation().animate("die_up", 1);
          }
          else if(this.faceDirection === "down" ) {
            if(!this.isPlaying("die_down"))
              this.pauseAnimation().animate("die_down", 1);
          }
        }else{

          //Animate player if he is moving
          //and stop animation if he is not moving
          if(this.faceDirection === "left" && this.isMoving) {
            if(!this.isPlaying("walk_left")){
              this.pauseAnimation().animate("walk_left", 10);
            }
          }
          else if(this.faceDirection === "right"  && this.isMoving) {
            if(!this.isPlaying("walk_right"))
              this.pauseAnimation().animate("walk_right", 10);
          }
          else if(this.faceDirection === "up"  && this.isMoving) {
            if(!this.isPlaying("walk_up"))
              this.pauseAnimation().animate("walk_up", 10);
          }
          else if(this.faceDirection === "down"  && this.isMoving) {
            if(!this.isPlaying("walk_down"))
              this.pauseAnimation().animate("walk_down", 10);
          }
          else if(!this.isMoving && !this.isDead){
            this.pauseAnimation();
          }
        }


      })
      .bind("go", function(object) {
        //sets isMoving variable
        //check if player is trying to go of the map border and disable his moving
        if(this.x === 0 && ((this.faceDirection === "left" && object.isForward) ||
           (this.faceDirection === "right" && !object.isForward))){
          this.isMoving = false;
        }
        else if(this.y === 0 && ((this.faceDirection === "up" && object.isForward) ||
           (this.faceDirection === "down" && !object.isForward))){
          this.isMoving = false;
        }
        else if(this.y === 5 * blockWidth && ((this.faceDirection === "down" && object.isForward) ||
           (this.faceDirection === "up" && !object.isForward))){
          this.isMoving = false;
        }
        else if(this.x === 5 * blockWidth && ((this.faceDirection === "right" && object.isForward) ||
           (this.faceDirection === "left" && !object.isForward))){
          this.isMoving = false;
        }
        else{
          this.isMoving = true;
        }
        this.isForward = object.isForward; //load passed variable
        this.lastPosition.x = this.x; //setting last position to current
        this.lastPosition.y = this.y;
      })
      .bind("stop", function(){
        //stopping player when he is trying to go over obstacle(rock)
        //and bring him back to last position
        if(this.faceDirection === "down" && this.isForward) this.y -= this._speed;
        else if(this.faceDirection === "down" && !this.isForward) this.y += this._speed;
        else if(this.faceDirection === "up" && this.isForward) this.y += this._speed;
        else if(this.faceDirection === "up" && !this.isForward) this.y -= this._speed;
        else if(this.faceDirection === "left" && this.isForward) this.x += this._speed;
        else if(this.faceDirection === "left" && !this.isForward) this.x -= this._speed;
        else if(this.faceDirection === "right" && this.isForward) this.x -= this._speed;
        else if(this.faceDirection === "right" && !this.isForward) this.x += this._speed;
        this.isMoving = false;
      })
      .bind("die", function(){
        //alert that player is dead and reset level
        this.isMoving = false; // unable player to move
        this.isDead = true;
        //wait 1 second then alert player and restart lvl
        Crafty.e("Delay").delay(function(){
          if(once) alert("you are dead");
          once = false;
          reset();
        }, 1000, 0);
      })
      .collision()
      .onHit("enemie1Down", function() {
        //when player hit enemie call die function
        this.trigger("die");
      }).onHit("stone", function() {
        //when player hit stone call stop function
        this.trigger("stop");
        this.pauseAnimation();
      });
    }
}
//create enemie on x,y position
function createEnemie(xPosition, yPosition, i, j){
  var enemie = Crafty.e("2D, DOM, enemie1Down, SpriteAnimation, Collision")
      .attr({x: xPosition, y: yPosition, z: 1, isMoving: false, faceDirection: "down", speed: 2, moveCounter: 0,
        lastPosition: {x: xPosition, y: yPosition}})
      //loading animation from sprite
      .reel("walk_left", 500, 0, 10, 4)
      .reel("walk_right", 500, 0, 9, 4)
      .reel("walk_up", 500, 0, 11, 4)
      .reel("walk_down", 500, 0, 8, 4)
      .reel("turn_left", 100, 0, 10, 1)
      .reel("turn_right", 100, 0, 9, 1)
      .reel("turn_up", 100, 0, 11, 1)
      .reel("turn_down", 100, 0, 8, 1)
      .bind("EnterFrame", function(e) {
        //if enemie moved one block stop it
        if(Crafty.math.abs(this.lastPosition.x-this.x) >= blockWidth ||
            Crafty.math.abs(this.lastPosition.y-this.y) >= blockWidth){
              this.isMoving = false;
              this.lastPosition.x = this.x;
              this.lastPosition.y = this.y;
            }
        else{
          //move enemie and animate his moving
          if(this.faceDirection === "left" && this.isMoving) {
            this.x -= this.speed;
            if(!this.isPlaying("walk_left")){
              this.pauseAnimation().animate("walk_left", 10);
            }
          }
          else if(this.faceDirection === "right"  && this.isMoving) {
            this.x += this.speed;
            if(!this.isPlaying("walk_right"))
              this.pauseAnimation().animate("walk_right", 10);
          }
          else if(this.faceDirection === "up"  && this.isMoving) {
            this.y -= this.speed;
            if(!this.isPlaying("walk_up"))
              this.pauseAnimation().animate("walk_up", 10);
          }
          else if(this.faceDirection === "down"  && this.isMoving) {
            this.y += this.speed;
            if(!this.isPlaying("walk_down"))
              this.pauseAnimation().animate("walk_down", 10);
          }
          else if(!this.isMoving){ // if he is not moving pause animation
            this.pauseAnimation();
          }
        }
      })
      .bind("go", function(){
        //move enemie 2 blocks up and 2 blocks down
        this.isMoving = true;
        if(this.moveCounter >= 2 && this.faceDirection === "down") {
          this.faceDirection = "up";
          this.moveCounter = 0;
        }
        else if(this.moveCounter >= 2 && this.faceDirection === "up"){
          this.faceDirection = "down";
          this.moveCounter = 0;
        }
        this.moveCounter++;

      })
      .bind("stop", function(){
        //stop enemie
        this.isMoving = false;
      })
      .collision()
      .onHit("playerDown", function() {
        this.pauseAnimation();
      });

  enemies.push(enemie);

  Crafty.e('2D, DOM, Color')
            .attr({x: j*20, y: gameHeight-120+(i*20), w: 20, h: 20, alpha: 1})
            .color('pink')
            .bind('EnterFrame', function(){
              this.x = enemie.x/blockWidth * 20;
              this.y = gameHeight-120 + enemie.y/blockWidth * 20;
            });
}

window.onload = function(){
  //Crafty start
  Crafty.init(gameWidth, gameHeight, document.getElementById('game'));

  //generate map from level matrix
  function generateWorld() {
    createNewMap(level1, maxBlocks1);
    currentLevel = levels[currentLevelIndex].map;
    loadLevel();
  }

  //make map preview
  function makePreview(){
    //Write text "Preview"
    Crafty.e("2D, DOM, Text").attr({w: gameWidth, h: gameHeight, x: 0, y: 0, z: 100})
      .text("Preview")
      .textColor("red")
      .textFont({size : '50px'})
      .css({"text-align": "center", "border": "none"});
    //draw minimap
    for(var i = 0; i < 6; i++) {
      for(var j = 0; j < 6; j++) {
        Crafty.e('2D, DOM, Color')
      .attr({x: j*20, y: gameHeight-120+(i*20), w: 20, h: 20, alpha: 1})
      .color('green');
      }
    }

    loadLevel();
  }

  Crafty.scene("loading", function() {
    //loading sprites
    var assetsObj = {
      "sprites": {
        "img/sprite.png": {
            "tile": 64, // tile width
            "tileh": 64, // tile height
            "map": { //starting positions of elements
                    "playerDown": [0,0],
                    "playerUp": [0,3],
                    "playerLeft": [0,2],
                    "playerRight": [0,1],
                    "enemie1Down": [0, 8],
                    "enemie1Right": [0, 9],
                    "enemie1Left": [0, 10],
                    "enemie1Up": [0, 11],
                    "grass1": [0, 13],
                    "sign": [1, 12],
                    "trap": [0, 12],
                    "stone": [2, 12]
                  }
        },

    },
    };


    //load takes an array of assets and a callback when complete
    Crafty.load(assetsObj , function() {
      //Crafty.scene("preview"); //when everything is loaded, run the preview scene
      Crafty.scene("main");
    }, function(e) { //progress
    },
    function(e) { //uh oh, error loading
    });

    //black background with some loading text
    Crafty.background("#000");
    Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
      .text("Loading")
      .textColor("white")
      .css({"text-align": "center"});
  });

  //automatically play the loading scene
  Crafty.scene("loading");

  Crafty.scene("main", function() {
    Crafty.background('#000');
    generateWorld();

    });
  //scene for map preview
  Crafty.scene("preview", function(){
    enemies = [];
    makePreview();
    //move enemie 10 times
    for(var i = 0; i < 10; i++){
      for(var j = 0; j < enemies.length; j++){
        timeoutID = setTimeout(function(){
          enemies[eIndex].trigger("go");
          if(eIndex<enemies.length-1) eIndex++;
          else eIndex = 0;
        }, 1000 * i);
        timeouts.push(timeoutID);
      }
    }

    //load main scene
    timeoutID = setTimeout(function(){stopPreview();}, 1000 * 11);
    timeouts.push(timeoutID);
  });

}
//check if is player on destination
function isPlayerOnTargetLocation(){
  if(player.x === sign.x && player.y === sign.y){
    return true;
  }else{
    return false;
  }
}


//change faceDirection of player according to current faceDirection
function turnLeft(){
  var str1 = "\
    movementCount++;\
    moveAllEnemies();\
    switch(player.faceDirection){ \
      case 'down': \
        player.faceDirection = 'right'; \
        player.animate('turn_right', 1); \
      break; \
      case 'up': \
        player.faceDirection = 'left'; \
        player.animate('turn_left', 1); \
      break; \
      case 'left': \
        player.faceDirection = 'down'; \
        player.animate('turn_down', 1); \
      break;\
      case 'right':\
        player.faceDirection = 'up';\
        player.animate('turn_up', 1);\
      break;\
    }";
  if (str === ""){
    str += str1;
  }else{
    str += "timeoutID = setTimeout(function(){ "+str1+"},"+(1000*commandCount)+"); \
          timeouts.push(timeoutID);";
  }
  commandCount++;

};
//change faceDirection of player according to current faceDirection
function turnRight(){
  var str1 = "moveAllEnemies();\
    movementCount++;\
    switch(player.faceDirection){ \
      case 'down': \
        player.faceDirection = 'left'; \
        player.animate('turn_left', 1); \
      break; \
      case 'up': \
        player.faceDirection = 'right'; \
        player.animate('turn_right', 1); \
      break; \
      case 'left': \
        player.faceDirection = 'up'; \
        player.animate('turn_up', 1); \
      break;\
      case 'right':\
        player.faceDirection = 'down';\
        player.animate('turn_down', 1);\
      break;\
    }";
  if (str === ""){
    str += str1;
  }else{
    str += "timeoutID = setTimeout(function(){ "+str1+"},"+(1000*commandCount)+"); \
    timeouts.push(timeoutID);";
  }
  commandCount++;

};
//wait for x turns
//call wait function x times
function waitFor(turns){
  for(var i = 0; i < turns; i++) wait();
}
//let enemie to move for one square
function wait(){
  if(str != ""){
        str += "timeoutID = setTimeout(function(){\
          movementCount++;\
          moveAllEnemies();}, "+1000*commandCount+");\
      timeouts.push(timeoutID);";
    }else{
      str += "moveAllEnemies();";
    }
    commandCount++;
}

function move(isForward){
  //if there is no command just add one
  //if there is commands in str, add new with timeout of 1 second * number of commands
  //so it will execute 1 second after last command executes
  //it is time between moves
  if(str != ""){
        str += "timeoutID = setTimeout(function(){\
          moveAllEnemies();\
          movementCount++;\
          player.trigger('go', {pixels: "+blockWidth+", isForward:"+isForward+"});\
      }, "+(1000*commandCount)+");\
      timeouts.push(timeoutID);";
    }else{
      str += "movementCount++;\
      moveAllEnemies();\
      player.trigger('go', {pixels: "+blockWidth+", isForward:"+isForward+"});";
    }
    commandCount++;
};

//Move forward or backward
function moveForB(isForward, steps){
  //call function to move player, x times
  for(var i = 0; i < steps; i++) move(isForward);
}

//make code from modules
function transcript(){
  //do this for every div from execute block
  $("#secondList>div").each(function(index, execute){
    var elementId = $(execute).attr("id");
    var parameter = $(execute).children("div").children("input.block-number").val();
    switch(elementId){
        case "mf":
          moveForB(true, parameter);
          break;
        case "mb":
          moveForB(false, parameter);
          break;
        case "tr":
          turnRight();
          break;
        case "tl":
          turnLeft();
          break;
        case "wt":
          waitFor(parameter);
          break;
        case "fl":
          parameter = $(execute).children("div").children("h3").children("input.block-number").val();
          var forBlock = $(execute).children(".forBlock");
          for(var i = 0; i < parameter; i++) again(forBlock);
          break;
        case "ifelse":
          var ifBl = $(execute).children(".ifBlock");
          var elBl = $(execute).children(".elseBlock");
          setTimeout(function(){
          str = "";
          commandCount = 0;
          secondsPassed = 0;
          once = true;
          var command = "if(isNextObstacle) again(ifBl);\
                  else again(elBl);"
          eval(command);
          eval(str);
          str = "";
          commandCount = 0;
        }, 1000*commandCount);
          break;

      }
  });
}

function again(element){
  $(element).children("div").each(function(index, execute){
    var elementId = $(execute).attr("id");
    var parameter = $(execute).children("div").children("input.block-number").val();
    switch(elementId){
        case "mf":
          moveForB(true, parameter);
          break;
        case "mb":
          moveForB(false, parameter);
          break;
        case "tr":
          turnRight();
          break;
        case "tl":
          turnLeft();
          break;
        case "wt":
          waitFor(parameter);
          break;
      }
  });
}

function isNext(){
//check is obstacle, enemie in front of player

  if((player.x/blockWidth !== 5) && player.faceDirection === "right" && (currentLevel[player.y/blockWidth][player.x/blockWidth + 1] === 3 ||
   currentLevel[player.y/blockWidth][player.x/blockWidth + 1] === 4 ||
   currentLevel[player.y/blockWidth][player.x/blockWidth + 1] === 5)){
    return true;
  }else if((player.x/blockWidth !== 0) && player.faceDirection === "left" && (currentLevel[player.y/blockWidth][player.x/blockWidth - 1] === 3 ||
   currentLevel[player.y/blockWidth][player.x/blockWidth - 1] === 4 ||
   currentLevel[player.y/blockWidth][player.x/blockWidth - 1] === 5)){
    return true;
  } else if((player.y/blockWidth !== 0) && player.faceDirection === "up" && (currentLevel[player.y/blockWidth - 1][player.x/blockWidth] === 3 ||
   currentLevel[player.y/blockWidth -1][player.x/blockWidth] === 4 ||
   currentLevel[player.y/blockWidth -1][player.x/blockWidth] === 5)){
    return true;
  } else if((player.y/blockWidth !== 5) && player.faceDirection === "down" && (currentLevel[player.y/blockWidth + 1][player.x/blockWidth] === 3 ||
   currentLevel[player.y/blockWidth + 1][player.x/blockWidth] === 4 ||
   currentLevel[player.y/blockWidth + 1][player.x/blockWidth] === 5)){
    return true;
  }else{
    return false;
  }
}


//executes javascript in str
function executeCode(){

  if(runClickable){
    isExecuting = true;
    runClickable = false;
    secondsPassed = 0;
    once = true;
    transcript();
    //execute javascript
    eval(str);
    str = "";
    commandCount = 0;
  }
  //document.getElementById("execute").innerHTML = ""; //clear execute div
}

function destroyAll(){
  Crafty('obj').each(function() {this.destroy();});
  //clear all actions after death
  for(var i in timeouts){
    clearTimeout(timeouts[i]);
  }
}

//reload level
function reset(){
  movementCount = 0;
  //destroy every object
  destroyAll();
  //reload current level
  loadLevel();
}
//run preview scene
function runPreview(){
    Crafty.scene("preview");
    $("#run-btn").addClass("hide");
    $("#map-prev-btn").addClass("hide");
    $("#map-stop-prev-btn").removeClass("hide");
}

function stopPreview(){
    $("#run-btn").removeClass("hide");
    $("#map-prev-btn").removeClass("hide");
    $("#map-stop-prev-btn").addClass("hide");
    reset();

}

function loadLevel(){
    isExecuting = false;
    //clear all blocks
    $(".panel").addClass("hide");
    resetBlocksCounter();
    $("#secondList").empty();
    //load available blocks
    var mb = levels[currentLevelIndex].maxBlocks;
    if(mb.forblock > 0){
      $("#fl").removeClass("hide");
    }
    if(mb.ifelse > 0){
      $("#ifelse").removeClass("hide");
    }
    if(mb.moveForward > 0){
      $("#mf").removeClass("hide");
    }
    if(mb.moveBackward > 0){
      $("#mb").removeClass("hide");
    }
    if(mb.turnLeft > 0){
      $("#tl").removeClass("hide");
    }
    if(mb.turnRight > 0){
      $("#tr").removeClass("hide");
    }
    if(mb.wait > 0){
      $("#wt").removeClass("hide");
    }

    //draw minimap green
    for(var i = 0; i < 6; i++) {
      for(var j = 0; j < 6; j++) {
        Crafty.e('2D, DOM, Color')
      .attr({x: j*20, y: gameHeight-120+(i*20), w: 20, h: 20, alpha: 1})
      .color('green');
      }
    }

     //generate the grass along the x-axis
    for(var i = 0; i < 6; i++) {
      //generate the grass along the y-axis
      for(var j = 0; j < 6; j++) {
        Crafty.e("2D, DOM, grass1")
          .attr({x: i * blockWidth, y: j * blockWidth});
      }
    }
    //load element positions from matrix
    for(var i in currentLevel){
      for(var j in currentLevel[i]){
        switch(currentLevel[i][j]){
          case 1:
            createPlayer(j * blockWidth, i * blockWidth);
            //draw on minimap
            Crafty.e('2D, DOM, Color')
            .attr({x: j*20, y: gameHeight-120+(i*20), w: 20, h: 20, alpha: 1})
            .color('yellow')
            .bind('EnterFrame', function(){
              this.x = player.x/blockWidth * 20;
              this.y = gameHeight-120 + player.y/blockWidth * 20;
            });
            break;
          case 2:
            sign = Crafty.e("2D, DOM, sign")
            .attr({x: j * blockWidth, y: i * blockWidth});
            //draw on minimap
              Crafty.e('2D, DOM, Color')
            .attr({x: j*20, y: gameHeight-120+(i*20), w: 20, h: 20, alpha: 1})
            .color('blue');

            break;
          case 3:
            var trap = Crafty.e("2D, DOM, trap")
              .attr({x: j * blockWidth, y: i * blockWidth});
            //draw on minimap
            Crafty.e('2D, DOM, Color')
            .attr({x: j*20, y: gameHeight-120+(i*20), w: 20, h: 20, alpha: 1})
            .color('red');

            traps.push(trap);
            break;
          case 4:
            var x = j * blockWidth;
            var y = i * blockWidth;
            createEnemie(x, y, i, j);
            break;
          case 5:
            var stone = Crafty.e("2D, DOM, stone")
              .attr({x: j * blockWidth, y: i * blockWidth});
              //draw on minimap
              Crafty.e('2D, DOM, Color')
            .attr({x: j*20, y: gameHeight-120+(i*20), w: 20, h: 20, alpha: 1})
            .color('black');
            obstacles.push(stone);
            break;
        }
      }
    }
  }
//function for moving all enemies in on turn
function moveAllEnemies(){
  for(var j = 0; j < enemies.length; j++){
      enemies[eIndex].trigger("go");
      if(eIndex<enemies.length-1) eIndex++;
      else eIndex = 0;
    }
}

//function to create new map
function createNewMap(map, maxBlocks){
  var mapObject = {};
  mapObject.map = map;
  mapObject.maxBlocks = maxBlocks;
  //create map
  levels.push(mapObject);
}

function resetBlocksCounter(){
  ifElseCounter = waitCounter = forCounter = turnRightCounter = turnLeftCounter = moveBackwardCounter = moveForwardCounter = 0;
}
