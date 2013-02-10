/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import "CDVURLProtocol.h"
#import "CDVCommandQueue.h"
#import "CDVViewController.h"

@interface CDVHTTPURLResponse : NSHTTPURLResponse
- (id)initWithUnauthorizedURL:(NSURL*)url;
- (id)initWithBlankResponse:(NSURL*)url;
@property (nonatomic) NSInteger statusCode;
@end

// Contains a set of NSNumbers of addresses of controllers. It doesn't store
// the actual pointer to avoid retaining.
static NSMutableSet* gRegisteredControllers = nil;

// Returns the registered view controller that sent the given request.
// If the user-agent is not from a UIWebView, or if it's from an unregistered one,
// then nil is returned.
static CDVViewController *viewControllerForRequest(NSURLRequest* request)
{
    // The exec bridge explicitly sets the VC address in a header.
    // This works around the User-Agent not being set for file: URLs.
    NSString* addrString = [request valueForHTTPHeaderField:@"vc"];

    if (addrString == nil) {
        NSString* userAgent = [request valueForHTTPHeaderField:@"User-Agent"];
        if (userAgent == nil) {
            return nil;
        }
        NSUInteger bracketLocation = [userAgent rangeOfString:@"(" options:NSBackwardsSearch].location;
        if (bracketLocation == NSNotFound) {
            return nil;
        }
        addrString = [userAgent substringFromIndex:bracketLocation + 1];
    }

    long long viewControllerAddress = [addrString longLongValue];
    @synchronized(gRegisteredControllers) {
        if (![gRegisteredControllers containsObject:[NSNumber numberWithLongLong:viewControllerAddress]]) {
            return nil;
        }
    }

    return (__bridge CDVViewController*)(void*)viewControllerAddress;
}

@implementation CDVURLProtocol

+ (void)registerPGHttpURLProtocol {}

+ (void)registerURLProtocol {}

// Called to register the URLProtocol, and to make it away of an instance of
// a ViewController.
+ (void)registerViewController:(CDVViewController*)viewController
{
    if (gRegisteredControllers == nil) {
        [NSURLProtocol registerClass:[CDVURLProtocol class]];
        gRegisteredControllers = [[NSMutableSet alloc] initWithCapacity:8];
    }

    @synchronized(gRegisteredControllers) {
        [gRegisteredControllers addObject:[NSNumber numberWithLongLong:(long long)viewController]];
    }
}

+ (void)unregisterViewController:(CDVViewController*)viewController
{
    @synchronized(gRegisteredControllers) {
        [gRegisteredControllers removeObject:[NSNumber numberWithLongLong:(long long)viewController]];
    }
}

+ (BOOL)canInitWithRequest:(NSURLRequest*)theRequest
{
    NSURL* theUrl = [theRequest URL];
    CDVViewController* viewController = viewControllerForRequest(theRequest);

    if (viewController != nil) {
        if ([[theUrl path] isEqualToString:@"/!gap_exec"]) {
            NSString* queuedCommandsJSON = [theRequest valueForHTTPHeaderField:@"cmds"];
            NSString* requestId = [theRequest valueForHTTPHeaderField:@"rc"];
            if (requestId == nil) {
                NSLog(@"!cordova request missing rc header");
                return NO;
            }
            BOOL hasCmds = [queuedCommandsJSON length] > 0;
            if (hasCmds) {
                SEL sel = @selector(enqueCommandBatch:);
                [viewController.commandQueue performSelectorOnMainThread:sel withObject:queuedCommandsJSON waitUntilDone:NO];
            } else {
                SEL sel = @selector(maybeFetchCommandsFromJs:);
                [viewController.commandQueue performSelectorOnMainThread:sel withObject:[NSNumber numberWithInteger:[requestId integerValue]] waitUntilDone:NO];
            }
            // Returning NO here would be 20% faster, but it spams WebInspector's console with failure messages.
            // If JS->Native bridge speed is really important for an app, they should use the iframe bridge.
            // Returning YES here causes the request to come through canInitWithRequest two more times.
            // For this reason, we return NO when cmds exist.
            return !hasCmds;
        }
    }

    return NO;
}

+ (NSURLRequest*)canonicalRequestForRequest:(NSURLRequest*)request
{
    // NSLog(@"%@ received %@", self, NSStringFromSelector(_cmd));
    return request;
}

- (void)startLoading
{
    // NSLog(@"%@ received %@ - start", self, NSStringFromSelector(_cmd));
    NSURL* url = [[self request] URL];

    if ([[url path] isEqualToString:@"/!gap_exec"]) {
        CDVHTTPURLResponse* response = [[CDVHTTPURLResponse alloc] initWithBlankResponse:url];
        [[self client] URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
        [[self client] URLProtocolDidFinishLoading:self];
        return;
    }

    NSString* body = @"ERROR whitelist rejection";

    CDVHTTPURLResponse* response = [[CDVHTTPURLResponse alloc] initWithUnauthorizedURL:url];

    [[self client] URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];

    [[self client] URLProtocol:self didLoadData:[body dataUsingEncoding:NSASCIIStringEncoding]];

    [[self client] URLProtocolDidFinishLoading:self];
}

- (void)stopLoading
{
    // do any cleanup here
}

+ (BOOL)requestIsCacheEquivalent:(NSURLRequest*)requestA toRequest:(NSURLRequest*)requestB
{
    return NO;
}

@end

@implementation CDVHTTPURLResponse
@synthesize statusCode;

- (id)initWithUnauthorizedURL:(NSURL*)url
{
    self = [super initWithURL:url MIMEType:@"text/plain" expectedContentLength:-1 textEncodingName:@"UTF-8"];
    if (self) {
        self.statusCode = 401;
    }
    return self;
}

- (id)initWithBlankResponse:(NSURL*)url
{
    self = [super initWithURL:url MIMEType:@"text/plain" expectedContentLength:-1 textEncodingName:@"UTF-8"];
    if (self) {
        self.statusCode = 200;
    }
    return self;
}

- (NSDictionary*)allHeaderFields
{
    return nil;
}

@end
