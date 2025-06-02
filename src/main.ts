import 
{ 
  Application,
  Assets,
  Sprite ,
  Graphics ,
  Container ,
  Color,
  TilingSprite,
}
from "pixi.js";

import 'pixi.js';
import { sound } from "@pixi/sound";
import "pixi.js/math-extras"

const app = new Application();
const sceneContainer = new Container();

const roadLines = new Container();
let car = new Sprite();
let road = new TilingSprite();
let roadRect = new Graphics();

const carMoveLerpSpeed = 8;
const carMoveDistance = 3;
const carAngletoRoatate = 50;
const carDefaultAngle = -90;

const distanceBetweenRoadTiels = 200;


(async () => {
  // Create a new application 
  await app.init({ background: "white", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  loadAssets();
  
  // // Loading textures
  const carTexture = await Assets.load("/assets/F1Car.png");
  const roadtexture = await Assets.load("/assets/road.png");

  // // creating Sprites
  car = new Sprite(carTexture);
  road = new TilingSprite(roadtexture);

  //Stating game
  Game();
})();

async function loadAssets(){
  await Assets.load({
    alias: "CarSound",
    src: "/assets/CarSound.mp3"
  });

  await Assets.load({
    alias : "TurnSound",
    src:"/assets/Turning.mp3"
  })

  sound.add("CarSound",Assets.get("CarSound"));
  sound.add("TurnSound",Assets.get("TurnSound"))

  window.addEventListener("pointerdown",() => {
    sound.play("CarSound",{loop : true,volume : 0.4});
  },{once : true})
}

function Game(){

  //Create Road Rect
  // roadRect = new Graphics().rect(app.screen.width / 2, 0,500,app.screen.height)
  // .fill('black');
  road.pivot.set(road.width / 2,road.height / 2);
  road.position.set(app.screen.width / 2,app.screen.height / 2)
  road.scale.y = 2;
  road.tileScale.set(1,1);

  //Containers
  roadLines.position.set(app.screen.width / 2);
  roadLines.pivot.set(roadLines.width / 2,roadLines.height / 2);

  const ControlButtons = new Container();

  //add Child To Continers Buttons
  for(let i = 0; i < 20 ; i++)
  {
    const roadLineRect = new Graphics().rect(0,app.screen.height - 50,25,50).fill('white');
    roadLineRect.pivot.x = roadLineRect.width / 2;
    roadLineRect.position.y -= i * distanceBetweenRoadTiels;
    roadLines.addChild(roadLineRect);
  }

  const rightButton = new Graphics().rect((app.screen.width / 2) - 1,0,(roadRect.width / 2),app.screen.height)
  .fill(new Color({r : 255 , g : 255 , b : 255 , a : 0.1}));
  rightButton.pivot.set(rightButton.width,0)
  rightButton.eventMode = "static";
  rightButton.on("pointerdown",RightButtonClick);

  const leftButton = new Graphics().rect((app.screen.width / 2) + 1,0 ,(roadRect.width / 2),app.screen.height)
  .fill(new Color({r : 255 , g : 255 , b : 255 , a : 0.1}));
  leftButton.eventMode = "static";
  leftButton.on("pointerdown",LeftButtonClick);

  ControlButtons.addChild(rightButton,leftButton);

  // Creating Car Sprites
  car.anchor.set(0.5);
  car.position.set(app.screen.width / 2,app.screen.height / 2 + 200);
  car.angle = carDefaultAngle;
  car.scale.set(0.2,0.2);

  // Add Sprites To Stage/Renderer 
  sceneContainer.addChild(roadLines,car)
  app.stage.addChild(road);
  app.stage.addChild(sceneContainer);
  app.stage.addChild(ControlButtons);

  RoadAnimation();
}

function RoadAnimation(){
    app.ticker.add((time) => {
    // road.tilePosition.y += 0.05 ;
    for(let i = 0; i < roadLines.children.length; i++)
    {
      roadLines.children[i].position.y += 5 * time.deltaTime;
      if(roadLines.children[i].position.y > app.screen.height)
      {
        roadLines.children[i].position.y = roadLines.children[roadLines.children.length - 1].position.y - distanceBetweenRoadTiels;
        const childern = roadLines.children[i];
        roadLines.removeChild(roadLines.children[i]);
        roadLines.addChild(childern);
      }
    }

  });
}

function RightButtonClick(){
  console.log("Right Side click");
  sound.play("TurnSound");
  let timer = 0;
  if((car.position.x - carMoveDistance * carMoveLerpSpeed) > ((app.screen.width / 2) - (roadRect.width / 2))){
    app.ticker.add((time) => {
      timer += time.deltaTime;
      if(timer < carMoveLerpSpeed){
        car.angle -= time.deltaTime * carAngletoRoatate;
        car.position.x -= carMoveDistance;
      }
      else
      {
        car.angle = carDefaultAngle;
      }
    })
  }
}

function LeftButtonClick(){
  console.log("Left Side click")
  sound.play("TurnSound");
  let timer = 0;
  if((car.position.x + carMoveDistance * carMoveLerpSpeed) < ((app.screen.width / 2) + (roadRect.width / 2))){
    app.ticker.add((time) => {
      timer += time.deltaTime;
      if(timer < carMoveLerpSpeed){
        car.angle += time.deltaTime * carAngletoRoatate;
        car.position.x += carMoveDistance;
      }
      else
      {
        car.angle = carDefaultAngle;
      }
    })
  }
}
