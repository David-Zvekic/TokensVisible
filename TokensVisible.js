// pushTokenBack
// (c) 2021 David Zvekic
// permission granted to use and distribute as per LICENSE file


let tokensVisible= new Object();
tokensVisible.hoverToken= new Object();
tokensVisible.hoverToken.hoveredTarget=0;
tokensVisible.pushhotkey='';

tokensVisible.pushToBack=function() {

  if ( tokensVisible?.hoverToken?.hoveredTarget instanceof Token) { 
    const token = tokensVisible.hoverToken.hoveredTarget; 
    let position = 0;
    var foundchild;
    for (const x of canvas.tokens.children[0].children) {
       if (x==token) break;
       position++;
    }

    if (position<canvas.tokens.children[0].children.length){
      // found the child, push it to element 0
      canvas.tokens.children[0].children.splice(position,1);
      canvas.tokens.children[0].children.unshift(token);
    }
  } else {
 //   console.warn('TokensVisible - invalid target', tokensVisible.hoverToken.hoveredTarget);
  } 

};


tokensVisible.pushTokenBackListener = function(event){
	
	if (event.target !== document.body && event.target !== canvas.app.view) return;
    if ( event.isComposing || event.repeat) return;
    if (event.key==tokensVisible.pushhotkey ) tokensVisible.pushToBack();
    if (event.key==tokensVisible.castRayshotkey ) { 
		   
	   switch(tokensVisible.currentCastRaysmode){
		   case "Standard" :tokensVisible.setProperCastRays('Enhanced');
		   break;
	   case "Enhanced" :tokensVisible.setProperCastRays('Super');
		   break;
	   case "Super": tokensVisible.setProperCastRays('Standard');
		   break;
	   default:  tokensVisible.setProperCastRays('Enhanced'); 
	   }
   }
  
   if (event.key==tokensVisible.sightCachehotkey ) { 
	   
   switch(tokensVisible.currentSightCacheMode){
	   case "On" :tokensVisible.setProperSightCache('Off');
	   break;
   case "Off" :tokensVisible.setProperSightCache('On');
	   break;
   default:  tokensVisible.setProperSightCache('On'); 
   }
  }
   

};
 

tokensVisible.hoverToken.hook= Hooks.on('hoverToken',(token,hoverON)=>{
	
if (hoverON) {
	tokensVisible.hoverToken.hoveredTarget=token;
	//window.addEventListener('keydown', tokensVisible.pushTokenBackListener );
}
else {
  //  window.removeEventListener('keydown', tokensVisible.pushTokenBackListener );
	delete tokensVisible.hoverToken.hoveredTarget;
}
});

Hooks.on('ready',() => {
	
	window.addEventListener('keydown', tokensVisible.pushTokenBackListener );
});

Hooks.on('updateWall', (scene,wall,data,diff,userid) => {
	if(diff.diff){
		if (tokensVisible.SightCache!=undefined) tokensVisible.SightCache=new Map();
	}
	
});

