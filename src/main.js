

const MultiImage = require('./MultiImage');
const Parser = require('./cfgParser');
const Processor = require('./ImageProcessing');



async function main() {

    const renderButton = document.getElementById("render");
    renderButton.addEventListener("click", render);

}

async function render(){
    const file = document.getElementById("input").files[0];
    const obj = Buffer.from(await file.arrayBuffer());
    const output = await MultiImage.init();
    await output.addOriginal(obj);

    const cfg_parser = new Parser();
    const configs = cfg_parser.parse();

    const original = await loadImage(URL.createObjectURL(file));
    const dimensions = {
        "width" : original.naturalWidth,
        "height" : original.naturalHeight
    }

    const processor = new Processor(original, dimensions);
    for (let i = 0; i<configs.length; i++){
        console.log("Processing config : ", configs[i])
        let result = await processor.resize(configs[i]);
        await output.addChild(result.data, result.name);
    }
    document.getElementById("cid").innerText = output.cid.toString();
}

async function getDataBuffer(url){
    const response = await fetch(url);
    if (response.ok){
        return Buffer.from(await response.arrayBuffer());
    }
}

function loadImage(src){
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", () => reject(img));
        img.src = src;
    })
}

main();