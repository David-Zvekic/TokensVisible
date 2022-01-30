// TokensVisible.js
// (c) 2021 David Zvekic
// permission granted to use and distribute as per LICENSE file

"use strict";

import {moduleName, MODULE_ID ,registerSettings, tokensVisible} from './settings/settings.js';
import {libWrapper} from './libwrapper/shim.js'

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
  }; 
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
  }
  else {
    delete tokensVisible.hoverToken.hoveredTarget;
  }
});

tokensVisible.hoverToken.hook= Hooks.on('controlToken',(token,controlled)=>{
	
  if (controlled) {
    tokensVisible.lastControlledToken=token;
  }
 
});




Hooks.on('canvasReady',()=>{ 
  if (tokensVisible.SightCache!=undefined) tokensVisible.SightCache=new Map();
} );

Hooks.once('canvasReady', () => {
		 
  	 tokensVisible.setProperCastRays(game.settings.get('TokensVisible', 'castRays'));
     tokensVisible.setProperSightCache(game.settings.get('TokensVisible', 'sightCache'));

});


tokensVisible.canvasInitializeSources= function() {
   if(canvas.perception?.initialize!=undefined)
       canvas.perception.initialize();   // Foundry VTT 0.8.6
   else
       canvas.initializeSources();     // Foundry 0.7.9
};
	


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
     tokensVisible.canvasInitializeSources();
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


function nameToHexA(name) {
    return RGBToHexA(nameToRGB(name));
}

function nameToRGB(name) {
  if (!name) return '';
  // Create fake div
  let fakeDiv = document.createElement("div");
  fakeDiv.style.color = name;
  document.body.appendChild(fakeDiv);

  // Get color of div
  let cs = window.getComputedStyle(fakeDiv),
      pv = cs.getPropertyValue("color");

  // Remove div after obtaining desired color value
  document.body.removeChild(fakeDiv);

  return pv;
}

function RGBToHexA(rgb) {
    if (rgb.startsWith('rgba')) return RGBAToHexA(rgb);
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b+'ff';
}


function RGBAToHexA(rgba) {
    
  let sep = rgba.indexOf(",") > -1 ? "," : " "; 
  rgba = rgba.substr(5).split(")")[0].split(sep);
                
  // Strip the slash if using space-separated syntax
  if (rgba.indexOf("/") > -1)
    rgba.splice(3,1);

  for (let R in rgba) {
    let r = rgba[R];
    if (r.toString().indexOf("%") > -1) {
      let p = r.substr(0,r.length - 1) / 100;

      if (R < 3) {
        rgba[R] = Math.round(p * 255);
      } else {
        rgba[R] = p;
      }
    }
  }
  
  let r = (+rgba[0]).toString(16),
      g = (+rgba[1]).toString(16),
      b = (+rgba[2]).toString(16),
      a = Math.round(+rgba[3] * 255).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;
  if (a.length == 1)
    a = "0" + a;

  return "#" + r + g + b + a;
  
}
tokensVisible.defaultcolors= new Map();

