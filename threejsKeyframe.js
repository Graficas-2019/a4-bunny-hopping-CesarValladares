var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
bunny = null,
directionalLight = null;


var duration = 10, // sec

crateAnimator = null,
animateCrate = true,
lightAnimator = null,
loopAnimation = true;
var objLoader = null;

var currentTime = Date.now();

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

times=[17];

function run()
{
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Update the animations
        KF.update();

        // Update the camera controller
        orbitControls.update();
}

function loadObj()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();
    
    objLoader.load(
        'Stanford_Bunny_OBJ-JPG/20180310_KickAir8P_UVUnwrapped_Stanford_Bunny.obj',

        function(object)
        {
            var texture = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_g005c.jpg');
            var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            } );
                    
            bunny = object;
            bunny.scale.set(3,3,3);
            bunny.position.z = 0;
            bunny.position.x = 0;
            bunny.rotation.y = Math.PI /2;
            
            group.add(object);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        });
}

function createScene(canvas) 
{
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(20,10,0);
    scene.add(camera);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 0.75);

    // Create and add all the lights
    directionalLight.position.set(0, 5, 5);
    directionalLight.castShadow = true;
    root.add(directionalLight);

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create grass texture map
    var map = new THREE.TextureLoader().load("images/grass.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(5,5);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;

    // Add the mesh to our group
    scene.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    // Add bunny
    loadObj();

    // Now add the group to our scene
    scene.add( root );

}

function calculateTime(){

    aux = 1/32;

    for(i = 0; i < 33; i++){

        if (i == 0){
            times[i] =0
        }
        else if (i == 32){
            times[i] = 1
        }
        else {
            times[i] = aux;
            aux += 1/32;
        }

    }

    console.log(times)
    
}

function playAnimations()
{
    calculateTime()

    // position animation
    if (crateAnimator)
        crateAnimator.stop();

    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);

    a = 1.732050808;
    b = 2;

    if (animateCrate)
    {

        crateAnimator = new KF.KeyFrameAnimator;
        crateAnimator.init({ 
            interps:
                [
                    { 
                        keys:times, 
                        values:[

                            {x : 0 , y : 0 , z : 0},
                            {x : 1/2 , y : 1 , z : a/2},
                            {x : 1 , y : 0 , z : a},
                            {x : 3/2 , y : 1 , z : (a+b)/2},
                            {x : 2 , y : 0 , z : b},
                            {x : 5/2 , y : 1 , z : (a+b)/2},
                            {x : 3 , y : 0 , z : a},
                            {x : 7/2 , y : 1 , z : a/2},
                            {x : 4 , y : 0 , z : 0},
                            {x : 7/2 , y : 1 , z : -a/2},
                            {x : 3 , y : 0 , z : -a},
                            {x : 5/2 , y : 1 , z : -(a+b)/2},
                            {x : 2 , y : 0 , z : -b},
                            {x : 3/2 , y : 1 , z : -(a+b)/2},
                            {x : 1 , y : 0 , z : -a},
                            {x : 1/2 , y : 1 , z : -a/2},
                            {x : 0 , y : 0 , z : 0},
                            {x : -1/2 , y : 1 , z : a/2},
                            {x : -1 , y : 0 , z : a},
                            {x : -3/2 , y : 1 , z : (a+b)/2},
                            {x : -2 , y : 0 , z : b},
                            {x : -5/2 , y : 1 , z : (a+b)/2},
                            {x : -3 , y : 0 , z : a},
                            {x : -7/2 , y : 1 , z : a/2},
                            {x : -4 , y : 0 , z : 0},
                            {x : -7/2 , y : 1 , z : -a/2},
                            {x : -3 , y : 0 , z : -a},
                            {x : -5/2 , y : 1 , z : -(a+b)/2},
                            {x : -2 , y : 0 , z : -b},
                            {x : -3/2 , y : 1 , z : -(a+b)/2},
                            {x : -1 , y : 0 , z : -a},
                            {x : -1/2 , y : 1 , z : -a/2},
                            {x : 0 , y : 0 , z : 0},                      
                        ],
                        target:group.position
                    },
                    { 
                        keys:[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], 
                        values:[

                            {y : 0 },
                            {y : Math.PI/2 },
                            {y : 2*Math.PI/2 },
                            {y : 3*Math.PI/2 },
                            {y : 4*Math.PI/2 },
                            {y : 3*Math.PI/2 },                
                            {y : 2*Math.PI/2 },
                            {y : 1*Math.PI/2 },
                            {y : 0*Math.PI/2 },
                        ],
                        target:group.rotation
                    }
                ],

            loop: loopAnimation,
            duration:duration * 1000,
            easing:TWEEN.Easing.Linear.None,
        });
        crateAnimator.start();
        
    }
    
}