#import <EGL/egl.h>

#include <OpenGL/CGLCurrent.h>

#import "DisplayView.h"

@interface DisplayView ()

@property (assign) SEL update_sel;

@property (assign) EGLDisplay display_id;
@property (assign) EGLContext context_id;

@property (assign) EGLSurface view_surface;
@property (assign) GLuint v_shader;
@property (assign) GLuint f_shader;
@property (assign) GLuint program;
@property (assign) GLuint vbo_index;


@end

@implementation DisplayView


- (NSSize) window:( NSWindow *) window willUseFullScreenContentSize:(NSSize)proposedSize
{
	return proposedSize;
}

- (NSArray*) customWindowsToEnterFullScreenForWindow: (NSWindow*) window
{
	return @[ window ];
}

- (void) window: (NSWindow*) window startCustomAnimationToEnterFullScreenWithDuration: (NSTimeInterval) duration
{
	[NSAnimationContext runAnimationGroup:^(NSAnimationContext *context) {
		
		[context setDuration: duration];
		[window.animator setFrame: NSScreen.mainScreen.frame display: YES];
		
	} completionHandler:^{  }];
}

- (BOOL) createGL
{
	self.display_id = eglGetDisplay((EGLNativeDisplayType)0); // 0 = default display
	
	EGLint iMajorVersion, iMinorVersion;
	
	if (!eglInitialize(self.display_id, &iMajorVersion, &iMinorVersion))
	{
		NSLog(@"Failed to initialise EGL.");
		return NO;
	}
	
	eglBindAPI(EGL_OPENGL_ES2_BIT);

	EGLint attrs[] = {
		EGL_SURFACE_TYPE, EGL_WINDOW_BIT, // visible surface
		EGL_RENDERABLE_TYPE, EGL_OPENGL_ES2_BIT,
		EGL_NONE
	};
	
	// take first config that matches:
	
	EGLint iConfigs;
	EGLConfig eglConfig;
	
	if (!eglChooseConfig(self.display_id, attrs, &eglConfig, 1, &iConfigs) || (iConfigs != 1))
	{
		NSLog(@"eglChooseConfig failed to find a suitable config.");
		return NO;
	}
	
	self.view_surface = eglCreateWindowSurface(self.display_id, eglConfig, (__bridge EGLNativeWindowType) self, NULL);
	
	if (self.view_surface == EGL_NO_SURFACE)
	{
		NSLog(@"eglCreateWindowSurface failed to create a window surface.");
		return NO;
	}
	
	EGLint contextAttrs[] = { EGL_CONTEXT_CLIENT_VERSION, 2, EGL_NONE };
	self.context_id = eglCreateContext(self.display_id, eglConfig, NULL, contextAttrs);
	
	if (self.context_id == EGL_NO_CONTEXT)
	{
		NSLog(@"eglCreateContext failed to create a context.");
		return NO;
	}

	eglMakeCurrent(self.display_id, self.view_surface, self.view_surface, self.context_id);
	
	glClearColor(0.6f,0.8f,1.0f,1.0f);
	
	self.v_shader = glCreateShader(GL_VERTEX_SHADER);
	
	const char* pszVertShader = "\
	attribute vec4 myVertex;\
	uniform mat4 myPMVMatrix;\
	void main(void)\
	{\
		gl_Position = myPMVMatrix * myVertex;\
	}";
	
	glShaderSource(self.v_shader, 1, &pszVertShader, NULL);
	
	// Compiler the shader
	glCompileShader(self.v_shader);
	
	// Check if the shader compiled successfully
	GLint bShaderCompiled;
	glGetShaderiv(self.v_shader, GL_COMPILE_STATUS, &bShaderCompiled);
	
	if (!bShaderCompiled)
	{
		// Our shader compilation failed. Lets find out why.
		int i32InfoLogLength, i32CharsWritten;
		glGetShaderiv(self.v_shader, GL_INFO_LOG_LENGTH, &i32InfoLogLength);
		
		// Allocated enough space for the message and retrieve it
		char * pszInfoLog = new char[i32InfoLogLength];
		glGetShaderInfoLog(self.v_shader, i32InfoLogLength, &i32CharsWritten, pszInfoLog);
		
		// Print our the error log
		NSLog(@"Failed to compiler the Vertex shader: %@", [NSString stringWithUTF8String:pszInfoLog]);
		
		delete[] pszInfoLog;
		
		return NO;
	}
	
	// Create our fragment shader
	self.f_shader = glCreateShader(GL_FRAGMENT_SHADER);
	
	// Load the shader source into it
	const char* pszFragShader = "\
	void main(void) \
	{\
		gl_FragColor = vec4(1.0,1.0,0.6,1.0); \
	}";
	
	glShaderSource(self.f_shader, 1, &pszFragShader, NULL);
	
	// Compiler the shader
	glCompileShader(self.f_shader);
	
	// Check if the shader compiled successfully
	glGetShaderiv(self.f_shader, GL_COMPILE_STATUS, &bShaderCompiled);
	
	if (!bShaderCompiled)
	{
		// Our shader compilation failed. Lets find out why.
		int i32InfoLogLength, i32CharsWritten;
		glGetShaderiv(self.f_shader, GL_INFO_LOG_LENGTH, &i32InfoLogLength);
		
		// Allocated enough space for the message and retrieve it
		char * pszInfoLog = new char[i32InfoLogLength];
		glGetShaderInfoLog(self.f_shader, i32InfoLogLength, &i32CharsWritten, pszInfoLog);
		
		// Print our the error log
		NSLog(@"Failed to compile the Fragment shader: %@", [NSString stringWithUTF8String:pszInfoLog]);
		
		delete[] pszInfoLog;
		
		return NO;
	}
	
	// Create the shader program
	self.program = glCreateProgram();
	
	// Attach the fragment and vertex shaders to it
	glAttachShader(self.program, self.v_shader);
	glAttachShader(self.program, self.f_shader);
	
	// Bind the custom vertex attibute "myVertex" to location VERTEX_ARRAY
	glBindAttribLocation(self.program, 0, "myVertex"); //0 = location 0
	
	// Link the program
	glLinkProgram(self.program);
	
	// Check if linking succeeded in the same way we checked for compilation success
	GLint bLinked;
	glGetProgramiv(self.program, GL_LINK_STATUS, &bLinked);
	
	if(!bLinked)
	{
		// Our shader compilation failed. Lets find out why.
		int i32InfoLogLength, i32CharsWritten;
		glGetShaderiv(self.program, GL_INFO_LOG_LENGTH, &i32InfoLogLength);
		
		// Allocated enough space for the message and retrieve it
		char * pszInfoLog = new char[i32InfoLogLength];
		glGetShaderInfoLog(self.program, i32InfoLogLength, &i32CharsWritten, pszInfoLog);
		
		// Print our the error log
		NSLog(@"Failed to link our shader program: %@", [NSString stringWithUTF8String:pszInfoLog]);
		
		delete[] pszInfoLog;
		
		return NO;
	}
	
	glUseProgram(self.program);
	
	// Create our geometry
	
	GLuint tmp;
	glGenBuffers(1, &tmp);
	
	self.vbo_index = tmp; //?
	
	glBindBuffer(GL_ARRAY_BUFFER, self.vbo_index);
	
	// Set the buffer's data
	GLfloat afVertices[] = { -0.4f, -0.4f, 0.0f, // Position
		0.4f, -0.4f, 0.0f,
		0.0f, 0.4f, 0.0f };
	unsigned int uiSize = 3 * (sizeof(GLfloat) * 3); // Calc afVertices size ( 3 vertices * stride (3 GLfloats per vertex))
	glBufferData(GL_ARRAY_BUFFER, uiSize, afVertices, GL_STATIC_DRAW);
	
	self.update_sel = @selector(renderScene);
	
	return YES;
}