Hooks.on('ready', () => {
	

	
game.settings.register('TokensVisible', 'pushhotkey', {
  name: game.i18n.localize("TOKENSVISIBLE.SelectHotKey"),
  hint: game.i18n.localize("TOKENSVISIBLE.SelectHotKeyHelp"),
  scope: 'client',   
  config: true,      
  type: String,     
  default: "z",
  
  onChange: value => { tokensVisible.pushhotkey = value // value is the new value of the setting
  }
});

game.settings.register('TokensVisible', 'toggleActiveFG', {
  name: game.i18n.localize("TOKENSVISIBLE.toggleActiveFG"),
  scope: 'world',   
  config: true,      
  type: String,     
  default: "",
	onChange: value => {  document.querySelectorAll('#controls .control-tool.toggle.active').forEach(e=>e.style.setProperty('color',value ));}
  }
);

game.settings.register('TokensVisible', 'toggleActiveBG', {
  name: game.i18n.localize("TOKENSVISIBLE.toggleActiveBG"),
  scope: 'world',   
  config: true,      
  type: String,     
  default: "",
  onChange: value => {
	   document.querySelectorAll('#controls .control-tool.toggle.active').forEach(e=>e.style.setProperty('background',value ));
	 }
  }
);




game.settings.register('TokensVisible', 'activeFG', {
  name: game.i18n.localize("TOKENSVISIBLE.activeFG"),
  scope: 'world',   
  config: true,      
  type: String,     
  default: "",
  onChange: value => {  document.querySelectorAll('#controls .control-tool.active:not(.toggle)').forEach(e=>e.style.setProperty('color',value ));
 }
  }
);


game.settings.register('TokensVisible', 'activeBG', {
  name: game.i18n.localize("TOKENSVISIBLE.activeBG"),
  scope: 'world',   
  config: true,      
  type: String,     
  default: "",
  
	onChange: value => { 
		  document.querySelectorAll('#controls .control-tool.active:not(.toggle)').forEach(e=>e.style.setProperty('background',value ));
		 }
  }
);


game.settings.register('TokensVisible', 'autopanningMargin', {
  name: game.i18n.localize("TOKENSVISIBLE.autopanningMargin"),
  hint: game.i18n.localize("TOKENSVISIBLE.autopanningMarginHint"),
  scope: 'client',   
  config: true,      
  type: Number,     
  default: "200",
  
  onChange: value => { tokensVisible.autopanMargin = value ;}
});



game.settings.register("TokensVisible", "hiddenCanLight", {
       name: game.i18n.localize("TOKENSVISIBLE.hiddenCanLight"),
       hint: game.i18n.localize("TOKENSVISIBLE.hiddenCanLightHint"),	
       scope: "world",
       config: true,
       type: String,
       choices: {
           "Yes": game.i18n.localize("TOKENSVISIBLE.hiddenCanLightYES"),
           "No": game.i18n.localize("TOKENSVISIBLE.hiddenCanLightNO"),
           
       },
       default: "Yes",
       onChange: value => { tokensVisible.hiddenCanLight = value  }
   });


   game.settings.register("TokensVisible", "wallsCancelAnimation", {
          name: game.i18n.localize("TOKENSVISIBLE.wallsCancelAnimation"),
          hint: game.i18n.localize("TOKENSVISIBLE.wallsCancelAnimationHint"),
	      scope: "world",
          config: true,
          type: String,
          choices: {
              "Yes": game.i18n.localize("TOKENSVISIBLE.wallsCancelAnimationYES") ,
              "No": game.i18n.localize("TOKENSVISIBLE.wallsCancelAnimationNO"),
			  "Always": game.i18n.localize("TOKENSVISIBLE.wallsCancelAnimationAlways")
           
          },
          default: "Yes",
          onChange: value => { tokensVisible.wallsCancelAnimation= value  }
      });


      game.settings.register("TokensVisible", "castRays", {
             name: game.i18n.localize("TOKENSVISIBLE.castRays"),
             hint: game.i18n.localize("TOKENSVISIBLE.castRaysHint"),
   	      scope: "client",
             config: true,
             type: String,
             choices: {
                 "Standard": game.i18n.localize("TOKENSVISIBLE.castRaysStandard") ,
                 "Enhanced": game.i18n.localize("TOKENSVISIBLE.castRaysEnhanced"),
   			  "Super": game.i18n.localize("TOKENSVISIBLE.castRaysSuper")
           
             },
             default: "Standard",
             onChange: value =>  {tokensVisible.setProperCastRays(value)} 
		          
             }
         );
		 
		 
		 game.settings.register('TokensVisible', 'castRayshotkey', {
		   name: game.i18n.localize("TOKENSVISIBLE.castRayshotkey"),
		   hint: game.i18n.localize("TOKENSVISIBLE.castRayshotkeyHint"),
		   scope: 'client',   
		   config: true,      
		   type: String,     
		   default: "e",
  
		   onChange: value => { tokensVisible.castRayshotkey = value }
		 });
		 
		 game.settings.register('TokensVisible', 'sightCache', {
		   name: game.i18n.localize("TOKENSVISIBLE.sightCache"),
		   hint: game.i18n.localize("TOKENSVISIBLE.sightCacheHint"),
		   scope: 'client',   
		   config: true,      
           type: String,
             choices: {
                 "On": game.i18n.localize("TOKENSVISIBLE.sightCacheOn") ,
                 "Off": game.i18n.localize("TOKENSVISIBLE.sightCacheOff")
             },
		 default: "On", 
  
		   onChange: value => { tokensVisible.setProperSightCache(value)}
		 });
		 
		
		 
		 game.settings.register('TokensVisible', 'sightCachehotkey', {
		   name: game.i18n.localize("TOKENSVISIBLE.sightCachehotkey"),
		   hint: game.i18n.localize("TOKENSVISIBLE.sightCachehotkeyHint"),
		   scope: 'client',   
		   config: true,      
		   type: String,     
		   default: "E",
  
		   onChange: value => { tokensVisible.sightCachehotkey  = value }
		 });
		 


tokensVisible.pushhotkey=game.settings.get('TokensVisible', 'pushhotkey');
tokensVisible.autopanMargin= game.settings.get('TokensVisible', 'autopanningMargin');
tokensVisible.hiddenCanLight = game.settings.get('TokensVisible', 'hiddenCanLight');

tokensVisible.wallsCancelAnimation = game.settings.get('TokensVisible', 'wallsCancelAnimation');
tokensVisible.castRayshotkey =game.settings.get('TokensVisible', 'castRayshotkey');
tokensVisible.sightCachehotkey =game.settings.get('TokensVisible', 'sightCachehotkey');



tokensVisible.setProperCastRays(game.settings.get('TokensVisible', 'castRays'));
tokensVisible.setProperSightCache(game.settings.get('TokensVisible', 'sightCache'));



});


