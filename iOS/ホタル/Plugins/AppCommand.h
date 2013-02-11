/********* Echo.h Cordova Plugin Header *******/

#import <Cordova/CDV.h>

@interface AppCommand : CDVPlugin

- (void) command: (CDVInvokedUrlCommand*) command;

@end

