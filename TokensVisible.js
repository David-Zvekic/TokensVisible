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
	name: 'Active Toggle-Button -  Color',
  hint: 'Pen Color of active toggle-controls',
  scope: 'world',   
  config: true,      
  type: String,     
  default: "",
  
	onChange: value => { document.querySelector('#controls .control-tool.toggle.active').style.setProperty('color',value); }
  }
);

game.settings.register('TokensVisible', 'toggleActiveBG', {
	name: 'Active Toggle-Button -  Background Color',
  hint: 'Background Color of active toggle-controls',
  scope: 'world',   
  config: true,      
  type: String,     
  default: "",
  
	onChange: value => { document.querySelector('#controls .control-tool.toggle.active').style.setProperty('background',value); }
  }
);




game.settings.register('TokensVisible', 'activeFG', {
	name: 'Active Control -  Color',
  hint: 'Pen Color of an active control',
  scope: 'world',   
  config: true,      
  type: String,     
  default: "",
  
	onChange: value => { document.querySelector('#controls .control-tool.active').style.setProperty('color',value); }
  }
);


game.settings.register('TokensVisible', 'activeBG', {
	name: 'Active Control -  Background Color',
  hint: 'Background Color of active control',
  scope: 'world',   
  config: true,      
  type: String,     
  default: "",
  
	onChange: value => { document.querySelector('#controls .control-tool.active').style.setProperty('background',value); }
  }
);


game.settings.register('TokensVisible', 'autopanningMargin', {
  name: 'Automatic Pan Margin',
  hint: 'How many pixels of margin until canvas pans to keep token centered in view',
  scope: 'client',   
  config: true,      
  type: Number,     
  default: "200",
  
  onChange: value => { tokensVisible.autopanMargin = value // value is the new value of the setting
  }
});







tokensVisible.pushhotkey=game.settings.get('TokensVisible', 'pushhotkey');
tokensVisible.autopanMargin= game.settings.get('TokensVisible', 'autopanningMargin');

/*


#controls .control-tool.toggle.active
 {
  background: rgba(3, 150, 3, 0.9);
  box-shadow: 0 0 10px #9b8dff;
}

$(".control-tool.tool.active").setAttributeValue

let r = document.querySelector('#controls.control-tool.toggle.active').style.setProperty('background',)
r.style.setProperty('--aliengreen', game.settings.get('alienrpg', 'fontColour'));
r.style.setProperty('--alienfont', game.settings.get('alienrpg', 'fontStyle'));

*/




});

Hooks.on('renderSceneControls', () => {
	
	
	//if (game.ready) {
	
	  const toggleActiveBG =  game.settings.get('TokensVisible', 'toggleActiveBG');
	  if (toggleActiveBG) {
		  const toggleActive = document.querySelectorAll('#controls .control-tool.toggle.active');
		  if(toggleActive.length) toggleActive.forEach(e=>e.style.setProperty('background',toggleActiveBG ));
      }
	  
	  const toggleActiveFG =  game.settings.get('TokensVisible', 'toggleActiveFG');
	  if (toggleActiveFG) {
		  const toggleActive = document.querySelectorAll('#controls .control-tool.toggle.active');
		  if(toggleActive.length) toggleActive.forEach(e=>e.style.setProperty('color',toggleActiveFG ));
      }
	  
	  
	  const activeBG =  game.settings.get('TokensVisible', 'activeBG');
	  if (activeBG) {
		  const active = document.querySelectorAll('#controls .control-tool.active:not(.toggle)');
		  if(active.length) active.forEach(e=>e.style.setProperty('background',activeBG ));
      }
	  
	  const activeFG =  game.settings.get('TokensVisible', 'activeFG');
	  if (activeFG) {
		  const active = document.querySelectorAll('#controls .control-tool.active:not(.toggle)');
		  if(active.length) active.forEach(e=>e.style.setProperty('color',activeFG ));
      }
	  
	  
	  

  //  }
});



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
      let pad = tokensVisible.autopanMargin;
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