tokensVisible.setupRenderColors = function() 
{
    
  if (tokensVisible.defaultcolors['toggleActiveFG']== undefined ) tokensVisible.defaultcolors['toggleActiveFG']  = $('li.control-tool.active.toggle').css('color'); 
  if (tokensVisible.defaultcolors['toggleActiveBG']== undefined ) tokensVisible.defaultcolors['toggleActiveBG']  = $('li.control-tool.active.toggle').css('background-color');
  if (tokensVisible.defaultcolors['activeFG']== undefined ) tokensVisible.defaultcolors['activeFG']  = $('li.control-tool.active:not(.toggle)').css('color');
  if (tokensVisible.defaultcolors['activeBG']== undefined ) tokensVisible.defaultcolors['activeBG']  = $('li.control-tool.active:not(.toggle)').css('background-color');
    
  setColor( 'toggleActiveFG', '#controls .control-tool.toggle.active', 'color' );
  setColor(  'toggleActiveBG','#controls .control-tool.toggle.active', 'background-color' );
  setColor(  'activeFG','#controls .control-tool.active:not(.toggle)', 'color' );
  setColor(  'activeBG', '#controls .control-tool.active:not(.toggle)', 'background-color' );


  function setColor( settingName, jQuerySpec, cssProperty){
  
  const colorValue=game.settings.get('TokensVisible', settingName);
  if ( colorValue && !(nameToHexA(colorValue).endsWith('00')) ) {
           document.querySelectorAll(jQuerySpec).forEach(e=>e.style.setProperty(cssProperty,colorValue));
          } else
           document.querySelectorAll(jQuerySpec).forEach(e=>e.style.setProperty(cssProperty,tokensVisible.defaultcolors[settingName]  ));
  } 
 

};
  
Hooks.on('renderSceneControls', tokensVisible.setupRenderColors );


Hooks.once('ready',() => {
     window.addEventListener('keydown', tokensVisible.pushTokenBackListener );
    //deferred to ready - if this is wrapped in 'init'  then perfect-vision will get an error trying to redefine Token.prototype.updateSource
  
    
    function lightwrapper (wrapped, ...args) {
  
      
         if (this.data.hidden && this.emitsLight && game.settings.get('TokensVisible', 'hiddenCanLight')=="Yes") {   
           this.data.hidden=false;
           const wrappedresult = wrapped(...args);
           this.data.hidden=true;
           return wrappedresult;
         } else
         {
             return wrapped(...args); 
         }  
      };  
     
    libWrapper.register(moduleName,'Token.prototype.updateSource', lightwrapper,'WRAPPER');     
      
    if(Token.prototype.updateLightSource!=undefined){
        libWrapper.register(moduleName,'Token.prototype.updateLightSource', lightwrapper,'WRAPPER');
        tokensVisible.canvasInitializeSources();
         
    };
    
   
    
});

function tokenHasSight (tokenInQuestion){
    if (tokenInQuestion.data.hidden && game.settings.get('TokensVisible', 'hiddenCanSee')=='No') return false; 
    return tokenInQuestion.hasSight;
} 


    
Hooks.once('setup', ()=>{
      console.warn('TokensVisible | Registering Settings');
      registerSettings();
      tokensVisible.panMode = game.settings.get('TokensVisible', 'panMode');
      tokensVisible.pushhotkey=game.settings.get('TokensVisible', 'pushhotkey');
      tokensVisible.autopanMargin= game.settings.get('TokensVisible', 'autopanningMargin');
      tokensVisible.wallsCancelAnimation = game.settings.get('TokensVisible', 'wallsCancelAnimation');
      tokensVisible.castRayshotkey =game.settings.get('TokensVisible', 'castRayshotkey');
      tokensVisible.sightCachehotkey =game.settings.get('TokensVisible', 'sightCachehotkey');
      tokensVisible.setupCombatantMasking(game.settings.get('TokensVisible', 'combatantHidden'));
});

