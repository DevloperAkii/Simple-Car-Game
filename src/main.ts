import { Application,
  Assets,
  Sprite ,
  Graphics ,
  Container ,
  Color,
  } from "pixi.js";

const app = new Application();
let car = new Sprite();
const roadLines = new Container();
(async () => {
  // Create a new application 
  await app.init({ background: "white", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // // Loading textures
  const carTexture = await Assets.load("/assets/F1Car.png");

  // // creating Sprites
  car = new Sprite(carTexture);

  //Stating game
  Game();
})();

function Game(){

  //Create Road Rect
  const roadRect = new Graphics().rect(app.screen.width / 2, 0,500,app.screen.height)
  .fill('black');
  roadRect.pivot.set(roadRect.width / 2,0.5);

  //Containers
  roadLines.position.set(app.screen.width / 2);
  roadLines.pivot.set(roadLines.width / 2,roadLines.height / 2);

  const ControlButtons = new Container();

  //add Child To Continers Buttons
  for(let i = 0; i < 20 ; i++)
  {
    const roadLineRect = new Graphics().rect(0,app.screen.height - 50,25,50).fill('white');
    roadLineRect.pivot.x = roadLineRect.width / 2;
    roadLineRect.position.y -= i * 200;
    roadLines.addChild(roadLineRect);
  }

  const rightButton = new Graphics().rect((app.screen.width / 2) - 1,0,(roadRect.width / 2),app.screen.height)
  .fill(new Color({r : 255 , g : 255 , b : 255 , a : 0.05}));
  rightButton.pivot.set(rightButton.width,0)
  rightButton.eventMode = "static";
  rightButton.on("pointerdown",RightButtonClick);

  const leftButton = new Graphics().rect((app.screen.width / 2) + 1,0 ,(roadRect.width / 2),app.screen.height)
  .fill(new Color({r : 255 , g : 255 , b : 255 , a : 0.05}));
  leftButton.eventMode = "static";
  leftButton.on("pointerdown",LeftButtonClick);

  ControlButtons.addChild(rightButton,leftButton);

  // Creating Car Sprites
  car.anchor.set(0.5);
  car.position.set(app.screen.width / 2,app.screen.height / 2 + 200);
  car.angle = -90;
  car.scale.set(0.2,0.2);

  // Add Sprites To Stage/Renderer 
  app.stage.addChild(roadRect);
  app.stage.addChild(roadLines);
  app.stage.addChild(car);
  app.stage.addChild(ControlButtons);

  RoadAnimation();
}

function RoadAnimation(){
    app.ticker.add((time) => {

    for(let i = 0; i < roadLines.children.length; i++)
    {
      roadLines.children[i].position.y += 5 * time.deltaTime;
      if(roadLines.children[i].position.y > app.screen.height)
      {
        roadLines.children[i].position.y = roadLines.children[roadLines.children.length - 1].position.y - 200;
        const childern = roadLines.children[i];
        roadLines.removeChild(roadLines.children[i]);
        roadLines.addChild(childern);
      }
    }

  });
}

function RightButtonClick(){
  console.log("Right Side click");
  let timer = 0;
  app.ticker.add((time) => {
    timer += time.deltaTime;
    if(timer < 8){
      car.angle -= time.deltaTime * 50;
      car.position.x -= 3;
    }
    else{
      car.angle = -90;
    }
  })
}

function LeftButtonClick(){
  console.log("Left Side click")
  let timer = 0;
  app.ticker.add((time) => {
    timer += time.deltaTime;
    if(timer < 8){
      car.angle += time.deltaTime* 50;
      car.position.x += 3;
    }
    else{
      car.angle = -90;
    }
  })
}
