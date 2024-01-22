const yunjin = new LoadedImage("./assets/yunjin.png");
const hanni = new LoadedImage("./assets/hanni.png");
const jungkook = new LoadedImage("./assets/jungkook.png");
const kimjongun = new LoadedImage("./assets/kimjongun.png");

const baseSize = 10;
const gameWidth = 400;
const gameHeight = 600;
const wallWidth = 10;
const floorWidth = 50;

var types = {
                1: yunjin,
                2: hanni,
                3: jungkook,
                4: kimjongun
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
var lwall = Bodies.rectangle(50-wallWidth/2, gameHeight/2, wallWidth, gameHeight, {isStatic: true});
var rwall = Bodies.rectangle(gameWidth+50+wallWidth/2, gameHeight/2, wallWidth, gameHeight, {isStatic: true});
var ground = Bodies.rectangle((gameWidth+100)/2, gameHeight+floorWidth/2, gameWidth+2*wallWidth, floorWidth, {isStatic: true});

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
        var type = Math.round(x*1+1);
        type = 1;
        const size = Math.round(baseSize * Math.pow(Math.sqrt(2), type-1));
        circle = Bodies.circle(event.pageX, 0, size,
            {
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
                const newR = bodyA.circleRadius * Math.sqrt(2); // Adjust the factor for the desired size
                Composite.remove(engine.world, [bodyA, bodyB]);
                console.log(newR);

                // while (isPointOccupied(newX, newY-newR)) {
                //     newY += 1; // Move upward until finding an unoccupied position
                // }

                // Create a new circle with a larger radius
                const size = newR / baseSize;
                const type = Math.round(Math.log(size)/Math.log(Math.sqrt(2)));
                // console.log(type);

                const newCircle = Bodies.circle(newX, newY, newR,
                    {
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
                // var s = newCircle.circleRadius;
                // while (s < newR) {
                //     newCircle.circleRadius += 1;
                //     console.log(newR);
                //     // console.log(newCircle.circleRadius);
                //     s += 1;
                // }
            }
        }
    });
});
