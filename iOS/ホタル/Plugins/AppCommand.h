#import "../../CordovaLib/Include/Cordova/CDV.h"

@interface AppCommand : CDVPlugin

- (void) command: (CDVInvokedUrlCommand*) command;
- (void) call: (NSDictionary*) command;

@end

