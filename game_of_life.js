
let playButton, canvas, ctx;
let width, height;
let buffers, target_buffer;
let running, last_frame_time, target_frame_time;
let previous_mouse_x, previous_mouse_y;

function coordinate_index(x, y) {
    return (y % height) * width + (x % width);
}

function draw_line(x, y, target_x, target_y) {
    while (x != target_x || y != target_y) {
        buffers[target_buffer][coordinate_index(x, y)] = 1;

        if (x > target_x) --x; else if (x < target_x) ++x;
        if (y > target_y) --y; else if (y < target_y) ++y;
    }
}

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

function update(input, output) {
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            output[coordinate_index(x, y)] = game_of_life(input, x, y);
        }
    }
}

function render(cells) {
    let image = ctx.createImageData(width, height);

    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            let c = coordinate_index(x, y);
            image.data[c*4+0] = (1 - cells[c]) * 255;
            image.data[c*4+1] = (1 - cells[c]) * 255;
            image.data[c*4+2] = (1 - cells[c]) * 255;
            image.data[c*4+3] = 255;
        }
    }

    ctx.putImageData(image, 0, 0);
}

function run() {
    let now = performance.now();

    if ((now - last_frame_time) > target_frame_time) {
        last_frame_time = now;

        if (running) {
            update(buffers[target_buffer], buffers[1 - target_buffer]);
        }

        render(buffers[target_buffer]);

        if (running) {
            target_buffer = 1 - target_buffer;
        }
    }

    window.requestAnimationFrame(run);
}

function initialize_from_document() {
    playButton = document.getElementById('play');
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    buffers = [[],[]];
    target_buffer = 0;
    last_frame_time = performance.now();
    target_frame_time = 15;
    running = true;

    for (let b = 0; b < buffers.length; ++b) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                buffers[b].push(0);
            }
        }
    }
}

function set_default_data() {
    draw_line(
        Math.round(width / 2 - 5),
        Math.round(height / 2 - 5),
        Math.round(width / 2 + 5),
        Math.round(height / 2 + 5)
    );
}

function bind_event_listener() {
    window.addEventListener('mousedown', event => {
        previous_mouse_x = Math.round(event.offsetX * (width / canvas.offsetWidth));
        previous_mouse_y = Math.round(event.offsetY * (height / canvas.offsetHeight));
    });

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

    playButton.addEventListener('click', () => {
        running = !running;
    });
}

function initialize() {
    initialize_from_document();
    set_default_data();
    run();
    bind_event_listener();
}

window.addEventListener('load', () => {
    initialize();
});
