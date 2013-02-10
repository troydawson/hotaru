#import "INAppStoreWindow.h"
#import "DisplayView.h"

#import "AppDelegate.h"

@interface AppDelegate ()

@property (strong) NSTimer *timer;

@end

@implementation AppDelegate

- (void) applicationDidFinishLaunching: (NSNotification*) aNotification
{
	self.window = [[INAppStoreWindow alloc] initWithContentRect: CGRectMake(200,20,720,450) styleMask: NSTitledWindowMask|NSClosableWindowMask|NSMiniaturizableWindowMask backing: NSBackingStoreBuffered defer: NO];
	
	self.window.titleBarHeight = 34;
	
//?	self.window.collectionBehavior = NSWindowCollectionBehaviorFullScreenPrimary;
	
	self.window.centerFullScreenButton = YES;
	self.window.centerTrafficLightButtons = YES;
	self.window.hideTitleBarInFullScreen = YES;
	
	self.window.title = @"";

	DisplayView *display_view = [[DisplayView alloc] initWithSize: CGSizeMake(720,450)];
				
	self.window.contentView = display_view;

	[display_view createGL];
	
	[self.window makeKeyAndOrderFront: self.window];

    [[NSNotificationCenter defaultCenter] addObserver: self selector: @selector(windowClosing:) name:NSWindowWillCloseNotification object: self.window];

    self.timer = [NSTimer scheduledTimerWithTimeInterval:(1.0 / 1.0) target: display_view selector: @selector(update) userInfo:nil repeats: YES];
}

- (BOOL) applicationShouldTerminateAfterLastWindowClosed: (NSApplication*) sender
{
	return YES;
}

- (void) windowClosing: (NSNotification*) notification
{
	[self.timer invalidate];
}

- (void) applicationWillTerminate: (NSNotification*) notification
{
	
}

- (void) sendEvent: (NSEvent*) event;
{
	switch (event.type)
	{
		case NSKeyDown:
		{
			unichar c = [event.charactersIgnoringModifiers characterAtIndex: 0];
			
			if (c == 0x1B || (tolower(c) == 'q' && event.modifierFlags & NSCommandKeyMask))
			{
				[NSApplication.sharedApplication terminate: self];
				return;
			}
			
			return; // don't forward key down events
		}
	}	
}


@end
