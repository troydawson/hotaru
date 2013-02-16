#import "AppCommand.h"

@interface AppCommand ()

@property (assign) KeyboardStates state;
@end

@implementation AppCommand

- (NSData*) getPixels
{
	UIImage *image = [UIImage imageNamed: @"Kanjibot Resources/10ji"];
	
	CGImageRef cg_image = image.CGImage;
	
    size_t w = CGImageGetWidth(cg_image);
    size_t h = CGImageGetHeight(cg_image);
	
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceGray();
	
	uint8_t *data = malloc(w*h);
	memset(data, 0xFF, sizeof(*data));
	
	CGContextRef context = CGBitmapContextCreate(data, w, h, 8, w, colorSpace, kCGImageAlphaNone);
	
    CGColorSpaceRelease(colorSpace);
	colorSpace = NULL;
	
	CGContextDrawImage(context, CGRectMake(0,0,w,h), cg_image);
	
	CGContextRelease(context);
	context = NULL;

	return [NSData dataWithBytesNoCopy: data length: sizeof *data];
}

- (void) doRLETest2
{
	NSData *pixels = [self getPixels];
	
	NSMutableData *output = [NSMutableData dataWithLength: 0];
	
	for (int ji = 0; ji < 1; ji++)
	{
		uint8_t buffer[96*96];
		
		for (int row = 0; row < 96; row++)
			memcpy(&buffer[row*96], &pixels.bytes[row*960+ji*96], 96);
		
		for (int i = 0; i < 96*96; i++)
		{
			uint8_t p = buffer[i];
			
			printf("%c", p == 0xFF ? ' ' : '*');
			
			if (i % 96 == 0)
				printf("\n");
		}
	}
}

- (void) saveData: (NSData*) data
{
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
	NSString *documentsDirectory = [paths objectAtIndex: 0];
	NSString *path = [documentsDirectory stringByAppendingPathComponent:@"imgs.dat"];
	
	[data writeToFile: path atomically: YES];
}

- (void) doRLETest
{
	NSData *pixels = [self getPixels];
	
	NSMutableData *output = [NSMutableData dataWithLength: 0];
	
	for (int ji = 0; ji < 10; ji++)
	{
		uint8_t buffer[96*96];
		
		for (int row = 0; row < 96; row++)
			memcpy(&buffer[row*96], &pixels.bytes[row*960+ji*96], 96);
		
		int scanning = -1; // 0x00 or 0xFF
		int run_length = 0;
		
		for (int i = 0; i < 96*96; i++)
		{
			uint8_t p = buffer[i];
			
			if ((p == 0x00 && scanning == 0x00) || (p == 0xFF && scanning == 0xFF)) //white or black
			{
				run_length +=1;
				
				if (run_length == 96) //max run
				{
					uint8_t code = p == 0x00 ? run_length-1 : 256-run_length;
					
					[output appendBytes: &code length: 1];
					run_length = 0;
				}
				
				continue;
			}
			
			if (scanning != -1) // terminated run
			{
				uint8_t code = scanning == 0x00 ? run_length-1 : 256-run_length;
				[output appendBytes: &code length: 1];
			}
			
			if (p == 0x00 || p == 0xFF) //start new scan?
			{
				scanning = p;
				run_length = 1;
				continue;
			}

			// output gray pixel:
			scanning = -1;
			uint8_t code = 96 + (p >> 2);
			[output appendBytes: &code length: 1];
		}
			
		NSLog(@"scan %d (%d total)", ji, output.length);
	}
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
	NSString *documentsDirectory = [paths objectAtIndex: 0];
	NSString *path = [documentsDirectory stringByAppendingPathComponent:@"imgs.dat"];
	
	NSLog(@"%@", path);
	[output writeToFile: path atomically: YES];
}

- (id) initWithWebView: (UIWebView*) theWebView
{
	self = [super initWithWebView: theWebView];
	self.state = KeyboardOff;
	
	[self doRLETest2];
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