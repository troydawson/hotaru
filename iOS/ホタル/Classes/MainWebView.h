@class KeyboardView;
@class AppCommand;

@interface MainWebView : UIWebView <UIKeyInput>

@property (strong) UIView *inputView;
@property (strong) KeyboardView *keyboardView;
@property (strong) AppCommand *app;

@end


