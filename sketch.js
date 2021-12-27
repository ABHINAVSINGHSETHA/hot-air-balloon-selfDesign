var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg;
var obsBottomGroup, obsBottom1, obsBottom2, obsBottom3;
var obsTopGroup, obsTop1, obsTop2;
var dieSound; 
var score;
var gameOverImg, restartImg

function preload(){

bgImg = loadImage("assets/bg.png")
obsBottom1 = loadImage("assets/obsBottom1.png");
obsBottom2 = loadImage("assets/obsBottom2.png");
obsBottom3 = loadImage("assets/obsBottom3.png");
obsTop1 = loadImage("assets/obsTop1.png");
obsTop2 = loadImage("assets/obsTop2.png");
dieSound = loadSound("assets/die.mp3")
balloonImg = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png")
restartImg = loadImage("assets/restart.png");
gameOverImg = loadImage("assets/gameOver.png")
popImg = loadAnimation("assets/pop.png");
}

function setup(){
createCanvas(800, 400);

//bg = createSprite(165,485,1,1);
//bg.addImage(bgImg);
//bg.scale = 1.3

bottomGround = createSprite(200, 390,1200,20);
bottomGround.visible = false;

topGround = createSprite(200,10,1200,20);
topGround.visible = false;
      
balloon = createSprite(100,200,20,50);
balloon.addAnimation("balloon",balloonImg);
balloon.scale = 0.2;
balloon.addAnimation("pop", popImg);

obsBottomGroup = createGroup();
obsTopGroup = createGroup();

gameOver = createSprite(300,100);
gameOver.addImage(gameOverImg);

restart = createSprite(300,140);
restart.addImage(restartImg);

gameOver.scale = 0.5;
restart.scale = 0.5;

balloon.setCollider("rectangle",0,0,balloon.width, balloon.height);
balloon.debug = true;

score = 0;
  
}

function draw() {
  
  background(bgImg);
  fill("black");
  text("Score: "+ score, 500,50);

  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    bottomGround.velocityX = -(4 + 3* score/100);
    topGround.velocityX = -(4 + 3* score/100);

    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //if(score>0 && score%100 === 0){
      // checkPointSound.play() 
    //}
    
    if (bottomGround.x < 0){
      bottomGround.x = bottomGround.width/2;
    }
    
    if (topGround.x < 0){
      topGround.x = topGround.width/2;
    }

    //jump when the space key is pressed
    if(keyDown("UP_ARROW") && balloon.y >= 100) {
        balloon.velocityY = -12;
        //jumpSound.play();
    }
    
    if(keyDown("DOWN_ARROW") && balloon.y <= 100) {
      balloon.velocityY = +12;
      //jumpSound.play();
    }

    if(keyDown("LEFT_ARROW") && balloon.y >= 100) {
      balloon.scale  = 0.05;
    
      //jumpSound.play();
  }

  if(keyDown("RIGHT_ARROW") && balloon.y >= 100) {
    balloon.scale  = 0.2;
  
    //jumpSound.play();
}

    //add gravity
    balloon.velocityY = balloon.velocityY + 0.8;
  
    spawnObsBottom();  
    spawnObsTop();

   if(obsBottomGroup.isTouching(balloon) || obsTopGroup.isTouching(balloon)){
    //trex.velocityY = -12;
     //jumpSound.play();
    gameState = END;
    dieSound.play();
     }
  }
       
else if (gameState === END) {
 gameOver.visible = true;
    restart.visible = true;
  //change the balloon animation
  balloon.changeAnimation("pop");
balloon.scale = 0.2;

      
   if(mousePressedOver(restart)) {
    reset();
   }
   topGround.velocityX = 0;
   bottomGround.velocityX = 0;   
   balloon.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obsBottomGroup.setLifetimeEach(-1);
    obsTopGroup.setLifetimeEach(-1);
     
    
     obsBottomGroup.setVelocityXEach(0);
     obsTopGroup.setVelocityXEach(0);    
   
  

 
}
  
balloon.collide(bottomGround);
balloon.collide(topGround);
   
  drawSprites();
}

function spawnObsBottom(){
  if (frameCount % 60 === 0){
    var obsBottom = createSprite(600,310,10,40);
    obsBottom.velocityX = -(6 + score/100);
    
     //generate random obstacles
     var rand = Math.round(random(1,3));
     switch(rand) {
       case 1: obsBottom.addImage(obsBottom1);
               break;
       case 2: obsBottom.addImage(obsBottom2);
               break;
       case 3: obsBottom.addImage(obsBottom3);
               break;

      default: break;
     }
     obsBottom.scale = 0.1;
    obsBottom.lifetime = 300;
   
   //add each obstacle to the group
    obsBottomGroup.add(obsBottom);
    }
  }

  function spawnObsTop(){
    if (frameCount % 110 === 0){
      var obsTop = createSprite(600,100,10,40);
      obsTop.velocityX = -(6 + score/100);
      
       //generate random obstacles
       var rand = Math.round(random(1,2));
       switch(rand) {
         case 1: obsTop.addImage(obsTop1);
                 break;
         case 2: obsTop.addImage(obsTop2);
                 break;
          default: break;
       }
       obsTop.scale = 0.1;
      obsTop.lifetime = 300;
     
     //add each obstacle to the group
      obsTopGroup.add(obsTop);
      }
    }

    function reset(){
      gameState = PLAY ;
      gameOver.visible = false;
      restart.visible = false;
      obsBottomGroup.destroyEach();
      obsTopGroup.destroyEach();
      score = 0;
      balloon.changeAnimation("balloon");
      balloon.scale = 0.2;
    }
    


  

