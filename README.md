# BuzzController.js  

Modified from [Controller.js 1.0.2](https://github.com/jackcarey/buzz-controller.js)) to add support for Buzz quiz controller layout and lights.

*A library designed to make the Gamepad API easier to use for non-gaming applications.*

→ **[Controller.js documentation](https://github.com/jackcarey/buzz-controller.js/wiki)**  
<!-- → **[Try it out now](https://samiare.github.io/Controller.js)**   -->

## Features

* **[An event-driven interface](https://github.com/jackcarey/buzz-controller.js/wiki#1)**
* **[Standardized input names](https://github.com/jackcarey/buzz-controller.js/wiki#2)**
* **[Useful features and settings](https://github.com/jackcarey/buzz-controller.js/wiki#3)**

## Quick Start

1. Download the [lastest build](https://github.com/jackcarey/buzz-controller.js/releases/latest).
2. Unpack the ZIP file and copy the library and (optionally) the layouts add-on to your project files.
3. Include the library and layouts add-on just before your closing `<body>` tag:

    ```html
    <script src="path/to/Controller.min.js"></script>
    <script src="path/to/Controller.layouts.min.js"></script>
    <script src="path/to/BuzzController.min.js"><script>
    ```
4. Start listening for gamepads with `BuzzController.search()`.
5. [Read the documentation](https://github.com/jackcarey/buzz-controller.js/wiki) and build something cool.


## Compatibility

The main requirement of Controller.js is the Gamepad API itself. However it's only been tested and guaranteed to work in the following:

* **Chrome** 52+
* **Firefox** 48+
* **Edge** 14+

For up-to-date information on the status of the Gamepad API in browsers, check [Can I use](http://caniuse.com/#feat=gamepad).


---

The MIT License (MIT)

Copyright © 2016 [Samir Zahran](http://samiare.net)