Hooks.once('init', () => {
   
	console.warn('TokensVisible | Initializing');
  
    
    libWrapper.register(moduleName,'TokenLayer.prototype._getCycleOrder',
    function(wrapped,...args){
 
        let observable = wrapped(...args);
        if (game.settings.get('TokensVisible', 'blindTokensControllable')=='No') {
          observable = observable.filter( t => {return tokenHasSight(t) })
        }
        return observable;
    }, 'WRAPPER'); 
    
    
   libWrapper.register(moduleName,'Token.prototype.control', 
    function(wrapped, ...args )  { 
   
        if (!game.user.isGM && canvas.sight.tokenVision && !this.hasSight && (game.settings.get('TokensVisible', 'blindTokensControllable')=='No')) {
        
            this._controlled = true;
            // calling the wrapped function will cause clicking a blind owned token to be act like clicking on an unowned token.
            wrapped(...args); 
            this._controlled = false;
            return this._controlled;
         }
        return wrapped(...args);  
        
    }, 'WRAPPER');

   libWrapper.register(moduleName,'CanvasAnimation.animateLinear', 
    function(wrapped, attributes, {context, name, duration, ontick} )  { 
        const tokenAnimationSpeed=game.settings.get('TokensVisible', 'tokenAnimationSpeed') / 10.0; 
        
        if ((tokenAnimationSpeed!=1 || tokensVisible.cancelTokenAnimation) &&  name != undefined){
            if ((name.substring(0,6)=="Token.") && (name.substring(name.length -16) == ".animateMovement"))  { 
                if (tokensVisible.cancelTokenAnimation) duration=0; 
                else
                duration = duration / tokenAnimationSpeed ;
             }
        };
        return wrapped(attributes,{context,name,duration,ontick});
        
    }, 'WRAPPER');
    
    

libWrapper.register(moduleName,'Token.prototype._onUpdate',
    function(wrapped, data, options, userId ) {
      // reset the SightCalculation cache if a token changes elevation.
      // this means nothing for the base system, but some modules change rendering based on tokens changing elevation.
      // triggering this rest in a Hooks.on('UpdateToken') triggers too late.        
      
       if (tokensVisible.SightCache!=undefined) {
         const keys = Object.keys(data);
         const changed = new Set(keys);
         if ( changed.has("elevation") ) tokensVisible.SightCache=new Map();
       }
       wrapped(data,options,userId);   
    }
    , 'WRAPPER');  
    


libWrapper.register(moduleName,'Wall.prototype._onUpdate',
    function(wrapped, data, ...args ) {
      // reset the SightCalculation cache if a token changes elevation.
      // this means nothing for the base system, but some modules change rendering based on tokens changing elevation.
      // triggering this rest in a Hooks.on('UpdateToken') triggers too late.        
      
       if (tokensVisible.SightCache!=undefined) {
           tokensVisible.SightCache=new Map();
       }
       wrapped(data,...args);   
    }
    , 'WRAPPER');  
    
    
 
    
   libWrapper.register(moduleName,'Token.prototype.isVisible', 
    function(wrapped)  { 
         const blindTokensControllable = (game.settings.get('TokensVisible', 'blindTokensControllable') == 'Yes');
         if (!game.user.isGM && this._controlled && !tokenHasSight(this) && !blindTokensControllable) this.release();
     
         if (wrapped()) return true;
   
         if ( this._controlled ) return true;
         if(!game.user.isGM ){
           if(this.actor) {
             let canObserve = false;
             if (Actor.prototype.testUserPermission!=undefined) {  
                canObserve = this.actor?.testUserPermission(game.user, "OBSERVER");
             } else {
                canObserve = this.actor?.hasPerm(game.user, "OBSERVER"); 
             }
            
            if (canObserve && (blindTokensControllable || !canvas.sight.tokenVision || this._isVisionSource()    )) return true;
          }
        }
        return false; 
    
      
 
    }, 'MIXED');
    
   libWrapper.register(moduleName,'Token.prototype._isVisionSource', 
    function (wrapped) {
      
        const tokenMultiVision = game.settings.get('TokensVisible', 'tokenMultiVision');
        const computerSaysYes = wrapped(); // always chain wrapper even if we may never use the result - on the chance another module needs it's version executed
        
        if (tokenMultiVision=='Limited' && game.settings.get('TokensVisible', 'hiddenCanSee')=='No' ) return computerSaysYes ;
     
        if  (computerSaysYes && 
             (tokenMultiVision=='Yes' || this.data._id == tokensVisible.lastControlledToken?.data._id || !canvas.sight.tokenVision)
            ) return true;    
        
        
       if ( !canvas.sight.tokenVision || !this.hasSight ) return false; // deliberately ignore hidden status on this line
     
       if (game.user.isGM) {
            if ( this._controlled ) return true;  
       }
       else {
           if (!tokenHasSight(this)) return false;
           switch(tokenMultiVision) {
            case 'Yes':
              if ( this.observer ) return true;
            case 'Limited' :        
              if ( this._controlled ) return true;      
              // if a non-GM observer-user controls no tokens with sight then show vision 
              // from all observer tokens. This acts like temporary multitoken vision.
              const others = this.layer.controlled.find( t => tokenHasSight(t));
              if (this.observer && (others == undefined)) return true;
              break; 
          case 'Never' :
              if (this.data._id == tokensVisible.lastControlledToken?.data._id) return true;  
          }
          
       }
    
       return false;

     }
    , 'MIXED');
    

     


    function isSuperset(set, subset) {
        for (let elem of subset) {
            if (!set.has(elem)) {
                return false
            }
        }
        return true
    }
    
    
    function isAlt(){
       // check if Alt and only Alt is being pressed during the drop event.

        let downKeys;
        let alt;
  
        if (typeof game.keyboard.downKeys !== 'undefined') {
          // FoundyVTT v9+ compatible  
          downKeys = game.keyboard.downKeys;
          alt = new Set(['AltLeft']);
        } else {
          // FoundryVTT v7, v8 compatible  
          downKeys = game.keyboard._downKeys;
          alt = new Set(['Alt']);
        }

       return (isSuperset(alt,downKeys) && isSuperset(downKeys,alt));
    }

    if (!(typeof ClientDatabaseBackend==="undefined")) {

       libWrapper.register(moduleName,'ClientDatabaseBackend.prototype._updateEmbeddedDocuments',
        async function(wrapped, documentClass, parent, {updates, options, pack}, user) {
      
           if (documentClass.name=="TokenDocument") {
               if (isAlt()) options.YTVcancelAnimate=true;
               else options.YTVcancelAnimate=false;
           }
           return wrapped( documentClass, parent, {updates, options, pack}, user);   
        }
        , 'WRAPPER'); 


        
        
    } else {

      libWrapper.register(moduleName,'Entity.prototype.updateEmbeddedEntity',
        async function(wrapped, embeddedName, data, options={}) {
     
           if (embeddedName=="Token") {
              if (isAlt()) options.YTVcancelAnimate=true;
              else options.YTVcancelAnimate=false;
           }
           return wrapped( embeddedName, data, options);   
        }
      , 'WRAPPER');  
  };
    


 libWrapper.register(moduleName,'Token.prototype.setPosition',   
    async function (x, y, {animate=true,YTVcancelAnimate=false}={}) {
        
    // Create a Ray for the requested movement
    let origin = this._movement ? this.position : this._validPosition,
        target = {x: x, y: y},
        isVisible = this.isVisible;

    // Create the movement ray
    let ray = new Ray(origin, target);
    let cancelAnimation = false;
    
    
    if(animate){
      if ((YTVcancelAnimate) ||  (tokensVisible.wallsCancelAnimation=="Always") ) cancelAnimation=true;    
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
  
        // tokensVisible.cancelTokenAnimation causes CanvasAnimation.animateLinear (for tokens) to have a 0 duration (instant) by setting an out-of-band flag.  
        // setPosition previously used Token.position.set() to 0-duration the animation, but Drag Ruler (and maybe other modules) depend on the animation
        // duration without calling setPosition. They call Token.animateMovement directly (and thus CanvasAnimation.animateLinear).  
        // tokensVisible.cancelTokenAnimation variable communicates with CanvasAnimation.animateLinear out-of-band (as it is wrapped by TokensVisible)
        // and ensures any token animation that is triggered asynchronously prior to Foundry calling setPosition in the code is also set to 0 duration (instant) if setPosition would do so.
                
        tokensVisible.cancelTokenAnimation=cancelAnimation; 
   
        await this.animateMovement(new Ray(this.position, ray.B));
        tokensVisible.cancelTokenAnimation=false;  // let future token animations run at regular speed
         
       
    }
    else this.position.set(x, y);
    
   
    // If the movement took a controlled token off-screen, adjust the view
    if (this._controlled && isVisible) {

      const pad = tokensVisible.autopanMargin;
     
      
      
      if (tokensVisible.panMode=="Recenter") {
         let gp = this.getGlobalPosition();
         if ((gp.x < pad) || (gp.x > window.innerWidth - pad) || (gp.y < pad) || (gp.y > window.innerHeight - pad)) {
             canvas.animatePan(this.center);
         } 
      } else {
          
          async function relativePan({dx,dy}){
              canvas.animatePan({x:canvas.scene._viewPosition.x+dx, y: canvas.scene._viewPosition.y+dy})
          };
          
          
          let bounds = this.getBounds();
          let dx = 0;
          let dy = 0;

          if ( bounds.x < pad ) {
              dx = bounds.x- pad;
          } else
          if ( ( bounds.x+bounds.width ) > ( window.innerWidth - pad ) ) {
              dx = ( bounds.x + bounds.width ) - ( window.innerWidth - pad );
          };
    
          if ( bounds.y < pad ){
              dy = bounds.y - pad;
          } else
          if ( ( bounds.y + bounds.height) > ( window.innerHeight - pad ) ) {
               dy =  (bounds.y + bounds.height) - ( window.innerHeight - pad );
          } ;
          
          if  (dx || dy){
              relativePan({dx,dy});
          }
      }
    }
    return this;
}, 'OVERRIDE');

}
);


 // the conditional assignment is for legacy 0.7.x support
