/**
 * This class copies the interface from Controller.js and extends it to add support for Buzz controller lights.
 */
var BuzzController = Controller;
const hid_supported = "hid" in window.navigator;

Object.defineProperty(BuzzController, "light_state", {
    get: function () {
        return this._light_state;
    },
    set: function (newData) {
        this._light_state = newData % 15;
        setLights.bind(this);
        setLights(this._light_state);
    }
});

Object.defineProperty(BuzzController, "lights", {
    get: function () {
        return this._light_state;
    },
    set: function (newData) {
        //TODO HID setup
        let data_type = ""+ typeof newData;
        this._light_mode = data_type;
        switch(data_type) {
            case "boolean":
                //all on or all off
                this.light_state = newData ? 15 : 0;
                break;
            case "number":
                //set based on the 4 binary columns
                this.light_state = newData;
                break;
            case "object": // assumes array
                //TODO: handle sequence array
                break;
            case "function":
                //TODO: handle transform function
                break;
        }
    }
});

console.log("B", Object.getOwnPropertyNames(BuzzController));

async function runHIDSetup() {
    if (hid_supported) {
        let hid_gamepads = await navigator.hid.getDevices();
        if (hid_gamepads.length == 0) {
            hid_gamepads = await navigator.hid.requestDevice({
                filters: [
                    {
                        vendorId: 0x054c, //Logitech wired PS2 controller
                        productId: 0x0002,
                    },
                    {
                        vendorId: 0x1356, //wireless playstation controller
                        productId: 0x4096,
                    },
                    {
                        vendorId: 0x54c, // unknown other controller
                        productId: 0x1000,
                    }
                ],
            });
        }
        if (hid_gamepads) {
            this.hid_device = hid_gamepads[0];
            // console.log(hid_gamepad);
            if (!this.hid_device.opened) {
                await this.hid_device.open();
            }
        }
    }else{
        console.log("not supported!");
    }
}

async function setLights(state) {
    // if there is no device the first time, find one.
    if (!this.hid_device) {
        runHIDSetup.bind(this);
        await runHIDSetup();
    }
    //if there is still no device, fail.
    if (!this.hid_device) {
        console.error("No HID device to send light states to.");
        return;
    }
    state %= 15;
    //convert the decimal coerced number back to binary digits
    let binVal = (state >>> 0).toString(2).padStart(4, 0);
    let arr = [0]; //padding of one unit
    for (let digit of binVal) {
        arr.push(digit);
    }
    this.hid_device.sendReport(0, Uint8Array.from(arr));
}