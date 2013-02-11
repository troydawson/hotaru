#import "../../CordovaLib/Include/Cordova/CDV.h"

typedef enum { KeyboardOff, KeyboardOn, NumKeyboardStates } KeyboardStates;

@interface AppCommand : CDVPlugin

- (KeyboardStates) keyboardState;
- (void) command: (CDVInvokedUrlCommand*) command;
- (void) call: (NSDictionary*) command;

@end

