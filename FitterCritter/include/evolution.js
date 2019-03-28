 function Brain() {

     //1D array of neuron activations
     this.act = new Array(hiddenLayers);
     for (var i = 0; i < hiddenLayers; i++) {
         this.act[i] = 0;
     }

     // These are 2D arrays
     // [2, 4, 2]
     // [4, 2, 1]
     // [0, 1, 3]
     // [2, 3, 1]
     // [4, 0, 2]
     // B-size       # rows      how many layers         (-1.2, 1.2)
     // B-ensity     # cols      how many units/layer    (0, hiddenLayers)
     //2D array of synapse weights and indexes of neurons they connect to
     this.w = new Array(hiddenLayers);
     this.ix = new Array(hiddenLayers);
     for (var i = 0; i < hiddenLayers; i++) {
         this.w[i] = new Array(hiddenUnitsPerLayer);
         this.ix[i] = new Array(hiddenUnitsPerLayer);
         for (var j = 0; j < hiddenUnitsPerLayer; j++) {
             this.w[i][j] = randf(-1.2, 1.2);
             this.ix[i][j] = randi(0, hiddenLayers);
         }
     }

 }

 Brain.prototype = {
     //feeds forward the brain. s1 and s2 are the two senses, both in [0,1]
     //brain takes inputs and sets its outputs
     tick: function (s1, s2) {

         this.act[0] = s1; //set inputs
         this.act[1] = s2;
         this.act[3] = 1; //some bias neurons are always on
         this.act[4] = 1;
         this.act[5] = 1;
         this.act[6] = 1;

         for (var i = 7; i < hiddenLayers; i++) { //rn that's 7 to 20
             var a = 0;
             for (var j = 0; j < hiddenUnitsPerLayer; j++) {
                 a += this.w[i][j] * this.act[this.ix[i][j]]
             }
             // this.act[7 to (hiddenLayers-1)]
             // = all weights in that layer times the activation of some hidden layer
             //     (this layer was randomly decided at init, same each time per unit)
             this.act[i] = 1.0 / (1.0 + Math.exp(-a)); //pass through sigmoid
         }

         //assume last 2 neurons are the outputs
         return {
             out0: -(this.act[hiddenLayers - 1] - 0.5), // Turn amount
             out1: this.act[hiddenLayers - 2] // 
         };
     },

     //used during reproduction
     //copy over the brain with some mutation. crude. for now
     mutateFrom: function (brain) {
         var amt = 0;
         //lossy copy of brain structure
         for (var i = 0; i < hiddenLayers; i++) {
             for (var j = 0; j < hiddenUnitsPerLayer; j++) {

                 var m = brain.w[i][j];
                 if (randf(0, 1) < mutrate) {
                     m += randn(0, mutrate2);
                     amt += 1;
                 }
                 this.w[i][j] = m;

                 m = brain.ix[i][j];
                 if (randf(0, 1) < mutrate) {
                     m = randi(0, hiddenLayers);
                     amt += 1;
                 }
                 this.ix[i][j] = m;
             }
         }
         //console.log(amt);
         return amt;
     }
 }


 function Agent() {
     this.pos = new Vector2D(randf(0, WIDTH), randf(0, HEIGHT));
     this.dir = randf(0, 2 * Math.PI);
     this.s1 = 0; //food sense eye 1
     this.s2 = 0; //food sense eye 2
     this.brain = new Brain();
     this.speed = 7.0; //6.0;//4.0;
     this.boost = 0.0; //boost, on top of speed
     this.health = 1.0;
     this.rep = 0.0; //replication counter
     this.selected = false;
     this.hue = Math.round(255.0 * Math.random());
 }


 function moveAgent(a) {
     //move agent
     var vel = new Vector2D((a.boost + a.speed) * Math.cos(a.dir), (a.boost + a.speed) * Math.sin(a.dir));
     a.pos.plusEq(vel);

     //enforce boundary conditions: wrap around if necessary
     if (a.pos.x < 0) a.pos.x = WIDTH;
     if (a.pos.x > WIDTH) a.pos.x = 0;
     if (a.pos.y < 0) a.pos.y = HEIGHT;
     if (a.pos.y > HEIGHT) a.pos.y = 0;
 }
