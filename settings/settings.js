export let tokensVisible= new Object();
export const moduleName = 'TokensVisible';
export const MODULE_ID = 'TOKENSVISIBLE';



export function registerSettings() {
	

	
    
	 game.settings.register(moduleName, 'combatantHidden', {
	   name: game.i18n.localize(MODULE_ID+".combatantHidden"),
	   hint: game.i18n.localize(MODULE_ID+".combatantHiddenHint"),
	   scope: 'world',   
	   config: true,      
       type: String,
       choices: {
                 "default": game.i18n.localize(MODULE_ID+".combatantHiddenDefault") ,
                 "hostile": game.i18n.localize(MODULE_ID+".combatantHiddenHostile") ,
                 "neutral": game.i18n.localize(MODULE_ID+".combatantHiddenNeutral") ,
                 "all": game.i18n.localize(MODULE_ID+".combatantHiddenAll") ,
		   
       },
	   default: "default" ,
	   onChange: value=>{tokensVisible.setupCombatantMasking(value);}
  	 });
	 
    game.settings.register(moduleName, 'pushhotkey', {
      name: game.i18n.localize(MODULE_ID+".SelectHotKey"),
      hint: game.i18n.localize(MODULE_ID+".SelectHotKeyHelp"),
      scope: 'client',   
      config: true,      
      type: String,     
      default: "z",
      onChange: value => { tokensVisible.pushhotkey = value; }
    });
/*
    game.settings.register(moduleName , 'toggleActiveFG', {
      name: game.i18n.localize(MODULE_ID+".toggleActiveFG"),
      scope: 'world',   
      config: true,      
      type: String,     
      default: "",
      onChange: value => {  document.querySelectorAll('#controls .control-tool.toggle.active').forEach(e=>e.style.setProperty('color',value ));}
    });
	
	
*/	
 
 
    new window.Ardittristan.ColorSetting(moduleName , 'toggleActiveFG', {
 	    name: game.i18n.localize(MODULE_ID+".toggleActiveFG"),    // The name of the setting in the settings menu
 	    hint: game.i18n.localize(MODULE_ID+".colorPickerDefaultHint"),   // A description of the registered setting and its behavior
 	    label: "Color Picker",         // The text label used in the button
 	    restricted: false,             // Restrict this setting to gamemaster only?
 	    defaultColor:  "#00000000",     // The default color of the setting
 	    scope: "client",               // The scope of the setting
 	   onChange: tokensVisible.setupRenderColors 
	   // value => {  if (value!="#00000000") document.querySelectorAll('#controls .control-tool.toggle.active').forEach(e=>e.style.setProperty('color',value ));}
 	});
	
	
    new window.Ardittristan.ColorSetting(moduleName , 'toggleActiveBG', {
 	    name: game.i18n.localize(MODULE_ID+".toggleActiveBG"),    // The name of the setting in the settings menu
 	    hint: game.i18n.localize(MODULE_ID+".colorPickerDefaultHint"),   // A description of the registered setting and its behavior
 	    label: "Color Picker",         // The text label used in the button
 	    restricted: false,             // Restrict this setting to gamemaster only?
 	    defaultColor: "#00000000",     // The default color of the setting
 	    scope: "client",               // The scope of the setting
 	   onChange: tokensVisible.setupRenderColors  
	   //value => { if (value!="#00000000") document.querySelectorAll('#controls .control-tool.toggle.active').forEach(e=>e.style.setProperty('background',value ));}
 	});
	

    new window.Ardittristan.ColorSetting(moduleName , 'activeFG',  {
 	    name: game.i18n.localize(MODULE_ID+".activeFG"),
 	    hint: game.i18n.localize(MODULE_ID+".colorPickerDefaultHint"),   // A description of the registered setting and its behavior
 	    label: "Color Picker",         // The text label used in the button
 	    restricted: false,             // Restrict this setting to gamemaster only?
 	    defaultColor: "#00000000",     // The default color of the setting
 	    scope: "client",               // The scope of the setting
        onChange: tokensVisible.setupRenderColors  
		//value => { if (value!="#00000000")  document.querySelectorAll('#controls .control-tool.active:not(.toggle)').forEach(e=>e.style.setProperty('color',value ));}
 	});


	console.warn('active bg',  $("li.control-tool.active:not(.toggle)").css("background"));
	
    new window.Ardittristan.ColorSetting(moduleName, 'activeBG', {
 	    name: game.i18n.localize(MODULE_ID+".activeBG"),
 	    hint: game.i18n.localize(MODULE_ID+".colorPickerDefaultHint"),   // A description of the registered setting and its behavior
 	    label: "Color Picker",         // The text label used in the button
 	    restricted: false,             // Restrict this setting to gamemaster only?
 	    defaultColor: "#00000000",     // The default color of the setting
 	    scope: "client",               // The scope of the setting
    	  onChange: tokensVisible.setupRenderColors  
		 // value => { if (value!="#00000000") document.querySelectorAll('#controls .control-tool.active:not(.toggle)').forEach(e=>e.style.setProperty('background',value ));}
 	});
	
	
	


    game.settings.register(moduleName, "panMode", {
      name: game.i18n.localize(MODULE_ID+".panMode"),
      hint: game.i18n.localize(MODULE_ID+".panModeHint"),	
      scope: "client",
      config: true,
      type: String,
      choices: {
            "Recenter": game.i18n.localize(MODULE_ID+".panModeRecenter"),
            "Scroll": game.i18n.localize(MODULE_ID+".panModeScroll"),
      },
      default: "Scroll",
      onChange: value => { tokensVisible.panMode = value  }
    });
   
    game.settings.register(moduleName, 'autopanningMargin', {
      name: game.i18n.localize(MODULE_ID+".autopanningMargin"),
      hint: game.i18n.localize(MODULE_ID+".autopanningMarginHint"),
      scope: 'client',   
      config: true,      
      type: Number,     
      default: "200",
 	 onChange: value => { tokensVisible.autopanMargin = value ;}
    });

    game.settings.register(moduleName, "hiddenCanLight", {
      name: game.i18n.localize(MODULE_ID+".hiddenCanLight"),
      hint: game.i18n.localize(MODULE_ID+".hiddenCanLightHint"),	
      scope: "world",
      config: true,
      type: String,
      choices: {
           "Yes": game.i18n.localize(MODULE_ID+".hiddenCanLightYES"),
           "No": game.i18n.localize(MODULE_ID+".hiddenCanLightNO"),
      },
      default: "Yes",
      onChange: value => { tokensVisible.hiddenCanLight = value  }
    });


    game.settings.register(moduleName, "wallsCancelAnimation", {
      name: game.i18n.localize(MODULE_ID+".wallsCancelAnimation"),
      hint: game.i18n.localize(MODULE_ID+".wallsCancelAnimationHint"),
      scope: "world",
      config: true,
      type: String,
      choices: {
          "Yes": game.i18n.localize(MODULE_ID+".wallsCancelAnimationYES") ,
          "No": game.i18n.localize(MODULE_ID+".wallsCancelAnimationNO"),
          "Always": game.i18n.localize(MODULE_ID+".wallsCancelAnimationAlways")
      },
      default: "Yes",
      onChange: value => { tokensVisible.wallsCancelAnimation= value  }
    });


    game.settings.register(moduleName, "castRays", {
      name: game.i18n.localize(MODULE_ID+".castRays"),
      hint: game.i18n.localize(MODULE_ID+".castRaysHint"),
      scope: "client",
      config: true,
      type: String,
      choices: {
           "Standard": game.i18n.localize(MODULE_ID+".castRaysStandard") ,
           "Enhanced": game.i18n.localize(MODULE_ID+".castRaysEnhanced"),
           "Super": game.i18n.localize(MODULE_ID+".castRaysSuper")
      },
      default: "Standard",
      onChange: value =>  {tokensVisible.setProperCastRays(value)} 
      });
		 
		 
      game.settings.register(moduleName, 'castRayshotkey', {
 	   name: game.i18n.localize(MODULE_ID+".castRayshotkey"),
 	   hint: game.i18n.localize(MODULE_ID+".castRayshotkeyHint"),
 	   scope: 'client',   
 	   config: true,      
 	   type: String,     
 	   default: "e",
        onChange: value => { tokensVisible.castRayshotkey = value }
 	 });
		 
 	 game.settings.register(moduleName, 'sightCache', {
 	   name: game.i18n.localize(MODULE_ID+".sightCache"),
 	   hint: game.i18n.localize(MODULE_ID+".sightCacheHint"),
 	   scope: 'client',   
 	   config: true,      
        type: String,
        choices: {
                  "On": game.i18n.localize(MODULE_ID+".sightCacheOn") ,
                  "Off": game.i18n.localize(MODULE_ID+".sightCacheOff")
        },
 	   default: "On", 
   	   onChange: value => { tokensVisible.setProperSightCache(value)}
 	 });
	 
      game.settings.register(moduleName, 'sightCachehotkey', {
 	   name: game.i18n.localize(MODULE_ID+".sightCachehotkey"),
 	   hint: game.i18n.localize(MODULE_ID+".sightCachehotkeyHint"),
 	   scope: 'client',   
 	   config: true,      
 	   type: String,     
 	   default: "E",
  
 	   onChange: value => { tokensVisible.sightCachehotkey  = value }
 	 });
	 
};