tokensVisible.setProperCastRays = function(value){
switch (value){  
 case "Standard":tokensVisible._setStandardCastRays();
break; 
case "Enhanced": tokensVisible._setEnhancedCastRays();
break; 
case "Super": tokensVisible._setExtraEnhancedCastRays();
  break; 
default: 
	tokensVisible._setStandardCastRays();  
    value="Standard";
};
tokensVisible.currentCastRaysmode=value;


if (game.ready ) {
	ui.notifications.info( game.i18n.localize("TOKENSVISIBLE.castRays")+" : " + value );
      canvas.initializeSources();
    }

};


tokensVisible.setProperSightCache = function(value){
switch (value){  
 case "On": tokensVisible.enableTurboSight();
break; 
case "Off": tokensVisible.disableTurboSight(); 
break; 
default: 
	    tokensVisible.disableTurboSight();
        value="Off";
 
};
tokensVisible.currentSightCacheMode=value;


if (game.ready ) {
	ui.notifications.info( game.i18n.localize("TOKENSVISIBLE.sightCache")+" : " + game.i18n.localize("TOKENSVISIBLE.sightCache" + value) );
    }

};



Hooks.on('renderSceneControls', () => {
	
	

	  const toggleActiveBG =  game.settings.get('TokensVisible', 'toggleActiveBG');
	  if (toggleActiveBG) {
	     document.querySelectorAll('#controls .control-tool.toggle.active').forEach(e=>e.style.setProperty('background',toggleActiveBG ));
      }
	  
	  const toggleActiveFG =  game.settings.get('TokensVisible', 'toggleActiveFG');
	  if (toggleActiveFG) {
		  document.querySelectorAll('#controls .control-tool.toggle.active').forEach(e=>e.style.setProperty('color',toggleActiveFG ));
      }
	  
	  
	  const activeBG =  game.settings.get('TokensVisible', 'activeBG');
	  if (activeBG) {
		  document.querySelectorAll('#controls .control-tool.active:not(.toggle)').forEach(e=>e.style.setProperty('background',activeBG ));
      }
	  
	  const activeFG =  game.settings.get('TokensVisible', 'activeFG');
	  if (activeFG) {
		  document.querySelectorAll('#controls .control-tool.active:not(.toggle)').forEach(e=>e.style.setProperty('color',activeFG ));
      }
	  	  
});


// overrides of Token methods to implement the vision features of this module.

Object.defineProperty(Token.prototype,'isVisible', 
  {
  	get()  
  	{
      if (!canvas.sight.tokenVision) return true;
	  if (game.user.isGM ) return true;
	  if ( this._controlled ) return true;
	  const canObserve = this.actor && this.actor.hasPerm(game.user, "OBSERVER");
	  if (canObserve) return true;
	  if ( this.data.hidden ) return false; 
	
	
	 
	  const tolerance = Math.min(this.w, this.h) / 4;
      return canvas.sight.testVisibility(this.center, {tolerance, object: this});
	}
  });


Token.prototype._isVisionSource = function () {
	
    if ( !canvas.sight.tokenVision || !this.hasSight ) return false;
    if ( this._controlled ) return true;
 
    const isGM = game.user.isGM;
 
  
	if (!isGM) {

	// if a non-GM observer-user controls no tokens with sight return true
      const others = this.layer.controlled.find( t => !t.data.hidden && t.hasSightfunction);
      if (this.observer && (others == undefined)) return true;
    
	}
	
	return false;

};
  

