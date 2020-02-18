# Tutorial-Game-of-Life

A simple tutorial for implementing [Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) in javascript.

## Getting Started

If you don't have one already, make a github.com account.  
They're free, so we'll use it as a neat place to store your work on this tutorial.

### Dependencies

You'll need to download some dependencies first so that you can write and run javascript.  
**If you're using a Raspberry Pi**, these dependencies will already be installed.

* [git for windows](https://git-scm.com/download/win)  
   This will be used to put your work into github.
* [Visual Studio Code](https://code.visualstudio.com/)  
   This is the editor we'll be using. Feel free to use any other editor you prefer.
* A browser (Preferably Chrome or Firefox)  
   javascript can be run on your desktop using nodejs, or in your browser.  
   For this tutorial, we'll run in the browser so that we can see our game.

You could make do with any editor you liked, and you can even use websites like [jsbin](jsbin.com)
to edit and run javascript just in your browser without downloading anything.
It's this flexibility and openness of the platform that makes javascript appealing.
It runs *everywhere*.

### Starting your Project

You don't need to create any project structure here, but your should create a folder to work in.  Start by opening a shell.

> Throughout this tutorial I will refer to a 'shell', by that I mean either bash (on the Raspberry Pi's) or PowerShell (on Windows).  
> Windows: Open the start menu. Type "PowerShell". Run the application.  
> R Pi: Open the start menu. Go to "Accessories". Click "Terminal".

In the shell, navigate to a directory that you'd like to create the project folder within. For example, your home folder or documents folder.

> Windows: `cd "$env:USERPROFILE/Documents"`  
> R Pi: `cd ~`

Now we can create a folder and navigate into it:

> `mkdir .\game-of-life`  
> `cd .\game-of-life`

Finally, we can initialize git in this directory.

> `git init`

Right, that's it for the command line for a while. We can launch code and open our project!

> Windows: `code .`  
> R Pi: `code-oss .`

## Saving your Work

Throughout this tutorial, you can use github as a place to store your own work.  
When you are at a point that you want to save, start by configuring git so that it knows who you are:

1. Open a shell (or use the one you opened earlier)
2. Enter the commands:  
   `git config user.email = "my.email@address"`
   `git config user.name = "My Name"`

Excellent, now, we need to have a repository in github to push to:

1. Open [github](github.com)
2. Create a new repository with a sensible name.

You'll be greeted with a screen that has an explanation of how to push your first code.  
There are two sets of instructions, what we're interested in doing is pushing our existing code up to github.

For example, if I create a test repository github tells me to:

```sh
git remote add origin https://github.com/Alexei-B/test.git
git push -u origin master
```

For now, just copy the `git remote add` bit.

1. Open a shell (or use the one you opened earlier)
2. Use the `cd` (change directory) command to navigate to your directory (if you aren't there already).  
   * Windows: `cd "$env:USERPROFILE/Documents/Physics"`
   * R Pi: `cd ~/Physics`
3. Add the remote.

Awesome, that's all of the first time setup done.  
You can push your work up to github easily through VS Code now:

1. Save all your files.
2. Open the source control panel (Ctrl+Shift+G).
3. Stage all of your changes (hit the plus button next to the files).
4. Write a message that summarises the change in the field above ("Added stuff", "Changed whatever").
5. Click the tick at the top of the panel.
6. Click the synchronise button in the bottom left.

Any of that confusing?  
[Instructions with pictures here.](https://code.visualstudio.com/docs/editor/versioncontrol)


## Implementing Game of Life

[Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) is an example of emergence.  
It has just four simple rules. Out of those rules, complex and interesting patterns emerge.

The simulation (it's not really a game, per se) takes place in a grid.  
Cells within the grid can be alive, or dead.  

Here are the rules:

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

To implement life, we're going to use a web page to display a canvas, and some javascript to draw pixels to that canvas.

### Our First Web Page

To run our javascript through a browser, we need an HTML page for the browser to load.
We'll call this page `index.html`, so in VS Code, create the file `index.html` now.

> Hyper Text Markup Language (HTML) is the standard for specifying the structure of a website. Go load up any site you like, right click, and select "View Source" to see the HTML that makes up that page.

We don't need much in our HTML, just a canvas.  
Here's how I did that:

```html
<!DOCTYPE html>
<html>
    <!-- The head of the document can be used to load scripts and style sheets. -->
    <head>
        <!-- This will appear as the tab name in the browser. -->
        <title>Game of Life</title>
    </head>

    <!-- The body is where all our page elements live. -->
    <body>

        <!-- The canvas element allows us the draw arbitrary images to the screen. -->
        <canvas id="game" width="200" height="200">
            If you can read this, your browser does not support canvas.
        </canvas>

    </body>
</html>
```

You can now open `index.html` in a browser and see the title. Success!

### Adding some code

Now we have a blank page, we want to write some code to draw on it. Create a blank javascript file called `game_of_life.js` next to your `index.html` file. Then tell the HTML file to run your code by adding a `script` element in the `head` block:

```html
    <head>
        <title>Game of Life</title>
        <script src="game_of_life.js"></script>
    </head>
```

Now let's add some simple code to our `js` file to check it's loading:

```js
console.log("Hello world!");
```

Your browser will now load `game_of_life.js` when you reload `index.html`. To test it, we need to open the developer console. Press "CTRL + SHIFT + I" or F12 in the browser and you will see this screen. Open the "console" tab.

> [How to open the chrome dev tools.](https://developers.google.com/web/tools/chrome-devtools/open)  
> [An overview of the chrome dev tools console.](https://developers.google.com/web/tools/chrome-devtools/console)

If you reload the page, you should see "Hello world!" logged in the console. Any time you want to understand if your code is working, or what it's doing, just throw whatever it is you don't understand into `console.log(...)` and look at the output in the dev tools. You can even execute javascript directly in the console by typing it in there. This makes javascript really easy to test.

### Accessing the DOM

To do useful stuff in our code, we need to be able to manipulate the elements in our HTML file (also known as the DOM, or Document Object Model). 

The main functions we will be using to do this are

* [`window.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). This lets you specify code to be run when an event happens, for example when the page finishes loading.
* [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById). This lets us pick an individual element out of our HTML file, using the the ids we specified like `id="game"`.

Update `game_of_life.js` to get our canvas from the DOM and log it to the console:

```js
// We're going to store the canvas globally, so that we can access it whenever we need.
// "let canvas" just tells javascript that a variable "canvas" exists at this level.
let canvas;

// This function will initialize all our game of life state, it's the first thing we'll run.
function initialize() {
    // Let's fetch the canvas from the DOM
    // If you look in the HTML, the <canvas> element has the property: `id="game"`
    // We can use that to find it now.
    canvas = document.getElementById("game");

    // And to check it's worked, let's log it.
    console.log(canvas);
}

// We've declared all our functions and global state, so, when the window is done loading, run it!
// If we didn't wait for the load event, and just called initialize(), the DOM might not contain
// the canvas yet, so it would probably fail.
window.addEventListener('load', initialize);
```

> Refresh your browser and look at the console.  
> You should see the element of the canvas logged. You can browse it's properties in the console.

### Drawing to the screen

Now we have our canvas element in javascript, we are ready to start drawing! To start with, we need to choose how we want to draw. For this tutorial, we just need a simple 2d context.

Once we've got the context, let's draw a few pixels.

```js
// We'll need some more global variables to store everything we're going to initialize.
let canvas, ctx;
let width, height;

function initialize() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    // To draw pixels to the canvas, we need to create some image data to manipulate.
    // The image data is raw 24 bit colour pixels with an 8 bit alpha channel.
    let image = ctx.createImageData(width, height);
    console.log(image);
}
```

> I'm not quoting the entire contents of the file now, I'm expecting you to keep the event binding for `window onload`. If you ever get really lost and don't know what the code should look like, don't forget that in this repository is a completed copy of the project.

> Refresh your browser and look at the console.  
> You should see the image data we just created.

24 bit color means that the three components (red, green, and blue) of colour on a screen will be controlled by a value from 0 to 255.

* 0 red, 0 green, and 0 blue would be black.
* 255 red, 0 green, and 0 blue would be red.
* 255 red, 255 green, and 255 blue would be white.

Lastly, we've got an extra channel for alpha, or opacity.  
This is also a value from 0 to 255, where 0 means totally see through, and 255 means solid colour.

So, to draw something to the screen, let's set some all pixels to white, and set some back to black:

```js
function initialize() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    let image = ctx.createImageData(width, height);
    
    // Looping through all of the pixels.
    // This 'for' loop lets us say:
    //   let i = 0;             | Start with i (our index) at zero (the start of the array).
    //   i < image.data.length; | Keep looping so long as i is less than all of the pixels in the buffer.
    //   i++                    | Add one to i each time we go around the loop.
    //
    // If you tried to read this code out load, I'd say;
    // for pixel channel in the image data array, set that channel to 255.
    for (let i = 0; i < image.data.length; ++i) {
        // We'll set every channel of every pixel to 255 (white, full opacity).
        image.data[i] = 255;
    }

    // Now let's set some very specific pixels to black.
    //
    // The math here is pretty simple, even if it looks complicated at first:
    //   image.data is the array of pixels.
    //   image.data[0] is the first channel (red), of the first pixel.
    //   image.data[1] is the second channel (green), of the first pixel.
    //   image.data[2] is the third channel (blue), of the first pixel.
    //   image.data[3] is the fourth channel (alpha), of the first pixel.
    //   image.data[4] is the first channel (red), of the second pixel.
    //   And so on.
    //
    // Let's say we want the 13th pixel down, 19 pixels from the left.
    // The first pixel is in the top left, and it goes left to right then top to bottom.
    //
    // So, we know we need to multiply by 4 (the number of channels) to select a pixel.
    //   image.data[target_pixel*4]
    //
    // To get the target pixel, we need to multiply the number of rows down we want, by the width.
    // Each multiple of the number of pixels across (the width) that we skip, gets us down one row.
    // We want to be 13 pixels down, so that's width * 13.
    // We want to be 19 pixels across, so we just add that.
    // Finally, we can multiply by 4 to account for the channels.
    //   image.data[(width*13 + 19)*4]
    image.data[(width*13 + 19)*4 + 0] = 0; // Now we set each of the R, G, and B channels
    image.data[(width*13 + 19)*4 + 1] = 0; // for each of the pixels we want, to 0.
    image.data[(width*13 + 19)*4 + 2] = 0; // This gives us black.

    image.data[(width*13 + 24)*4 + 0] = 0;
    image.data[(width*13 + 24)*4 + 1] = 0;
    image.data[(width*13 + 24)*4 + 2] = 0;

    image.data[(width*16 + 16)*4 + 0] = 0;
    image.data[(width*16 + 16)*4 + 1] = 0;
    image.data[(width*16 + 16)*4 + 2] = 0;
    
    image.data[(width*17 + 17)*4 + 0] = 0;
    image.data[(width*17 + 17)*4 + 1] = 0;
    image.data[(width*17 + 17)*4 + 2] = 0;
    
    image.data[(width*18 + 18)*4 + 0] = 0;
    image.data[(width*18 + 18)*4 + 1] = 0;
    image.data[(width*18 + 18)*4 + 2] = 0;
    
    image.data[(width*18 + 19)*4 + 0] = 0;
    image.data[(width*18 + 19)*4 + 1] = 0;
    image.data[(width*18 + 19)*4 + 2] = 0;
    
    image.data[(width*19 + 20)*4 + 0] = 0;
    image.data[(width*19 + 20)*4 + 1] = 0;
    image.data[(width*19 + 20)*4 + 2] = 0;
    
    image.data[(width*19 + 21)*4 + 0] = 0;
    image.data[(width*19 + 21)*4 + 1] = 0;
    image.data[(width*19 + 21)*4 + 2] = 0;
    
    image.data[(width*19 + 22)*4 + 0] = 0;
    image.data[(width*19 + 22)*4 + 1] = 0;
    image.data[(width*19 + 22)*4 + 2] = 0;
    
    image.data[(width*19 + 23)*4 + 0] = 0;
    image.data[(width*19 + 23)*4 + 1] = 0;
    image.data[(width*19 + 23)*4 + 2] = 0;
    
    image.data[(width*18 + 24)*4 + 0] = 0;
    image.data[(width*18 + 24)*4 + 1] = 0;
    image.data[(width*18 + 24)*4 + 2] = 0;
    
    image.data[(width*18 + 25)*4 + 0] = 0;
    image.data[(width*18 + 25)*4 + 1] = 0;
    image.data[(width*18 + 25)*4 + 2] = 0;
    
    image.data[(width*17 + 26)*4 + 0] = 0;
    image.data[(width*17 + 26)*4 + 1] = 0;
    image.data[(width*17 + 26)*4 + 2] = 0;
    
    image.data[(width*16 + 27)*4 + 0] = 0;
    image.data[(width*16 + 27)*4 + 1] = 0;
    image.data[(width*16 + 27)*4 + 2] = 0;

    ctx.putImageData(image, 0, 0);
}
```

> Reload your browser window now.  
> You should get a very small image in the top left.

OK, so you've drawn something. But, it's a bit small. Let's make it bigger so we can see what we've done.  
We could simply draw more pixels, however, that would require more code.  
Instead, let's just stretch the canvas out over the page.

To change the look of the canvas, we can use CSS (Cascading Style Sheets) to add style information to it. Create a new file called `style.css` and similarly to how we loaded the game of life script, load in the style sheet by modifying our HTML file.

```html
    <head>
        <title>Game of Life</title>
        <script src="game_of_life.js"></script>
        <link rel="stylesheet" href="style.css"/>
    </head>
```

In the new style sheet, let's add a style for all elements to remove padding and margins.  
Then, lets force the canvas to cover most of the page.

```css
/* Many elements default to having padding and margins.
 * Worse than that, the defaults are different in different browsers.
 * This rule applies to all elements, making our lives similar.
 * Now, nothing has padding or a margin. */
* {
    padding: 0;
    margin: 0;
}

/* This is our canvas style, it will fit the canvas to the height of your browser window. */
canvas {
    /* This makes the position of the element relative only to the window. */
    position: fixed;
    /* Here we stretch the canvas to fill the height of the page. */
    height: 100%;
    /* By default, the pixels would appear "smoothed" out.
     * I hate this effect, so this style rule is here to make our pixels crisp and sharp. */
    image-rendering: pixelated;
}
```

Now when you refresh our image should be clearer. It's a creepy face! Yaaaaay!

OK, we've learned how to draw something, now let's finish up our initialization behaviour.

The game of life needs a grid of cells, not unlike our grid of pixels. We'll need to represent this more abstractly though, writing to the array of pixels and having to set the channel information each time would make our code look very ugly.

We'll use a simple array, which we could declare as simply as `let cells = []` if that were all we needed. However, we also want to update these cells in a loop to apply the rules of the game of life. There are a bunch of different ways you could do that, however, in this case we're going to use the "double buffering" approach.

This means that we'll create two buffers (like `let buffers = [[], []]`), each with the complete state of the game. Every time we step the game forwards, we'll read from one buffer and write to the other. If we didn't do this, and we read and wrote to the same buffer, we could end up confusing the algorithm that counts near by living neighbours.

We'll need to keep track of which buffer we are writing to this frame, so we'll use a variable called `target_buffer` to track this. We'll switch this between `0` and `1` every time we execute the game of life algorithm to switch buffers.

```js
let canvas, ctx;
let width, height;
let buffers, target_buffer;

function run() {
    
}

function initialize() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    buffers = [[],[]];
    target_buffer = 0;

    // Loop through every cell in both buffers and set the cell to dead (0).
    for (let b = 0; b < buffers.length; ++b) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                buffers[b].push(0);
            }
        }
    }

    run();
}
```

Initialization is now done. As you can see, I've started introducing a run method, where the application logic will happen. We'll need to update our cells in a loop, however, a `for` loop is the wrong kind of loop here. We don't have a final condition, we're just going to run forever. In addition, we probably want to synchronise updates to the screen with the browser.

Thankfully, there is an API for this: [window.requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

We can easily modify run so that it runs over and over again each frame:

```js
update(input, output) {
    // We'll do the GoL update here.
}

render(cells) {
    // We'll render it to the screen here.
}

run () {
    // Do everything we need to do in a frame.
    update(buffers[target_buffer], buffers[1 - target_buffer]);
    render(buffers[target_buffer]);
    target_buffer = 1 - target_buffer;

    // Keep running.
    window.requestAnimationFrame(run);
}
```

### Making Progress

Excellent, if you've made it this far then you've gotten through most of the hard learning. All of the display, DOM manipulation, and event binding has been introduced so now we've just got some logic to implement that will run game of life for us.

Let's start by creating some simple functions that will make our lives easier.

#### Using Coordinates

It's a pain having to access the cells by index. You have to remember to multiply by width each time like we were doing with the image data before. Let's encapsulate that pain into a function, and then forget about it forever.

```js
function coordinate_index(x, y) {
    return (y % height) * width + (x % width);
}
```

This function takes a given x and y, and returns the index (within the grid) of that cell.  
Encapsulating complex behaviour like this is the best way to improve the readability of your code.

#### Drawing Lines

We're going to want to be able to set multiple cells as alive at once, without having the incredibly verbose code we used to draw the smiley face. Thankfully, we can use loops to solve that for us.

```js
// This function takes a starting pair of coordinates, and a target pair of coordinates to reach.
function draw_line(x, y, target_x, target_y) {
    // We're going to use a "while" loop to keep updating x and y, until we reach the target.
    while (x != target_x || y != target_y) {
        // Start by setting the cell we're on to alive.
        buffers[target_buffer][coordinate_index(x, y)] = 1;

        // Now, move to the next cell by making x and y one closer to their targets.
        if (x > target_x) --x; else if (x < target_x) ++x;
        if (y > target_y) --y; else if (y < target_y) ++y;
    }
}
```

### Updating and Rendering

#### Updating

Now that we've got some ground work, let's fill out the update function:

```js
// For now our game of life behaviour is just going to return the input.
function game_of_life(cells, x, y) {
    return cells[coordinate_index(x, y)];
}

// Update takes an input buffer and an output buffer.
// This lets us take care of buffer switching in run() and just pass the right buffers to update.
function update(input, output) {
    // For every cell in the input buffer.
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            // Set the output buffer's matching cell to be the game of life calculation over the input.
            output[coordinate_index(x, y)] = game_of_life(input, x, y);
        }
    }
}
```

#### Rendering

And we'll want to see what we do in the output, so let's render that to the canvas.

```js
function render(cells) {
    // Create some image data so we can draw pixels.
    let image = ctx.createImageData(width, height);

    // For every cell.
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            // Get the index of that cell.
            let c = coordinate_index(x, y);

            // Use that index multiplied by 4 (the number of channels) to access the image data
            // and set alive cells (1) to black (0), and dead cells (0) to white (255).
            // We can do that with the sum below: (1 - cell) * 255
            image.data[c*4+0] = (1 - cells[c]) * 255;
            image.data[c*4+1] = (1 - cells[c]) * 255;
            image.data[c*4+2] = (1 - cells[c]) * 255;

            // The alpha channel will always be solid color.
            image.data[c*4+3] = 255;
        }
    }

    // Draw the image!
    ctx.putImageData(image, 0, 0);
}
```

### Mouse Events

To really see anything happen, we're going to need some way to interact with the canvas.  
Let's make the mouse into a brush and draw onto the canvas!

We'll need to go back to initialization here and add another `addEventListener` call to listen for mouse events.

```js
function initialize() {
    // ... All the existing initialization code

    run();

    // Bind the 'mousemove' listener to make the mouse act like a brush.
    canvas.addEventListener('mousemove', event => {
        // The event tells us when the left mouse button is pressed, when buttons is 1.
        // So, this condition means that "if the left mouse button is not pressed, skip this code."
        // I.E. We'll only draw when the mouse button is pressed.
        if (event.buttons !== 1) {
            return;
        }

        // The event also tells us the mouse position relative to the element.
        // However, we need to account for the fact that the style sheet is distorting the canvas.
        // This calculation uses the event data, the canvas properties, and the width / height in
        // pixels that we want the result to be within to find the x and y values.
        const x = Math.round(event.offsetX * (width / canvas.offsetWidth));
        const y = Math.round(event.offsetY * (height / canvas.offsetHeight));

        // Set the cell to alive!
        buffers[target_buffer][coordinate_index(x, y)] = 1;
    });
}
```

> Now is a good time to refresh the browser and try your code out.  
> If everything is working, you should be able to draw on the canvas by clicking and dragging.  
> If it doesn't work, don't despair. Open the console and look for error messages.  
> If there are no error messages, either add `console.log` statements or use the [chrome dev tools debugger](https://developers.google.com/web/tools/chrome-devtools/javascript).

### The Game of Life Algorithm

OK, we've got a live canvas that is constantly rendering all our cells.  
Now we can implement game of life.

Here's a reminder of the rules from earlier:

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

We're going to need to break these rules down into boolean conditional expressions.  
I know, big words, I'm full of them.

All I mean is, we need a set of concrete statements that *javascript* understands, not just us.  
Let's go through a rough translation of the conditions of each statements to conditional statements:

#### 1. Any live cell with *fewer than two* live neighbours dies, as if by underpopulation.

We need an expression like: "number of alive neighbours is less than 2".  
Let's assume we've calculated the number of living neighbours already. We'll call that `total`.  
So, our condition is: `total < 2`

#### 2. Any live cell with *two or three* live neighbours lives on to the next generation.

Similarly, we can turn this statement into two conditional expressions: `total == 2` and `total == 3`  
To actually use this as a single rule, we can use the operator `||` which means "or" in english.  
So, our condition is: `total == 2 || total == 3`

#### 3. Any live cell with more than three live neighbours dies, as if by overpopulation.

Easy, `total > 3`.

#### 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

Super easy, `total == 3`.

> Why == and not = you might be asking?  
> We're already using = to mean assign the value on the right, to the value on the left.  
> So, == means 'test for equality', and = means 'assign a variable'.

#### Pulling that together

We've got options on how we write this all as code, however, we can actually get away with much less code than you might be thinking. If you just implemented this from what we did above, you might end up with something like:

```js
if (total < 2) {
    return 0; // kill the cell
}