tokensVisible.SightLayer = {_defaultcastRays : ((WallsLayer.castRays!=undefined) ? WallsLayer.castRays : SightLayer._castRays), 
                            _defaultcomputeSight : ((WallsLayer.prototype.computePolygon !=undefined) ? WallsLayer.prototype.computePolygon:SightLayer.computeSight)
                           };
 // the conditional assignment is for legacy 0.7.x support                         
tokensVisible.Combat = {_defaultcreateEmbeddedEntity:  (Combat.prototype.createEmbeddedDocuments!=undefined)?(Combat.prototype.createEmbeddedDocuments):(Combat.prototype.createEmbeddedEntity)};


tokensVisible.SightLayer._turboComputeSight = function(wrapped, origin, radius, { type, angle = 360, density = 6, rotation = 0,  unrestricted = false } = {}) {
    if (type == undefined || (type != undefined && type == "sight")) {

        // this key is generated roughly using a cheap and fast hash function of combining some values relevant to the calculation.  Better hash functions will be slower than this with extremely rare benefits.
        let key = radius * 34.34 + origin.x + (origin.y * 7.654) + canvas.dimensions.width * 1.1 + canvas.dimensions.height * 3.3 + density * 11 + (unrestricted ? 33 : -1) + angle * 1.1 + rotation + (canvas.walls.endpoints.length * 12.2);
        let sightResult = tokensVisible.SightCache.get(key);
        if (sightResult != undefined) {
            return sightResult;
        }

        sightResult = wrapped(origin, radius, { type,  angle, density, rotation, unrestricted  });

        if (tokensVisible.SightCache.size > 1000) 
            tokensVisible.SightCache.delete(tokensVisible.SightCache.keys().next().value);

        tokensVisible.SightCache.set(key, sightResult);
        return sightResult;

    } else {
        return wrapped(origin, radius, { type, angle, density, rotation,unrestricted });
    }

};