Token.prototype.setPosition=  async function ReplaceTokenSetPosition(x, y, {animate=true}={}) {
 
    // Create a Ray for the requested movement
    let origin = this._movement ? this.position : this._validPosition,
        target = {x: x, y: y},
        isVisible = this.isVisible;

    // Create the movement ray
    let ray = new Ray(origin, target);
	let cancelAnimation = false;
	if(animate){
	  if (tokensVisible.wallsCancelAnimation=="Always") cancelAnimation=true;
	  if (!cancelAnimation)
       cancelAnimation = (tokensVisible.wallsCancelAnimation=="Yes" &&  this.checkCollision(target)); 
    }
     this._validPosition = target;
     this._velocity = this._updateVelocity(ray);

    // Update visibility for a non-controlled token which may have moved into the controlled tokens FOV
    this.visible = isVisible;

    // Conceal the HUD if it targets this Token
    if ( this.hasActiveHUD ) this.layer.hud.clear();
 

    if ( animate){
		if (cancelAnimation) {
	     	// client with animate turned on assumes an animated Movement will render the destination.
    		// since are setting the position directoy, so animate a 0 distance Movement at the destination
			// to satisfy that need.
	    	this.position.set(x, y);
		    // no 'await' needed here because this movement is not changing the position so we dont care if it completes
			// aynchronously
			this.animateMovement(new Ray(this.position, ray.B));
        } 
		else
		 await this.animateMovement(new Ray(this.position, ray.B));
    }
	else this.position.set(x, y);
	
    // If the movement took a controlled token off-screen, re-center the view
    if (this._controlled && isVisible) {

      const pad = tokensVisible.autopanMargin;
      let gp = this.getGlobalPosition();
      if ((gp.x < pad) || (gp.x > window.innerWidth - pad) || (gp.y < pad) || (gp.y > window.innerHeight - pad)) {
        canvas.animatePan(this.center);


      }
    }
    return this;
  }
  
  

Token.prototype.updateSource = function({defer=false, deleted=false, noUpdateFog=false}={}) {
    if ( CONFIG.debug.sight ) {
      SightLayer._performance = { start: performance.now(), tests: 0, rays: 0 }
    }

    // Prepare some common data
    const origin = this.getSightOrigin();
    const sourceId = this.sourceId;
    const d = canvas.dimensions;
    const maxR = Math.hypot(d.sceneWidth, d.sceneHeight);

    // Update light source
	const isLightSource = this.emitsLight && ((tokensVisible.hiddenCanLight=="Yes") || (!this.data.hidden));

    if ( isLightSource && !deleted ) {
      const bright = Math.min(this.getLightRadius(this.data.brightLight), maxR);
      const dim = Math.min(this.getLightRadius(this.data.dimLight), maxR);
      this.light.initialize({
        x: origin.x,
        y: origin.y,
        dim: dim,
        bright: bright,
        angle: this.data.lightAngle,
        rotation: this.data.rotation,
        color: this.data.lightColor,
        alpha: this.data.lightAlpha,
        animation: this.data.lightAnimation
      });
      canvas.lighting.sources.set(sourceId, this.light);
      if ( !defer ) {
        this.light.drawLight();
        this.light.drawColor();
      }
    }
    else {
      canvas.lighting.sources.delete(sourceId);
      if ( isLightSource && !defer ) canvas.lighting.refresh();
    }

    // Update vision source
    const isVisionSource = this._isVisionSource();
    if ( isVisionSource && !deleted ) {
      let dim =  canvas.lighting.globalLight ? maxR : Math.min(this.getLightRadius(this.data.dimSight), maxR);
      const bright = Math.min(this.getLightRadius(this.data.brightSight), maxR);
	  if ((dim === 0) && (bright === 0)) dim = Math.min(this.w, this.h) * 0.5;
      this.vision.initialize({
        x: origin.x,
        y: origin.y,
        dim: dim,
        bright: bright,
        angle: this.data.sightAngle,
        rotation: this.data.rotation
      });
      canvas.sight.sources.set(sourceId, this.vision);
      if ( !defer ) {
        this.vision.drawLight();
        canvas.sight.refresh({noUpdateFog});
      }
    }
    else {
      canvas.sight.sources.delete(sourceId);
      if ( isVisionSource && !defer ) canvas.sight.refresh();
    }
  }

  