- (DisplayView*) initWithSize: (CGSize) size
{
	self = [super initWithFrame: CGRectMake(0, 0, size.width, size.height)];
	
	return self;
}

- (void) viewWillMoveToWindow: (NSWindow *) window
{
	if (window == nil)
		self.update_sel = NULL;
	
	[window setDelegate: self];
}

- (void) displayIfNeeded
{
}

- (void) teardownGL
{
	self.update_sel = NULL;

	glDeleteProgram(self.program);
	glDeleteShader(self.f_shader);
	glDeleteShader(self.v_shader);
	
	GLuint tmp = self.vbo_index;
	glDeleteBuffers(1, &tmp);
	
	eglMakeCurrent(self.display_id, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT);
	eglDestroySurface(self.display_id, self.view_surface);
	
	self.view_surface = EGL_NO_SURFACE;
	
	eglTerminate(self.display_id);
}

- (void) dealloc
{
	[self teardownGL];
}

- (void) update
{
	if (self.update_sel != NULL)
		[self performSelector: self.update_sel];
}

- (void) renderScene
{
	static float t;
	
	glClearColor(0,0,fabs(sin(t += 0.1)), 1);
	
	glClear(GL_COLOR_BUFFER_BIT);
	
	glUseProgram(self.program);
	
	int i32Location = glGetUniformLocation(self.program, "myPMVMatrix");
	
	// Then pass the matrix to that variable
	static const GLfloat pfIdentity[] =
	{
		1.0f,0.0f,0.0f,0.0f,
		0.0f,1.0f,0.0f,0.0f,
		0.0f,0.0f,1.0f,0.0f,
		0.0f,0.0f,0.0f,1.0f
	};
	glUniformMatrix4fv(i32Location, 1, GL_FALSE, pfIdentity);
	
	glEnableVertexAttribArray(0); // 0 is index of array
	
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, 0); //first 0 is index of array
	
	glDrawArrays(GL_TRIANGLES, 0, 3);
	
	eglSwapBuffers(self.display_id, self.view_surface);
}

@end