tokensVisible.enableTurboSight = function() {
    tokensVisible.SightCache = new Map();

    if (WallsLayer.prototype.computePolygon != undefined)
        patch('WallsLayer.prototype.computePolygon', tokensVisible.SightLayer._turboComputeSight, 'MIXED');
    else
        patch('SightLayer.computeSight', tokensVisible.SightLayer._turboComputeSight, 'MIXED'); // legacy 0.7.x support

};

tokensVisible.disableTurboSight = function() {
    delete tokensVisible.SightCache;
    
    if(WallsLayer.prototype.computePolygon !=undefined) {
       unpatch('WallsLayer.prototype.computePolygon', tokensVisible.SightLayer._defaultcomputeSight);
    } 
    else {
     // legacy 0.7.x support
        unpatch('SightLayer.computeSight', tokensVisible.SightLayer._defaultcomputeSight);
    }
    
    
};


tokensVisible.SightLayer._DI_castRays=function(x, y, distance, {density=4, endpoints, limitAngle=false, aMin, aMax}={}, cast, standardArray, rayAccuracy, rays,sorter) {
   
    const rOffset = 0.02;

    // Enforce that all rays increase in angle from minimum towards maximum
    const rMin = limitAngle ? Ray.fromAngle(x, y, aMin, distance) : null;
    const rMax = limitAngle ? Ray.fromAngle(x, y, aMax, distance) : null;
   

    if(endpoints.length || standardArray.length) {
      const originaldensity = density;
        
      if(rayAccuracy<1.5)   density = density* (2/3) * rayAccuracy;  // density can never be worse than standard
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

      if (rayAccuracy<1.5) {
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

        const rDensity = Math.toRadians(density);
        const nFill = Math.ceil((aMax - aMin) / rDensity);
 
        for ( let a of Array.fromRange(nFill) ) {
          cast(Ray.fromAngle(x, y, aMin + (a * rDensity), distance), tol);
        }
      }
    };


    extraRays(density);

    // Sort rays counter-clockwise (increasing radians)
    // sorter is defined here via dependancy injection. 
    sorter(rays);
    return rays;
};
  
