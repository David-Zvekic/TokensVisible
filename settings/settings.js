
export function registerSettings() {
    const moduleName = 'TokensVisible';
	const MODNAME = 'TOKENSVISIBLE';
	
    game.settings.register(moduleName, 'pushhotkey', {
      name: game.i18n.localize(MODNAME+".SelectHotKey"),
      hint: game.i18n.localize(MODNAME+".SelectHotKeyHelp"),
      scope: 'client',   
      config: true,      
      type: String,     
      default: "z",
      onChange: value => { tokensVisible.pushhotkey = value; }
    });

    game.settings.register(moduleName , 'toggleActiveFG', {
      name: game.i18n.localize(MODNAME+".toggleActiveFG"),
      scope: 'world',   
      config: true,      
      type: String,     
      default: "",
      onChange: value => {  document.querySelectorAll('#controls .control-tool.toggle.active').forEach(e=>e.style.setProperty('color',value ));}
    });

    game.settings.register(moduleName , 'toggleActiveBG', {
      name: game.i18n.localize(MODNAME+".toggleActiveBG"),
      scope: 'world',   
      config: true,      
      type: String,     
      default: "",
      onChange: value => { document.querySelectorAll('#controls .control-tool.toggle.active').forEach(e=>e.style.setProperty('background',value ));}
    });

    game.settings.register(moduleName , 'activeFG', {
      name: game.i18n.localize(MODNAME+".activeFG"),
      scope: 'world',   
      config: true,      
      type: String,     
      default: "",
      onChange: value => {  document.querySelectorAll('#controls .control-tool.active:not(.toggle)').forEach(e=>e.style.setProperty('color',value ));}
    });

    game.settings.register(moduleName, 'activeBG', {
      name: game.i18n.localize(MODNAME+".activeBG"),
      scope: 'world',   
      config: true,      
      type: String,     
      default: "",
      onChange: value => { document.querySelectorAll('#controls .control-tool.active:not(.toggle)').forEach(e=>e.style.setProperty('background',value ));}
    });

    game.settings.register(moduleName, "panMode", {
      name: game.i18n.localize(MODNAME+".panMode"),
      hint: game.i18n.localize(MODNAME+".panModeHint"),	
      scope: "client",
      config: true,
      type: String,
      choices: {
            "Recenter": game.i18n.localize(MODNAME+".panModeRecenter"),
            "Scroll": game.i18n.localize(MODNAME+".panModeScroll"),
      },
      default: "Scroll",
      onChange: value => { tokensVisible.panMode = value  }
    });
   
    game.settings.register(moduleName, 'autopanningMargin', {
      name: game.i18n.localize(MODNAME+".autopanningMargin"),
      hint: game.i18n.localize(MODNAME+".autopanningMarginHint"),
      scope: 'client',   
      config: true,      
      type: Number,     
      default: "200",
 	 onChange: value => { tokensVisible.autopanMargin = value ;}
    });

    game.settings.register(moduleName, "hiddenCanLight", {
      name: game.i18n.localize(MODNAME+".hiddenCanLight"),
      hint: game.i18n.localize(MODNAME+".hiddenCanLightHint"),	
      scope: "world",
      config: true,
      type: String,
      choices: {
           "Yes": game.i18n.localize(MODNAME+".hiddenCanLightYES"),
           "No": game.i18n.localize(MODNAME+".hiddenCanLightNO"),
      },
      default: "Yes",
      onChange: value => { tokensVisible.hiddenCanLight = value  }
    });


    game.settings.register(moduleName, "wallsCancelAnimation", {
      name: game.i18n.localize(MODNAME+".wallsCancelAnimation"),
      hint: game.i18n.localize(MODNAME+".wallsCancelAnimationHint"),
      scope: "world",
      config: true,
      type: String,
      choices: {
          "Yes": game.i18n.localize(MODNAME+".wallsCancelAnimationYES") ,
          "No": game.i18n.localize(MODNAME+".wallsCancelAnimationNO"),
          "Always": game.i18n.localize(MODNAME+".wallsCancelAnimationAlways")
      },
      default: "Yes",
      onChange: value => { tokensVisible.wallsCancelAnimation= value  }
    });


    game.settings.register(moduleName, "castRays", {
      name: game.i18n.localize(MODNAME+".castRays"),
      hint: game.i18n.localize(MODNAME+".castRaysHint"),
      scope: "client",
      config: true,
      type: String,
      choices: {
           "Standard": game.i18n.localize(MODNAME+".castRaysStandard") ,
           "Enhanced": game.i18n.localize(MODNAME+".castRaysEnhanced"),
           "Super": game.i18n.localize(MODNAME+".castRaysSuper")
      },
      default: "Standard",
      onChange: value =>  {tokensVisible.setProperCastRays(value)} 
      });
		 
		 
      game.settings.register(moduleName, 'castRayshotkey', {
 	   name: game.i18n.localize(MODNAME+".castRayshotkey"),
 	   hint: game.i18n.localize(MODNAME+".castRayshotkeyHint"),
 	   scope: 'client',   
 	   config: true,      
 	   type: String,     
 	   default: "e",
        onChange: value => { tokensVisible.castRayshotkey = value }
 	 });
		 
 	 game.settings.register(moduleName, 'sightCache', {
 	   name: game.i18n.localize(MODNAME+".sightCache"),
 	   hint: game.i18n.localize(MODNAME+".sightCacheHint"),
 	   scope: 'client',   
 	   config: true,      
        type: String,
        choices: {
                  "On": game.i18n.localize(MODNAME+".sightCacheOn") ,
                  "Off": game.i18n.localize(MODNAME+".sightCacheOff")
        },
 	   default: "On", 
   	   onChange: value => { tokensVisible.setProperSightCache(value)}
 	 });
	 
      game.settings.register(moduleName, 'sightCachehotkey', {
 	   name: game.i18n.localize(MODNAME+".sightCachehotkey"),
 	   hint: game.i18n.localize(MODNAME+".sightCachehotkeyHint"),
 	   scope: 'client',   
 	   config: true,      
 	   type: String,     
 	   default: "E",
  
 	   onChange: value => { tokensVisible.sightCachehotkey  = value }
 	 });
	 
};
