
// Start looking for gamepads
BuzzController.search();

var highlightColor = '140, 255, 216'; //default
var buzzHighlights = {
    "RED": "200,0,0",
    "BLUE": "0,0,200",
    "ORANGE": "200,140,0",
    "GREEN": "0,200,0",
    "YELLOW": "200,200,0"
};

var lightInterval = null;

function setLightFromArr(arr) {
    let state = parseInt(arr.join(""), 2);
    // console.log(arr, state);
    BuzzController.lights = state;
    //set the visual state of the player labels on the page
    for (let i = 1; i < 5; i++) {
        let player = `p${i}`;
        let id = `${player}-on`;
        let lbl = document.querySelector(`label[for='${id}'`);
        let on = arr[i - 1];
        lbl.classList[on ? "add" : "remove"]("light-on");
    }
}

window.addEventListener('load', function () {
    if (Controller.supported) {
        document.body.setAttribute('data-supported', 'true');

        // Initialize dat.GUI
        initDatGui();
    } else {
        document.body.setAttribute('data-supported', 'false');
    }

    if (BuzzController.lights_supported) {
        document.body.setAttribute('data-lights-supported', 'true');
        const resetInterval = () => {
            clearInterval(lightInterval);
            lightInterval = null;
        };
        const getMsInput = () => {
            let msEl = document.getElementById("presetMs");
            let min = msEl.min;
            let max = msEl.max;
            let val = Math.max(min, Math.min(max, msEl.value));
            msEl.value = val;
            return val;
        }
        let presets = {
            "none": resetInterval,
            "random": () => {
                resetInterval();
                lightInterval = setInterval(() => {
                    let arr = new Array(4);
                    arr.fill(0);
                    arr = arr.map(val => Math.random() < 0.5 ? 1 : 0);
                    setLightFromArr(arr);
                }, getMsInput());
            },
            "flash": () => {
                resetInterval();
                let state = true;
                lightInterval = this.setInterval(() => {
                    let arr = new Array(4);
                    arr.fill(state ? 1 : 0);
                    setLightFromArr(arr);
                    state = !state;
                }, getMsInput());
            },
            "walk": () => {
                resetInterval();
                let idx = 0;
                lightInterval = this.setInterval(() => {
                    let arr = new Array(4);
                    arr.fill(0);
                    arr[idx] = 1;
                    idx += 1;
                    idx %= 4;
                    setLightFromArr(arr);
                }, getMsInput());
            },
        };
        let presetSelect = this.document.getElementById("light-presets");
        presetSelect.innerHTML = "";
        for (let option in presets) {
            let el = document.createElement("option");
            el.innerText = el.value = option;
            presetSelect.appendChild(el);
        }
        this.window.addEventListener('gc.button.press', function (evt) {
            let presetEl = document.getElementById("light-presets");
            let selected = presetEl.options[presetEl.selectedIndex].text;
            let allowIndiv = selected.length && selected != "none" ? false : true;
            let indivs = document.querySelectorAll(".light-indiv-control");
            for (let control of indivs) {
                control.disabled = !allowIndiv;
            }
            if (selected.length) {
                presets[selected]();
            }
            if (!selected || selected == "none") {
                let stateArr = [];
                let light_press = document.getElementById("light-press").checked;
                for (let i = 1; i < 5; i++) {
                    let player = `p${i}`;
                    let id = `${player}-on`;
                    let el = document.getElementById(id);
                    let temp_on = light_press && evt.detail.name.toLowerCase().indexOf(player) == 0;
                    let on = temp_on ? !el.checked : el.checked;
                    stateArr.push(on ? 1 : 0);
                    //if this one should only be on temporarily, turn it off after some milliseconds
                    if (temp_on) {
                        setTimeout(() => {
                            let newState = el.checked ? 1 : 0;
                            stateArr[i - 1] = newState;
                            setLightFromArr(stateArr);
                        }, getMsInput());
                    }
                }
                setLightFromArr(stateArr);
            }
        }, false);
    } else {
        document.body.setAttribute('data-lights-supported', 'false');
    }
}, false);

// Input events
window.addEventListener('gc.button.press', updateButton, false);
window.addEventListener('gc.button.hold', updateButton, false);
window.addEventListener('gc.button.release', updateButton, false);
window.addEventListener('gc.analog.change', updateAnalog, false);

// Controller events
window.addEventListener('gc.controller.found', showControllerTables, false);
window.addEventListener('gc.controller.lost', destroyTable, false);


// Functions

function destroyTable(event) {

    if (Controller.controllerCount === 0) {
        document.getElementById('instructions').className = '';
    }

    var element = document.getElementById('controller_' + event.detail.index);

    element.className = 'controller hidden';
    element.addEventListener('transitionend', function () {
        element.parentElement.removeChild(element);
    }, false);
}

