#import "../../CordovaLib/Include/Cordova/CDV.h"

#import "../Plugins/AppCommand.h"

#import "MainWebView.h"


@interface UIView (FindViewController)
- (UIViewController*) viewController;
@end

@implementation UIView (FindViewController)

- (UIViewController*) viewController
{
	for (UIView *view = self; view != nil; view = view.superview)
		if ([view.nextResponder isKindOfClass: [UIViewController class]])
			return (UIViewController*) view.nextResponder;
	
    return nil;
}
@end


@interface KeyboardView : UIView
@property (assign, nonatomic) CDVViewController *view_controller;
@property (retain, nonatomic) UIImage *background;
@end

@implementation KeyboardView

- (id) init
{
	self = [super initWithFrame: CGRectMake(0,0,320,163)];
	
	self.background = [UIImage imageNamed: @"Kanjibot Resources/keyboard"];
	
	return self;
}
	

- (void) drawRect: (CGRect) rect
{
	[self.background drawAtPoint: CGPointZero];
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
	NSLog(@"touch began");
	
	if (self.view_controller == nil)
	{
		NSLog(@"error -- view controller not found!");
		return;
	}
	
	AppCommand *app = (AppCommand*) [self.view_controller getCommandInstance: @"App Command"];
	
	if (app == nil)
	{
		NSLog(@"error -- App plugin not found!");
		return;
	}
	
	[app call: @{ @"action" : @"keyboard touches!" }];
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
	
}


- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
	
}

- (void) touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
	
}



@end



@implementation MainWebView

- (void) insertText: (NSString*) text
{
	NSLog(@"text = %@", text);
}

- (void) deleteBackward
{
    // Handle the delete key
}

- (BOOL) hasText
{
	return YES;
	
}

- (BOOL) canResignFirstResponder
{
	return self.app.keyboardState == KeyboardOff;
}

- (BOOL) canBecomeFirstResponder
{
	if (self.app == nil)
		self.app = (AppCommand*) [CDVViewController.sharedController getCommandInstance: @"App Command"];
	
	if (self.keyboardView == nil)
	{
		self.keyboardView = [KeyboardView new];
		self.keyboardView.view_controller = (CDVViewController*) self.viewController;
	}
	
	self.inputView = self.keyboardView;
	
	[self reloadInputViews];
	
    return YES;
}

- (BOOL) resignFirstResponder
{
	return [super resignFirstResponder];
}

@end

