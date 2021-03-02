# TokensVisible v1.0.0
**Tokens Visible** - See what you need to see. No more, no less!
***
A module for Foundry VTT.

By using **Tokens Visible** you enable the following features in your Foundry VTT:

1. "Push Tokens Back" - Float your cusor over foreground obstructing tokens, press a hot-key and send them to the back of stack. This allows you to access the token you want, even when it's hidden beneath others.

This feature works on your own canvas so it will not alter the view that other players see. Do not activate the token, but simply FLOAT the cursor over the obstructing token.
This is especially useful in games where players may fight many enemies in close quarters and tokens crawl over each other, occasionally preventing a player or GM from being able to see or manipulate the token they need.
The default hotkey is uppercase "Z", but this can be reconfigured in the settings.

Note: This module replicates 100% of the functionality of the moduled called Push Tokens Back (which I also wrote). If you use TokensVisible you do not need PushTokensBack.

2. "Hidden Tokens Can See" - Activate this setting and when the GM turns off visibility for a Token it will no longer lose vision.  Turning invisible when you close your eyes is a houserule that I dont allow in my games. 

3. "Hidden Tokens Can Emit Light" - Hidden tokens are no longer prevented from emitting light.  If you hide while carrying a sunsword, it doesn't stop glowing no matter how high your Stealth skill is!

4. "Tokens Don't Fly" - Currently when players have Animated Movement turned on, and the GM moves their token to another part of the map, they will see their token fly through walls and get to look at everything in the path between their start and destination. With this option turned on, tokens moved by a GM that would cross a wall, will not use animated movement, but will simply vanish and reappear at their destination without revealing the intermediary map at all.  Also nobody else will see which direction they flew away to.  Short distance movement that intersect no barriers will still use normal Animated Movement if applicable.

5. Control Tools Color Chooser - assign colours to your control tools. This can help make them easier to see.  
Note: Some modules don't keep their Control Tools attributes set properly and you may finally notice this when you've assigned colors to them. If you notice that, please tell the authors of those modules.

6. Configurable Auto-pan : Configure how wide of a margin you want around your token before the canvas automatically re-centres.  