function makeControllerHeader(controller) {
    var header = document.createElement('h1');
    header.className = 'padded';
    header.innerHTML = controller.name + ': Index ' + (controller.index);

    return header;
}

function makeButtonTable(buttons, index) {
    var buttonTable = document.createElement('div');
    buttonTable.className = 'table buttons';
    var buttonTableHead = '<header>\
            <div class="row header">\
                <div>Buttons</div>\
                <div>Pressed</div>\
                <div>Value</div>\
            </div>\
        </header>';
    buttonTable.insertAdjacentHTML('beforeend', buttonTableHead);

    for (var button in buttons) {
        var row = document.createElement('div');
        row.className = 'row';

        var label = document.createElement('div');
        var pressed = document.createElement('div');
        var value = document.createElement('div');

        label.innerHTML = buttons[button].name;

        pressed.id = index + '_' + buttons[button].name;
        pressed.innerHTML = buttons[button].pressed;

        value.id = index + '_' + buttons[button].name + '_value';
        value.innerHTML = buttons[button].value;

        row.appendChild(label);
        row.appendChild(pressed);
        row.appendChild(value);

        buttonTable.appendChild(row);
    }

    return buttonTable;
}

function makeAnalogStickTables(analogSticks, index) {
    var stickWrapper = document.createElement('div');
    stickWrapper.className = 'stick-wrapper';

    for (var stick in analogSticks) {

        var stickTable = document.createElement('div');
        stickTable.className = 'table sticks';

        var stickTableHead = document.createElement('header');
        stickTableHead.className = 'header padded';
        stickTableHead.innerText = analogSticks[stick].name;
        stickTable.appendChild(stickTableHead);

        var positionRow = document.createElement('div');
        positionRow.className = 'row';

        var positionRowSubhead = document.createElement('div');
        positionRowSubhead.className = 'row';

        var labelX = document.createElement('div');
        var labelY = document.createElement('div');

        labelX.innerText = 'Position X';
        labelY.innerText = 'Position Y';

        positionRowSubhead.appendChild(labelX);
        positionRowSubhead.appendChild(labelY);

        var valueX = document.createElement('div');
        var valueY = document.createElement('div');

        valueX.id = index + '_' + analogSticks[stick].name + '_x';
        valueX.innerHTML = analogSticks[stick].position.x;

        valueY.id = index + '_' + analogSticks[stick].name + '_y';
        valueY.innerHTML = analogSticks[stick].position.y;

        positionRow.appendChild(valueX);
        positionRow.appendChild(valueY);

        var angleRow = document.createElement('div');
        angleRow.className = 'row';

        var angleRowSubhead = document.createElement('div');
        angleRowSubhead.className = 'row';

        var labelDeg = document.createElement('div');
        var labelRad = document.createElement('div');

        labelDeg.innerText = 'Degrees';
        labelRad.innerText = 'Radians';

        angleRowSubhead.appendChild(labelDeg);
        angleRowSubhead.appendChild(labelRad);

        var deg = document.createElement('div');
        var rad = document.createElement('div');

        deg.id = index + '_' + analogSticks[stick].name + '_deg';
        deg.innerHTML = (isNaN(analogSticks[stick].angle.degrees)) ? '—' : analogSticks[stick].angle.degrees;

        rad.id = index + '_' + analogSticks[stick].name + '_rad';
        rad.innerHTML = (isNaN(analogSticks[stick].angle.radians)) ? '—' : analogSticks[stick].angle.radians;

        angleRow.appendChild(deg);
        angleRow.appendChild(rad);

        stickTable.appendChild(positionRowSubhead);
        stickTable.appendChild(positionRow);

        var visualisation = '<div class="row padded">\
            <div class="analog-vis" id="' + index + '_' + analogSticks[stick].name + '">\
                <div></div>\
            </div>\
        </div>';
        stickTable.insertAdjacentHTML('beforeend', visualisation);

        stickTable.appendChild(angleRowSubhead);
        stickTable.appendChild(angleRow);

        stickWrapper.appendChild(stickTable);
    }

    return stickWrapper;
}

function showControllerTables(event) {

    if (Controller.controllerCount === 1) {
        document.getElementById('instructions').className = 'hidden';
    }

    var controller = event.detail.controller;

    var wrapper = document.createElement('div');
    wrapper.className = 'controller hidden';
    wrapper.id = 'controller_' + controller.index;

    wrapper.appendChild(makeControllerHeader(controller));
    wrapper.appendChild(makeAnalogStickTables(controller.inputs.analogSticks, controller.index));
    wrapper.appendChild(makeButtonTable(controller.inputs.buttons, controller.index));

    document.querySelector('main').appendChild(wrapper);

    setTimeout(function () {
        wrapper.className = 'controller';
    }, 100);
}

