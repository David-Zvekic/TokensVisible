# TokensVisible v1.0.0
**Your Tokens Visible** - See what you need to see. No more, no less!
***
A module for Foundry VTT.

By using **Tokens Visible** you enable the following features in your Foundry VTT:

1. "Push Tokens Back" - Float your cusor over foreground obstructing tokens, press a hot-key and send them to the back of rendering stack. This allows you to access the token you want, even when it's hidden beneath others.

This feature works on your own canvas so it will not alter the view of other players.
 
This feature is most useful in games where players may fight many enemies in close quarters and tokens crawl over each other, especially if tokens can share a single grid position,  preventing players or the GM from being able to see or manipulate the token they need.

The default hotkey is lowercase "z", but this can be reconfigured.

Note: This module replicates 100% of the functionality of the moduled called Push Tokens Back (which I also wrote). If you use 'Your Tokens Visible', you do not need PushTokensBack.

2. "Hidden Tokens Can See" - Activate this setting and when the GM turns off visibility for a Token it will no longer lose vision. 

3. "Hidden Tokens Can Emit Light" - Hidden tokens are no longer prevented from emitting light.  

4. "Tokens Don't Fly" - Currently when the GM moves a token, and it's owner has Animated Token Movement enabled, they will see their token fly through walls and reveal everything in the path between the start and destination. With this feature turned on, tokens that would cross a wall, will not use animated movement, but will simply  reappear at their destination without revealing the intermediary map at all.  Movement that intersects no barriers will use normal Animated Movement preferences.

5. Control Tools Color Assignment - assign colours to your control tools status buttons. This can help make them easier to see.  

6. Configure Auto-pan Margin: Clients can each configure how wide of a margin they want around their tokens before the canvas automatically re-centres.  














