#import "AppCommand.h"

@interface AppCommand ()

@property (assign) KeyboardStates state;
@end

@implementation AppCommand

- (id) initWithWebView: (UIWebView*) theWebView
{
	self = [super initWithWebView: theWebView];
	self.state = KeyboardOff;
	return self;
}

- (KeyboardStates) keyboardState { return self.state; }

- (void) command: (CDVInvokedUrlCommand*) command
{
    CDVPluginResult *pluginResult = nil;
    NSDictionary *action = [command.arguments objectAtIndex:0];
	
    if (action != nil)
	{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: @"OK"];
    }
	else
	{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
	
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	
	NSLog(@"ok, touch");
	
	self.state = KeyboardOff;
	
	[self.viewController.webView resignFirstResponder];
	
//	[[UIApplication sharedApplication] sendAction:@selector(resignFirstResponder) to:nil from:nil forEvent:nil];
}

- (void) call: (NSDictionary*) command
{
	NSLog(@"AppCommand received: %@", [command objectForKey: @"action"]);
}

@end