if (total == 2 || total == 3) {
    return cells[coordinate_index(x, y)]; // live on.
}

if (total > 3) {
    return 0; // kill the cell
}

if (total == 3) {
    return 1; // a cell is born
}
```

However, there is a bug in that code, and it's quite verbose. (Feel free to try and figure out the bug, it's a good exercise.)

Instead, we can simplify those conditions by looking at which expressions have cross over, and use the `switch` expression to execute some code based on what value the total is:

```js
switch (total) {
    case 2:
        // When just 2 neighbours are alive, we either live on or make no change.
        return cells[coordinate_index(x, y)];
    case 3:
        // When exactly 3 neighbours are alive, the cell *must* be alive.
        return 1;
    default:
        // In all other conditions, the cell must be dead.
        return 0;
}
```

You'll also see this simplification on Wikipedia, and I think it's fun to prove that this simplified rule set is the same as the 4 rules we started with.

### Implementing Game of Life

Right, let's turn this all into concrete code.  
We'll count the number of living neighbours and then use the switch expression we wrote above.

```js
function game_of_life(cells, x, y) {
    let total = 0;

    for (let y_offset = -1; y_offset <= 1; y_offset++) {
        for (let x_offset = -1; x_offset <= 1; x_offset++) {
            if (x_offset == 0 && y_offset == 0) {
                continue;
            }

            total += cells[coordinate_index(x + x_offset, y + y_offset)];
        }
    }

    switch (total) {
        case 2:
            return cells[coordinate_index(x, y)];
        case 3:
            return 1;
        default:
            return 0;
    }
}
```

Done.  
That was easy!

> Now would be a good time to refresh your browser and see what's what.  
> If you have the console open, you should have the game of life working!  
> Play around!  
> Push this work to github to save it!

### Some Improvements

This project can be extended in hundreds of ways. To list a few:

* Add a pause / play button so that you can draw individual pixels.
* Clean up the initialization code.
* Fix the bug where, if you close the console, drawing in the game of life stops working so well.
* Implement [other cellular automata rule sets](http://psoup.math.wisc.edu/mcell/rule_starwars.html) (this is a fun challenge).
* Add controls for how fast the simulation runs, or how wide your mouse brush is.
* Implement WebGL based rendering so that you can render the pixels faster or prettier (this one is hard).

For now, let's just fix the bug. What bug? Well, close the console and try using your game again. You should notice that drawing is not very inconsistent. You should also notice that earlier, I had you implement a draw line function, and then we never used it. Coincidence? Nope.

So what's the bug? When the console is open vs when it's close, Chrome will send events from the mouse to your code at different rates. There are reasons for why this happens, and most of them are to do with making debugging code more consistent, while making running code faster. So, we need to cope with the slower events we're getting with the console closed.

If we remembered the last position that the mouse was at, we could use `draw_line` to set all the cells as alive between that point and the new point we are at. So let's do that!

```js
let canvas, ctx;
let width, height;
let buffers, target_buffer;
let previous_mouse_x, previous_mouse_y;