tokensVisible.SightLayer = {_defaultcastRay:SightLayer._castRays, _defaultcomputeSight:SightLayer.computeSight};

tokensVisible.SightLayer._turboComputeSight = function (origin, radius, {angle=360, density=6, rotation=0, unrestricted=false}={}){

   
     let key =  radius*34.34 +origin.x+(origin.y*7.654)+ canvas.dimensions.width*1.1 + canvas.dimensions.height*3.3 + density*11+ (unrestricted?33:-1) +angle*1.1 + rotation  +(canvas.walls.endpoints.length * 12.2);  
     let sightResult = tokensVisible.SightCache.get(key);
     if(sightResult!=undefined) {
  	  		return sightResult;
  	 }
  
	
	sightResult = tokensVisible.SightLayer._defaultcomputeSight.call(this, origin, radius, {angle, density, rotation, unrestricted} );
	
	
    if(tokensVisible.SightCache.size>1000) tokensVisible.SightCache.delete(tokensVisible.SightCache.keys().next().value);
    tokensVisible.SightCache.set(key, sightResult);
	
    return sightResult;

};

tokensVisible.enableTurboSight = function() {
	tokensVisible.SightCache=new Map();
	SightLayer.computeSight=tokensVisible.SightLayer._turboComputeSight;
	 
	
}

tokensVisible.disableTurboSight = function() {
	delete tokensVisible.SightCache;
	SightLayer.computeSight=tokensVisible.SightLayer._defaultcomputeSight;
	
}


