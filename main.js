function Control(
    el,
    {
        value = 0,
        step = 1,
        max = 100,
        min = 0,
        maxAngle = 360,
        minAngle = 0,
    } = {}
) {
    const img = document.createElement("img");
    img.src = "./1@3xNew.png";
    img.width = "200";
    el.append(img);
    const ratio = (maxAngle - minAngle) / (max - min);
    const value2Deg = () => ratio * (value - min) + minAngle;
    const changeValue = (delta, fireEvent = false) => {
        let newValue = value + delta;
        if (newValue >= max) newValue = max;
        if (newValue <= min) newValue = min;
        value = newValue;
        //console.log(value)
        if (fireEvent && this.onChange && typeof this.onChange === "function") {
            this.onChange(value);
        }
        img.style.transform = `rotate(${value2Deg()}deg)`;
        img.style.transformOrigin = `50% 50%`;
    };
    const { top, left } = img.getBoundingClientRect();
    changeValue(0);
    img.onmousewheel = (e) => {
        changeValue((e.deltaY * step) / 25, true); // "/25" - это для  лучшей чуствительности для мышки
        e.preventDefault();
    };
    let startDragAngle;
        const calcAngle = ({ layerX, layerY }) => {
        const deltaX = layerX - img.width / 2;
        const deltaY = layerY - img.height / 2;
        return (Math.atan2(deltaY, deltaX) / Math.PI) * 180;
    };
    img.onmousedown = (e) => {
        startDragAngle = calcAngle(e);
        e.preventDefault();
    };
    img.onmousemove = (e) => {
        if (startDragAngle !== undefined) {
            const currentAngle = calcAngle(e);
            let deltaAngle = currentAngle - startDragAngle;

            // дальше идет коррекция перехода через +-180 градусов
            // но из-за функции onclick осталось иногда подергивание
            // при выкручивании в крайние положения
            // onclick пришлось отключить
            if (Math.abs(deltaAngle) >= 180) {
                deltaAngle += deltaAngle < 0 ? 360 : -360;
            } else {
                deltaAngle += deltaAngle < 0 ? -360 : 360;
            }
            deltaAngle = Math.round(deltaAngle % 360);

            changeValue(deltaAngle / ratio, true);
            startDragAngle = currentAngle;
            e.preventDefault();
        }
    };
    img.onmouseup = img.onmouseout = (e) => {
        if (startDragAngle) {
            startDragAngle = undefined;
            e.preventDefault();
        }
    };
    this.setValue = (v) => changeValue(v - value);
    this.changeValue = changeValue;
    this.getValue = () => value;
}
const audio = document.getElementById("myaudio");
// для пробы коррекции перехода через +-180 сделал крутилку на 2 оборота
const volumeControl = new Control(volume, {
    max: 1,
    min: 0,
    step: 0.01,
    maxAngle: 720,
});
volumeControl.onChange = (value) => {
    audio.volume = value;
    volumeLevel.value = value;
    console.log("VOLUME ", volumeLevel.value);
};
volumeLevel.oninput = () => {
    audio.volume = volumeLevel.value;
    volumeControl.setValue(audio.volume);
    console.log("VOLUME ", volumeControl.getValue());
};
volumeLevel.value = 0;
audio.volume = 0;
const setGradient = function () {
    redGradient.style.background = `linear-gradient(to right, rgb(0, ${greenControl.getValue()}, ${blueControl.getValue()}),
                                                                rgb(255, ${greenControl.getValue()}, ${blueControl.getValue()}))`;
    greenGradient.style.background = `linear-gradient(to right, rgb(${redControl.getValue()}, 0, ${blueControl.getValue()}),
                                                                rgb(${redControl.getValue()}, 255, ${blueControl.getValue()}))`;
    blueGradient.style.background = `linear-gradient(to right, rgb(${redControl.getValue()}, ${greenControl.getValue()}, 0),
                                                                rgb(${redControl.getValue()}, ${greenControl.getValue()}, 255))`;
};
const redControl = new Control(redDiv, {
    max: 255,
    maxAngle: 150,
    minAngle: -150,
});
redControl.onChange = (value) => {
    redDiv.setAttribute("style", `background : rgba(255, 0, 0, ${value / 255}); border-radius: 50%`);
    rgbDiv.setAttribute("style", `background : rgb(${value}, ${greenLevel.value}, ${blueLevel.value})`);
    redLevel.value = Math.round(value);
    setGradient();
    console.log("RED", Math.round(value));
};
redLevel.oninput = () => {
    redControl.onChange(redLevel.value);
    redControl.setValue(Math.round(redLevel.value));
};
redLevel.value  = 0;
redGradient.style.background = "linear-gradient(ti right, rgb(0,0,0), rgb(255,0,0))";

const greenControl = new Control(greenDiv, {
    max: 255,
    maxAngle: 150,
    minAngle: -150,
});
greenControl.onChange = (value) => {
    greenDiv.setAttribute("style", `background : rgba(0, 255, 0, ${value / 255}); border-radius: 50%`);
    rgbDiv.setAttribute("style", `background : rgb(${redLevel.value}, ${value}, ${blueLevel.value})`);
    greenLevel.value = Math.round(value);
    setGradient();
    console.log("GREEN", Math.round(value));
};
greenLevel.oninput = () => {
    greenControl.onChange(greenLevel.value);
    greenControl.setValue(Math.round(greenLevel.value));
};
greenLevel.value  = 0;
greenGradient.style.background = "linear-gradient(ti right, rgb(0,0,0), rgb(0,255,0))";


const blueControl = new Control(blueDiv, {
    max: 255,
    maxAngle: 150,
    minAngle: -150,
});
blueControl.onChange = (value) => {
    blueDiv.setAttribute("style", `background : rgba(0, 0, 255, ${value / 255}); border-radius: 50%`);
    rgbDiv.setAttribute("style", `background : rgb(${redLevel.value}, ${blueLevel.value} ${value})`);
    blueLevel.value = Math.round(value);
    setGradient();
    console.log("BLUE", Math.round(value));
};
blueLevel.oninput = () => {
    blueControl.onChange(blueLevel.value);
    blueControl.setValue(Math.round(blueLevel.value));
};
blueLevel.value  = 0;
blueGradient.style.background = "linear-gradient(ti right, rgb(0,0,0), rgb(0,0,255))";

rgnDiv.setAttribute("style", "background: rgb(0, 0,0)");