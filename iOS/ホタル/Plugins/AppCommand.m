/********* Echo.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import "AppCommand.h"

@implementation AppCommand

- (void) command: (CDVInvokedUrlCommand*) command
{
    CDVPluginResult *pluginResult = nil;
    NSString *payload = [command.arguments objectAtIndex:0];
	
    if (payload != nil && payload.length > 0)
	{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: @"OK"];
    }
	else
	{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
	
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	
	NSLog(@"app command: %@", payload);
}

@end