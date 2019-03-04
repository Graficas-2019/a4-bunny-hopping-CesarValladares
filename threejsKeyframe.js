    var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
bunny = null,
directionalLight = null;

var tbunnyx = 0;
var tbunnyz = 0;

var duration = 10, // sec

crateAnimator = null,
waveAnimator = null,
lightAnimator = null,
waterAnimator = null,
animateCrate = true,
animateWaves = true,
animateLight = true,
animateWater = true,
loopAnimation = false;

var objLoader = null;

var currentTime = Date.now();

var direction = 1;

function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract * 5;

    pos_x =  Math.cos(tbunnyx);
    pos_z =  Math.sin(tbunnyz);

    group.position.x =6* pos_x;
    group.position.z = 3 * pos_z;

    tbunnyz += 0.01;
    tbunnyx += 0.01 / 2;
    
}

function run()
{
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Update the animations
        KF.update();
        animate();

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
                    child.material.normalMap = normalMap;
                }
            } );
                    
            bunny = object;
            bunny.scale.set(3,3,3);
            bunny.position.z = 0;
            bunny.position.x = 0;
            bunny.rotation.y = Math.PI /2;
            
            group.add(bunny);
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
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(0, 1, 2);
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

function playAnimations()

{
    // position animation
    if (crateAnimator)
        crateAnimator.stop();

    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);

    if (animateCrate)
    {

        crateAnimator = new KF.KeyFrameAnimator;
        crateAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], 
                        values:[
                                { x : 0, y : 0, z : 0},
                                { x : 0, y : 0.5, z : 0},
                                { x : 0, y : 0, z : 0},
                                { x : 0, y : 0.5, z : 0},
                                { x : 0, y : 0, z : 0},
                                { x : 0, y : 0.5, z : 0},
                                { x : 0, y : 0, z : 0},
                                { x : 0, y : 0.5, z : 0},
                                { x : 0, y : 0, z : 0},
                                { x : 0, y : 0.5, z : 0},
                                ],
                        target:group.position
                    }
                ],
            loop: loopAnimation,
            duration:duration * 1000,
            easing:TWEEN.Easing.Linear.None,
        });
        crateAnimator.start();
        
    }
    
    // // rotation animation
    // if (waveAnimator)
    //     waveAnimator.stop();

    // waves.rotation.set(-Math.PI / 2, 0, 0);

    // if (animateWaves)
    // {
    //     waveAnimator = new KF.KeyFrameAnimator;
    //     waveAnimator.init({ 
    //         interps:
    //             [
    //                 { 
    //                     keys:[0, .5, 1], 
    //                     values:[
    //                             { x : -Math.PI / 2, y : 0 },
    //                             { x : -Math.PI / 2.2, y : 0 },
    //                             { x : -Math.PI / 2, y: 0 },
    //                             ],
    //                     target:waves.rotation
    //                 },
    //             ],
    //         loop: loopAnimation,
    //         duration:duration * 1000,
    //     });
    //     waveAnimator.start();
    // }
    
    // // color animation
    // if (lightAnimator)
    //     lightAnimator.stop();

    // directionalLight.color.setRGB(1, 1, 1);

    // if (animateLight)
    // {
    //     lightAnimator = new KF.KeyFrameAnimator;
    //     lightAnimator.init({ 
    //         interps:
    //             [
    //                 { 
    //                     keys:[0, .4, .6, .7, .8, 1], 
    //                     values:[
    //                             { r: 1, g : 1, b: 1 },
    //                             { r: 0.66, g : 0.66, b: 0.66 },
    //                             { r: .333, g : .333, b: .333 },
    //                             { r: 0, g : 0, b: 0 },
    //                             { r: .667, g : .667, b: .667 },
    //                             { r: 1, g : 1, b: 1 },
    //                             ],
    //                     target:directionalLight.color
    //                 },
    //             ],
    //         loop: loopAnimation,
    //         duration:duration * 1000,
    //     });
    //     lightAnimator.start();
    // }
                
    // // opacity animation
    // if (waterAnimator)
    //     waterAnimator.stop();
    
    // cube.material.opacity = 1;	

    // if (animateWater)
    // {
    //     waterAnimator = new KF.KeyFrameAnimator;
    //     waterAnimator.init({ 
    //         interps:
    //             [
    //                 { 
    //                     keys:[0, 1], 
    //                     values:[
    //                             { x : 0, y : 0 },
    //                             { x : 1, y : 0 },
    //                             ],
    //                     target:waves.material.map.offset
    //                 },
    //             ],
    //         loop: loopAnimation,
    //         duration:duration * 1000,
    //         easing:TWEEN.Easing.Sinusoidal.In,
    //     });
    //     waterAnimator.start();
    // }

}