function updateButton(event) {
    var detail = event.detail;

    if (event.type === 'gc.button.press') {
        //console.log('button.press');
        //console.log(detail);
        //debugger;
    }

    if (event.type === 'gc.button.hold') {
        //console.log('button.hold');
        //console.log(detail);
        //debugger;
    }

    if (event.type === 'gc.button.release') {
        //console.log('button.release');
        //console.log(detail);
        //debugger;
    }

    if (!document.getElementById(detail.controllerIndex + '_' + detail.name)) {
        return;
    }

    let buttnId = detail.controllerIndex + '_' + detail.name;
    let detailEl = document.getElementById(buttnId);
    detailEl.innerHTML = detail.pressed;
    let color = highlightColor;
    for (let colName in buzzHighlights) {
        if (detail.name.endsWith(colName)) {
            color = buzzHighlights[colName];
            console.log(colName, detail.name, color);
            break;
        }
    }

    let styleStr = `rgba(${color}, ${detail.pressed ? 0.6 : 0})`;
    console.log("styleStr",styleStr);
    detailEl.style.backgroundColor = styleStr;
    document.getElementById(buttnId + '_value').innerHTML = detail.value;
    document.getElementById(buttnId + '_value').style.backgroundColor = styleStr;
}

function updateAnalog(event) {
    var detail = event.detail;

    if (event.type === 'gc.analog.start') {
        //console.log('analog.start');
        //console.log(detail);
        //debugger;
    }

    if (event.type === 'gc.analog.hold') {
        //console.log('analog.hold');
        //console.log(detail);
        //debugger;
    }

    if (event.type === 'gc.analog.change') {
        //console.log('analog.change');
        //console.log(detail);
        //debugger;
    }

    if (event.type === 'gc.analog.end') {
        //console.log('analog.end');
        //console.log(detail);
        //debugger;
    }

    if (!document.getElementById(detail.controllerIndex + '_' + detail.name + '_x')) {
        return;
    }

    document.getElementById(detail.controllerIndex + '_' + detail.name).querySelector('div').style.transform = 'translate3d(' + (detail.position.x * 50) + 'px, ' + (detail.position.y * 50) + 'px, 0)';
    document.getElementById(detail.controllerIndex + '_' + detail.name + '_x').innerHTML = detail.position.x;
    document.getElementById(detail.controllerIndex + '_' + detail.name + '_y').innerHTML = detail.position.y;
    document.getElementById(detail.controllerIndex + '_' + detail.name + '_deg').innerHTML = (isNaN(detail.angle.degrees)) ? '—' : detail.angle.degrees + '°';
    document.getElementById(detail.controllerIndex + '_' + detail.name + '_rad').innerHTML = (isNaN(detail.angle.radians)) ? '—' : detail.angle.radians;

    document.getElementById(detail.controllerIndex + '_' + detail.name + '_x').style.backgroundColor = 'rgba(' + highlightColor + ', ' + Math.abs(detail.position.x) + ')';
    document.getElementById(detail.controllerIndex + '_' + detail.name + '_y').style.backgroundColor = 'rgba(' + highlightColor + ', ' + Math.abs(detail.position.y) + ')';
}

function initDatGui() {
    var Example = {};
    var gui = new dat.GUI();

    var settings = Controller.globalSettings.list();
    for (var name in settings) {

        if (typeof settings[name] !== 'object') {
            defineGetAndSet(name);
            Example[name] = settings[name];
        }

    }

    function defineGetAndSet(name) {
        Object.defineProperty(Example, name, {
            get: function () {
                return this['_' + name];
            },

            set: function (value) {
                if (name === 'mapAnalogToShape') {
                    var analogs = document.querySelectorAll('.analog-vis');

                    for (var i = 0; i < analogs.length; i++) {
                        var stick = analogs[i];
                        switch (value) {
                            case 'square':
                                stick.className = 'analog-vis square';
                                break;
                            case 'circle':
                                stick.className = 'analog-vis circle';
                                break;
                            default:
                                stick.className = 'analog-vis none';
                                break;
                        }
                    }
                }

                Controller.globalSettings[name] = value;
                this['_' + name] = value;
            }
        });
    }

    var f1 = gui.addFolder('Analog to D-pad');
    f1.add(Example, 'useAnalogAsDpad', ['left', 'right', 'both', 'none', false]);
    f1.add(Example, 'analogStickDpadThreshold', 0, 1);

    gui.add(Example, 'buttonThreshold', 0, 1);
    gui.add(Example, 'mapAnalogToShape', ['none', 'square']);

}
