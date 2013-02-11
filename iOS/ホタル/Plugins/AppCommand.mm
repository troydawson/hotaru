#import "AppCommand.h"

@interface AppCommand ()
@end

@implementation AppCommand

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
	
//	NSLog(@"ok, touch");
	
}

- (void) call: (NSDictionary*) command
{
	NSLog(@"AppCommand received: %@", [command objectForKey: @"action"]);
}

@end