tokensVisible._setEnhancedCastRays = function() {

    const standardArray = [-3.141592, -1.5707964, 0, 1.5707964];

    // Track rays and unique emission angles
    const sorter = (rays) => {
        rays.sort((r1, r2) => r1.angle - r2.angle);
    };
    if (tokensVisible.SightCache != undefined) tokensVisible.SightCache = new Map();
       
    if (WallsLayer.castRays != undefined) 
        patch('WallsLayer.castRays', enhancedCastRays, 'OVERRIDE');
    else 
        patch('SightLayer._castRays', enhancedCastRays, 'OVERRIDE'); // legacy 0.7.x support
   
    function enhancedCastRays (x, y, distance, { density = 4, endpoints,limitAngle = false, aMin,aMax } = {}) {

        let rays = [];
        const rayAccuracy = canvas.sight.tokenVision ? (canvas.scene._viewPosition.scale) : 5;
        const angles = new Set();
        const cast = (ray, tol = 50) => {
            tol = tol * 50 / (rayAccuracy * 10);
            let a = Math.round(ray.angle * tol); 
            if (angles.has(a)) return;
            rays.push(ray);
            angles.add(a);
        };

        rays = tokensVisible.SightLayer._DI_castRays.call(this, x, y, distance, {
            density,
            endpoints,
            limitAngle,
            aMin,
            aMax
        }, cast, standardArray, rayAccuracy, rays, sorter);
        return rays;
    }; 
};

  
tokensVisible._setExtraEnhancedCastRays = function() {

    const stubsorter = (rays) => { /* nothing to do because the rays are cast in sorted order in this mode */ };
    const realsorter = (rays) => {
        rays.sort((r1, r2) => r1.angle - r2.angle);
    };
    if (tokensVisible.SightCache != undefined) tokensVisible.SightCache = new Map();

    if (WallsLayer.castRays != undefined) {
        patch('WallsLayer.castRays', superCastRays, 'MIXED'); 
    } else {
        patch('SightLayer._castRays', superCastRays, 'MIXED'); // legacy 0.7.x support
    }
    
    function superCastRays (wrapped, x, y, distance, { density, endpoints, limitAngle = false, aMin, aMax  } = {}) {

        if (!canvas.sight.tokenVision) return wrapped(x, y, distance, { density: density + 3, endpoints, limitAngle, aMin, aMax });

        let rays = [];

        let sorter;
        const cast = (ray) => rays.push(ray);
        const rayAccuracy = canvas.scene._viewPosition.scale;

        if (!limitAngle) {
            // endpoints and sorting are not needed for unlimited angle light or vision since we are casting rays in all directions anyway.
            endpoints = [];
            sorter = stubsorter;
        } else {
            // endpoints and real sorting needed for limited angle to render correctly
            sorter = realsorter;
        }
        density = rayAccuracy;

        rays = tokensVisible.SightLayer._DI_castRays.call(this, x, y, distance, { "density": Math.min(2.0, density), endpoints, limitAngle, aMin, aMax }, cast, [], rayAccuracy, rays, sorter);
        return rays;
    };

};

  
tokensVisible._setStandardCastRays = function() {
    
    if (tokensVisible.SightCache != undefined) tokensVisible.SightCache = new Map();
    if (WallsLayer.castRays != undefined) {
        unpatch('WallsLayer.castRays', tokensVisible.SightLayer._defaultcastRays);
    } else {
        // legacy 0.7.x support
        unpatch('SightLayer._castRays', tokensVisible.SightLayer._defaultcastRays);

    }
};



  
  
