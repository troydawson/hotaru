@class CDVInvokedUrlCommand;
@class CDVViewController;

@interface CDVCommandQueue : NSObject {
    @private
    NSInteger _lastCommandQueueFlushRequestId;
    __weak CDVViewController* _viewController;
    NSMutableArray* _queue;
    BOOL _currentlyExecuting;
}

@property (nonatomic, readonly) BOOL currentlyExecuting;

- (id)initWithViewController:(CDVViewController*)viewController;
- (void)dispose;

- (void)resetRequestId;
- (void)enqueCommandBatch:(NSString*)batchJSON;

- (void)maybeFetchCommandsFromJs:(NSNumber*)requestId;
- (void)fetchCommandsFromJs;
- (void)executePending;
- (BOOL)execute:(CDVInvokedUrlCommand*)command;

@end
