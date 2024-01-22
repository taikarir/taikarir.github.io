const yunjin = new LoadedImage("./assets/yunjin.png");
const hanni = new LoadedImage("./assets/hanni.png");
const jungkook = new LoadedImage("./assets/jungkook.png");
const kimjongun = new LoadedImage("./assets/kimjongun.png");
const iu = new LoadedImage("./assets/iu.png");
const karina = new LoadedImage("./assets/karina.png");
const wonyoung = new LoadedImage("./assets/wonyoung.png");
const choguesung = new LoadedImage("./assets/choguesung.png");
const tzuyu = new LoadedImage("./assets/tzuyu.png");
const felix = new LoadedImage("./assets/felix.png");
const jisoo = new LoadedImage("./assets/jisoo.png");
const eunwoo = new LoadedImage("./assets/eunwoo.png");

const baseSize = 15;
const scaling = 1.3;
const gameWidth = 600;
const gameHeight = 600;
const wallWidth = 10;
const floorWidth = 50;

const boxFriction = 0;
const ballFriction = 0.05;
const floorRestitution = 0;
const wallRestitution = 0.20;

var types = {
    0: karina,
    1: wonyoung,
    2: tzuyu,
    3: eunwoo,
    4: iu,
    5: felix,
    6: hanni,
    7: jisoo,
    8: jungkook,
    9: yunjin,
    10: kimjongun
}

var scoring = {
    0: 1,
    1: 3,
    2: 7,
    3: 9,
    4: 13,
    5: 21,
    6: 27,



}

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Collision = Matter.Collision,
    Query = Matter.Query,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: gameWidth+100,
        height: gameHeight+200,
        wireframes: false, // disable Wireframe
    }
});

// create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80);
// var boxB = Bodies.rectangle(450, 50, 80, 80);
var lwall = Bodies.rectangle(50-wallWidth/2, gameHeight/2, wallWidth, gameHeight, {isStatic: true, friction: boxFriction, restitution: wallRestitution});
var rwall = Bodies.rectangle(gameWidth+50+wallWidth/2, gameHeight/2, wallWidth, gameHeight, {isStatic: true, friction: boxFriction, restitution: wallRestitution});
var ground = Bodies.rectangle((gameWidth+100)/2, gameHeight+floorWidth/2, gameWidth+2*wallWidth, floorWidth, {isStatic: true, friction: boxFriction, restitution: floorRestitution});

// add all of the bodies to the world
Composite.add(engine.world, [lwall, rwall, ground]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function isPointOccupied(x, y) {
    const bodies = Query.point(engine.world.bodies, { x: x, y: y });
    return bodies.length > 0;
}

document.body.addEventListener('click', (event) => {
    // Create a new circle at mouse position and add it to the world
    // loadImage("./assets/yunjin.jpeg",)
    var x = Math.random();
    var circle;
    if (x<1) {
        var type = Math.round(x*4);
        // type = 0;
        const size = Math.round(baseSize * Math.pow(scaling, type));
        circle = Bodies.circle(event.pageX, 0, size,
            {
                friction: ballFriction,
                restitution: floorRestitution,
                render: {
                        sprite: {
                            texture: types[type].img.src,
                            xScale: size * 2 / types[type].img.width, // Adjust based on image dimensions
                            yScale: size * 2 / types[type].img.height
                        }
                }
            }
        );
    }
    // } else {
    //     circle = Bodies.circle(event.pageX, 0, 60,
    //         {
    //             render: {
    //                     sprite: {
    //                         texture: kimjongun.img.src,
    //                         xScale: 60 * 2 / kimjongun.img.width, // Adjust based on image dimensions
    //                         yScale: 60 * 2 / kimjongun.img.height
    //                     }
    //             }
    //         }
    //     );
    // }
    Composite.add(engine.world, circle);
});

let verticalLine = Bodies.rectangle(0, 0, 2, window.innerHeight, { isStatic: true, render: { visible: false } });

// Add the line to the world
Composite.add(engine.world, verticalLine);

// Function to update the vertical line position
function updateVerticalLine(x) {
    // Update the position of the line based on the cursor's x-coordinate
    verticalLine.position.x = x;
}
document.body.addEventListener('mousemove', (event) => {
    // Update the position of the vertical line based on the cursor's x-coordinate
    updateVerticalLine(event.pageX);
});

Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        console.log(bodyA,bodyB);
        if (bodyA.id < bodyB.id) {

            // Check if both bodies are circles and have the same radius
            if (Collision.collides(bodyA, bodyB) && Math.round(bodyA.circleRadius) === Math.round(bodyB.circleRadius)) {
                // console.log("yes");
                // Remove the existing circles from the world
                const newX = (bodyA.position.x+bodyB.position.x)/2;
                var newY = (bodyA.position.y+bodyB.position.y)/2;
                const oldR = bodyA.circleRadius;
                const newR = bodyA.circleRadius * scaling; // Adjust the factor for the desired size
                Composite.remove(engine.world, [bodyA, bodyB]);
                console.log(newR);

                // while (isPointOccupied(newX, newY-newR)) {
                //     newY += 1; // Move upward until finding an unoccupied position
                // }

                // Create a new circle with a larger radius
                const size = newR / baseSize;
                const type = Math.round(Math.log(size)/Math.log(scaling));
                console.log(type);

                const newCircle = Bodies.circle(newX, newY, newR,
                    {
                        friction: ballFriction,
                        restitution: floorRestitution,
                        render: {
                            sprite: {
                                texture: types[type].img.src,
                                xScale: newR * 2 / types[type].img.width, // Adjust based on image dimensions
                                yScale: newR * 2 / types[type].img.height
                            }
                        }
                    }
                );

                // Add the new circle to the world
                Composite.add(engine.world, newCircle);
            }
        }
    });
});