tokensVisible.setupCombatantMasking = function(settingValue) {

    switch (settingValue) {
        case "hostile":
        case "neutral":
        case "all":
            if (Combat.prototype.createEmbeddedDocuments != undefined)
                patch('Combat.prototype.createEmbeddedDocuments', combatMaskedEntities, 'WRAPPER');
            else
                patch('Combat.prototype.createEmbeddedEntity', combatMaskedEntities, 'WRAPPER'); // legacy 0.7.x support
            break;
        default:
            if (Combat.prototype.createEmbeddedDocuments != undefined)
                unpatch('Combat.prototype.createEmbeddedDocuments', tokensVisible.Combat._defaultcreateEmbeddedEntity);
            else
                unpatch('Combat.prototype.createEmbeddedEntity', tokensVisible.Combat._defaultcreateEmbeddedEntity); // legacy 0.7.x support
    }
    
    async function combatMaskedEntities(wrapped, embeddedName, data, options) {
        if (embeddedName == 'Combatant') {

            // combatants created via the token HUD are always in an array - otherwise NOT. We only want to 
            // look at the token disposition when the combatant is created directly from the Token therefore
            // do nothing if the data isn't an array. 
            if (Array.isArray(data))
                data.forEach((i) => {
                    let TOKEN = canvas.scene.data.tokens.find((k) => ((k._id!=undefined)?k._id:k.id) == i.tokenId);

                    // break statements deliberately missing 
                    const disposition = (TOKEN.disposition != undefined) ? (TOKEN.disposition) : (TOKEN.data.disposition);

                    switch (disposition) {
                        case -1:
                            if (settingValue == "hostile") i.hidden = true;
                        case 0:
                            if (settingValue == "neutral") i.hidden = true;
                        case 1:
                            if (settingValue == "all") i.hidden = true;
                    }

                });
        }
        return wrapped(embeddedName, data, options);
    };
}

function patch(libraryID, replacementfunction, mode) {
    if (!libWrapper.is_fallback) libWrapper.unregister(moduleName, libraryID, false);
    libWrapper.register(moduleName, libraryID, replacementfunction, mode);
}


function unpatch(libraryID, originalfunction) {
    if (libWrapper.is_fallback) libWrapper.register(moduleName, libraryID, originalfunction, 'OVERRIDE');
    else
        libWrapper.unregister(moduleName, libraryID, false);
}

      
