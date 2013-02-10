@interface DisplayView : NSView <NSWindowDelegate>

- (DisplayView*) initWithSize: (CGSize) size;
- (BOOL) createGL;
- (void) teardownGL;

@end