// ...

function initialize() {
    // ...

    run();

    // This new event will initialize our global previous mouse position tracking variables.
    // If we didn't do this, our first line when we clicked the page would always start
    // from the top left corner.
    window.addEventListener('mousedown', event => {
        previous_mouse_x = Math.round(event.offsetX * (width / canvas.offsetWidth));
        previous_mouse_y = Math.round(event.offsetY * (height / canvas.offsetHeight));
    });

    // We can modify our mouse move event to use draw line, and update the previous mouse
    // position tracking variables.
    canvas.addEventListener('mousemove', event => {
        if (event.buttons !== 1) {
            return;
        }

        const x = Math.round(event.offsetX * (width / canvas.offsetWidth));
        const y = Math.round(event.offsetY * (height / canvas.offsetHeight));

        draw_line(x, y, previous_mouse_x, previous_mouse_y);

        previous_mouse_x = x;
        previous_mouse_y = y;
    });
}
```

## DONE!

Cool, you've done a lot!  
Give yourself a pat on the back, grab a drink, bask in the glory of being a *computer wizard*.

With any luck you finished before the people doing the C# project (if anyone is) so make sure to brag to them. If not, brag anyway. Game of life is cool and event handling is hard.

There's more you can do in javascript, however, from here you'd likely want to learn about js frameworks like jsQuery, Angular, or React. You can also try derivative languages like typescript. Very few people write javascript with no frameworks, no libraries, raw and to the browser like this. However, learning javascript from the ground up like this will give you a much firmer foundation to approach those frameworks from. Ultimately, under all their paint, they are still javascript at the core.

I'd also consider reading the finished project in this repository. I've done some minor cleanup that may interest you.

*Thanks for the all the Fish.*
