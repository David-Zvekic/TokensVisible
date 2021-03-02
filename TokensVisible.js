// pushTokenBack
// (c) 2021 David Zvekic
// permission granted to use and distribute as per LICENSE file


let pushTokenBack = new Object();
pushTokenBack.hoverToken= new Object();
pushTokenBack.hoverToken.hoveredTarget=0;
pushTokenBack.hotkey='';




Hooks.on('init', () => {

game.settings.register('pushTokenBack', 'hotkey', {
  name: game.i18n.localize("PUSHTOKENBACK.SelectHotKey"),
  hint: game.i18n.localize("PUSHTOKENBACK.SelectHotKeyHelp"),
  scope: 'client',   
  config: true,      
  type: String,     
  default: "Z",
  
  onChange: value => { pushTokenBack.hotkey = value // value is the new value of the setting
    console.log(value)
  }
});

pushTokenBack.hotkey=game.settings.get('pushTokenBack', 'hotkey');


});






pushTokenBack.pushTokenBackListener = function(event){
    if ( event.isComposing ) return; 
  
   if (event.key==pushTokenBack.hotkey && !event.repeat) pushToBack();

};

 

pushTokenBack.hoverToken.hook= Hooks.on('hoverToken',(token,hoverON)=>{
	
if (hoverON) {
	pushTokenBack.hoverToken.hoveredTarget=token;
	window.addEventListener('keydown', pushTokenBack.pushTokenBackListener );
}
else {
    window.removeEventListener('keydown', pushTokenBack.pushTokenBackListener );
	delete pushTokenBack.hoverToken.hoveredTarget;
}
});


function pushToBack()
{ if (typeof pushTokenBack == "undefined") {
    console.warn("Module pushTokenBack is not installed.");
    return;
  }

  if ( pushTokenBack?.hoverToken?.hoveredTarget instanceof Token) { 
    const token = pushTokenBack.hoverToken.hoveredTarget; 
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
    console.warn('pushtoback - invalid target', pushTokenBack.hoverToken.hoveredTarget);
  } 

};

// override some bugs in Foundry VTT Token class that cause players to be unable to see their own tokens if the visibility is turned off
// this is supposed to make the token invisible to others, not to make the player blind and lose control of their own token.
// the way to make someone blind is to remvoe vision. the way to make them lose control of their own token is to remove their permision to control that actor




Object.defineProperty(Token.prototype,'isVisible', {get() 
	{
	
	  const gm = game.user.isGM;
   	//DZ
	  if (gm ) return true;
	 if ( this._controlled ) return true;
	 const canObserve = this.actor && this.actor.hasPerm(game.user, "OBSERVER");
	 if (canObserve) return true;
	  //DZ
	
	  if ( this.data.hidden ) return false; // return gm
	
	  if (!canvas.sight.tokenVision) return true;
	 // if ( this._controlled ) return true;
	  const tolerance = Math.min(this.w, this.h) / 4;
	  return canvas.sight.testVisibility(this.center, {tolerance, object: this});
	}
});


 
function ReplaceIsVisionSource() {
	
    if ( !canvas.sight.tokenVision || !this.hasSight ) return false;
    if ( this._controlled ) return true;
 
    const isGM = game.user.isGM;
 
  
//DZ
	if (!isGM) {
    // Always display controlled tokens which have vision
  
	  
	
	// if a non-GM observor user user controls no tokens with sight return true
//    const others = this.layer.controlled.filter(t => !t.data.hidden && t.hasSightfunction );
    const others = this.layer.controlled.find( t => !t.data.hidden && t.hasSightfunction);
    if (this.observer && (others == undefined)) return true;
    
	}
	//DZ

    // Only display hidden tokens for the GM
//    if (this.data.hidden && !isGM ) return false; // line actually only displays the vision OF hidden tokens for GM which is probably wrong

    // Always display controlled tokens which have vision
    
	//if ( this._controlled ) return true;

	return false;
    // Otherwise vision is ignored for GM users
    if ( isGM ) return false;
//--if ( isGM ) return false;


    // If a non-GM user controls no other tokens with sight, display sight anyways
//--    const canObserve = this.actor && this.actor.hasPerm(game.user, "OBSERVER");
// --   if ( !canObserve ) return false;
// --   const others = this.layer.controlled.filter(t => !t.data.hidden && t.hasSight);
// --   return !others.length;
 return false;
};
  

Token.prototype._isVisionSource =ReplaceIsVisionSource;
  

// New feature
Token.prototype.setPosition=    ReplaceTokenSetPosition;


async function ReplaceTokenSetPosition(x, y, {animate=true}={}) {
 //console.warn('ReplaceTokenSetPosition',this);	
    // Create a Ray for the requested movement
    let origin = this._movement ? this.position : this._validPosition,
        target = {x: x, y: y},
        isVisible = this.isVisible;

    // Create the movement ray
    let ray = new Ray(origin, target);
    const hasCollision = this.checkCollision(target); // note: checkCollision must be called before _validPosition is updated.

    // Update the new valid position
    this._validPosition = target;

    // Record the Token's new velocity
    this._velocity = this._updateVelocity(ray);

    // Update visibility for a non-controlled token which may have moved into the controlled tokens FOV
    this.visible = isVisible;

    // Conceal the HUD if it targets this Token
    if ( this.hasActiveHUD ) this.layer.hud.clear();

    // Either animate movement to the destination position, or set it directly if animation is disabled
	
	console.warn('check collision', hasCollision, target, origin);
    if ( animate && !hasCollision ) await this.animateMovement(new Ray(this.position, ray.B));
    else this.position.set(x, y);
	if (hasCollision && animate) {
		this.animateMovement(new Ray(this.position, ray.B));
	} 

    // If the movement took a controlled token off-screen, re-center the view
    if (this._controlled && isVisible) {
		//DZ
//      let pad = 50;
//      let gp = this.getGlobalPosition();
//      if ((gp.x < pad) || (gp.x > window.innerWidth - pad) || (gp.y < pad) || (gp.y > window.innerHeight - pad)) {
//        canvas.animatePan(this.center);
// }
      let pad = 500;
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
	//DZ VERSION
	const isLightSource = this.emitsLight;
    //DZ VERSION
    //const isLightSource = this.emitsLight && !this.data.hidden;
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


