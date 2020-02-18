# Tutorial-Game-of-Life

A simple tutorial for implementing [Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) in javascript.

## Requirements

* A browser (Preferably Chrome or Firefox)
* VS Code

## Getting started

We'll start with a HTML document to display the game in. Copy the following into a new file called `index.html`. This sets up some things we will need for our game:
* A `canvas` element where we can draw stuff
* A button so we can start and stop the simulation

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Game of Life</title>
    </head>
    <body>
        <canvas id="game" width="200" height="200">
            If you can read this, your browser does not support canvas.
        </canvas>

        <button id="play">▶️</button>
    </body>
</html>
```

You can now open `index.html` in a browser and see the button. Success!

## Adding some code

Now we have a blank page, let's write some code to draw on it. Create a blank javascript file called `game_of_life.js` next to your `index.html` file. Then tell the HTML file to run your code by adding a `script` element in the `head` block:

```html
<head>
    <title>Game of Life</title>
    <script src="game_of_life.js"></script>
</head>
```

Your browser will now load `game_of_life.js` when you reload `index.html`. To test it, we need to open the developer console. Press "CTRL + SHIFT + I" in the browser and you will see this screen. Open the "console" tab.

TODO image

Our script is empty, so we don't see anything. Try adding `console.log("Hello, world!")` to a new line in the javascript file and reload the page. If you see "Hello, world!" printed in the console, you know your code is being run! Hooray!

## Accessing the DOM

To do useful stuff in our code, we need to be able to manipulate the elements in our HTML file (also known as the DOM, or Document Object Model). 

The main functions we will be using to do this are

* [`window.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). This lets you specify code to be run when an event happens, for example when the page finishes loading.
* [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById). This lets us pick an individual element out of our HTML file, using the the ids we specified like `id="game"`.

Update `game_of_life.js` to use these functions

```js
function initialize() {
    console.log(document.getElementById("game"));
}

window.addEventListener('load', initialize);
```

This defines a function called `initialize`, and tells the browser to run it after the page has finished loading. The initialize function will print the `canvas` element we gave the id `game` to earlier. (Note that if we try running `initialize` *before* the page has finished loading, then our canvas won't exist yet, and it will print `null`!)

## Drawing to the screen

Now we have our canvas element in the javascript, we are ready to start drawing! To start with, we need to choose how we want to draw. We only need simple 2D graphics, but javascript also supports 3D.

```js
function initialize() {
    let canvas = document.getElementById('game');
    // This lets us get and write image data to and from the screen
    let ctx = canvas.getContext('2d'); 
    // An array of raw numbers representing individual pixels on the screen.
    let image = ctx.getImageData(0, 0, 5, 5);
    console.log(image);
}
```

> Run this again and open the console to inspect the image data you just read from the canvas.