tokensVisible.SightLayer._DI_castRays=function(x, y, distance, {density=4, endpoints, limitAngle=false, aMin, aMax}={}, cast, standardArray, rayAccuracy, rays,sorter) {

   
    const rOffset = 0.02;

	

    // Enforce that all rays increase in angle from minimum towards maximum
    const rMin = limitAngle ? Ray.fromAngle(x, y, aMin, distance) : null;
    const rMax = limitAngle ? Ray.fromAngle(x, y, aMax, distance) : null;
   


	if(endpoints.length || standardArray.length) {
		const originaldensity = density;
		
		if(rayAccuracy<1.5)	density = density* (2/3) * rayAccuracy;  // density can never be worse than standard
		if(density<Math.min(2,originaldensity))density=Math.min(2,originaldensity);  // dont want to make the quality too good/expensive. Use Supermode for that.
		
     // First prioritize rays which are cast directly at wall endpoints
    for ( let e of endpoints ) {
      const ray = Ray.fromAngle(x, y, Math.atan2(e[1]-y, e[0]-x), distance);
      if ( limitAngle ) {
        ray.angle = this._adjustRayAngle(aMin, ray.angle);  // Standardize the angle
        if (!Number.between(ray.angle, aMin, aMax)) continue;
      }
      cast(ray);
    }



if (rayAccuracy<1.5) 
 {

  let varx = 0;
  for(varx=0;varx<standardArray.length;varx++){
     let currentAngle = standardArray[varx];
     if(!limitAngle || (currentAngle>=rMin && currentAngle<=rMax)){
             cast(Ray.fromAngle(x,y,currentAngle,distance),500);
     }
  }
}


    const nr = rays.length;
    for ( let i=0; i<nr; i++ ) {
      const r = rays[i];
//	  let newdistance = r.distance ;
//      let nOffset = (rOffset * 12000) / r.distance; 

//console.warn('noff',nOffset);
      cast(r.shiftAngle(rOffset),1000);
      cast(r.shiftAngle(-rOffset ),1000);

    }

    // Add additional limiting and central rays
    if ( limitAngle ) {
      const aCenter = aMin + ((aMax - aMin) / 2) + Math.PI;
      const rCenter = Ray.fromAngle(x, y, aCenter, 0);
      rCenter._isCenter = true;
      cast(rMin);
      cast(rCenter);
      cast(rMax);
    }
 
}

    function extraRays(density,tol=50){
    // Add additional approximate rays to reach a desired radial density
    if ( !!density ) {

	  const rDensity = toRadians(density);
        const nFill = Math.ceil((aMax - aMin) / rDensity);
 
      for ( let a of Array.fromRange(nFill) ) {
        cast(Ray.fromAngle(x, y, aMin + (a * rDensity), distance), tol);
      }
    }

    };


    extraRays(density);

    // Sort rays counter-clockwise (increasing radians)
    sorter(rays);
	//console.warn('rays',rays.length);
    return rays;
  };
  
  tokensVisible._setEnhancedCastRays=function()
  {
         
          const standardArray = [-3.141592, -1.5707964,0,1.5707964];

    // Track rays and unique emission angles

	
	      const sorter = (rays)=>{rays.sort((r1, r2) => r1.angle - r2.angle);};
	  //     RayCache=new Map();
		   if (tokensVisible.SightCache!=undefined) tokensVisible.SightCache=new Map();
	       SightLayer._castRays=function(x, y, distance, {density=4, endpoints, limitAngle=false, aMin, aMax}={}) {
		 
		
	      // const key =  x.toString(16)+y.toString(16)+distance.toString(16)+limitAngle.toString()+aMin.toString()+aMax.toString();
		  // we need a fast hash... if there is a collision (which is extremely unlikely), its even more unlikely that it will matter
		  // because the placeable that is rendered incorrectly will probably be on separate places of the map
	   //    const key =  x+(y*7.654)+distance+(limitAngle?1:0)+aMin+aMax;  
	//	   let rays = RayCache.get(key);
	let rays;
	//	   if(rays!=undefined) {
	//           // cache hit!
	//		   return rays;
	//	   }
		   
		   
		   const rayAccuracy = canvas.sight.tokenVision?(canvas.scene._viewPosition.scale):5;
	       const angles = new Set();
	       rays = [];
		  
		   
		   const cast = (ray, tol=50) => {
   
	            tol = tol *50 /(rayAccuracy * 10);
	            let a = Math.round(ray.angle *tol  );// / tol;
	            if ( angles.has(a) ) return;
	            rays.push(ray);
	            angles.add(a);
	          };

		   rays =tokensVisible.SightLayer._DI_castRays.call(this, x,y,distance,{density,endpoints,limitAngle,aMin,aMax},cast,standardArray, rayAccuracy, rays, sorter );
	  //     if(RayCache.size>1000) RayCache.delete(RayCache.keys().next().value);
	       
	  //	   RayCache.set(key,rays);
		   return rays;
		   
	   } 
	   
	   
  }
  
  tokensVisible._setExtraEnhancedCastRays=function()
  {
	  
       const stubsorter = (rays)=>{ /* nothing to do because the rays are cast in sorted order in this mode */ };
       const realsorter = (rays)=>{rays.sort((r1, r2) => r1.angle - r2.angle);};
	//   RayCache=new Map();
	   if (tokensVisible.SightCache!=undefined) tokensVisible.SightCache=new Map();
	  					    
	   SightLayer._castRays=function(x, y, distance, {density, endpoints, limitAngle=false, aMin, aMax}={}){
		 
		   if (!canvas.sight.tokenVision) return tokensVisible.SightLayer._defaultcastRay.call(this,x,y,distance,{density:density+3,endpoints,limitAngle,aMin,aMax});
	
	//	const key =  x+(y*7.654)+distance+(limitAngle?1:0)+aMin+aMax;  
	let rays;
	//	   let rays = RayCache.get(key);
	//	   if(rays!=undefined) {
	//		   return rays;
	//	   }

		   let sorter;
		   rays=[];
		   const cast = (ray )=> rays.push(ray);
		   const rayAccuracy = canvas.scene._viewPosition.scale;
           if (!limitAngle){
           // endpoints and sorting are not needed for unlimited angle light or vision since we are casting rays in all directions anyway.
		 	   endpoints=[]; 
			   sorter=stubsorter;
		   }
		   else {
           // endpoints and real sorting appear to be needed for limited angle light or vision to render correctly
		   	   sorter=realsorter;
		   }
		   rays = tokensVisible.SightLayer._DI_castRays.call(this,x,y,distance,{"density":Math.min(1.0,density),endpoints,limitAngle,aMin,aMax},cast,[],rayAccuracy,rays, sorter);
	  //     if(RayCache.size>1000) RayCache.delete(RayCache.keys().next().value);
	       
	  //	   RayCache.set(key,rays);
		   return rays;
	   } 
	   
	    
  };
  
tokensVisible._setStandardCastRays=function()
  {
	   if (tokensVisible.SightCache!=undefined) tokensVisible.SightCache=new Map();
       SightLayer._castRays=tokensVisible.SightLayer._defaultcastRay;
	  
	   	   
  };
  



	  
