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
    console.warn('TokensVisible - invalid target', tokensVisible.hoverToken.hoveredTarget);
  } 

};


tokensVisible.pushTokenBackListener = function(event){
    if ( event.isComposing ) return; 
  
   if (event.key==tokensVisible.pushhotkey && !event.repeat) tokensVisible.pushToBack();

};
 

tokensVisible.hoverToken.hook= Hooks.on('hoverToken',(token,hoverON)=>{
	
if (hoverON) {
	tokensVisible.hoverToken.hoveredTarget=token;
	window.addEventListener('keydown', tokensVisible.pushTokenBackListener );
}
else {
    window.removeEventListener('keydown', tokensVisible.pushTokenBackListener );
	delete tokensVisible.hoverToken.hoveredTarget;
}
});


Hooks.on('init', () => {

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
  
  onChange: value => { tokensVisible.autopanMargin = value // value is the new value of the setting
  }
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



tokensVisible.pushhotkey=game.settings.get('TokensVisible', 'pushhotkey');
tokensVisible.autopanMargin= game.settings.get('TokensVisible', 'autopanningMargin');
tokensVisible.hiddenCanLight = game.settings.get('TokensVisible', 'hiddenCanLight');

tokensVisible.wallsCancelAnimation = game.settings.get('TokensVisible', 'wallsCancelAnimation');


});

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


