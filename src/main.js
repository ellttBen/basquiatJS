

// const IPFS = require('ipfs');
const MultiImage = require('./MultiImage');
const Parser = require('./cfgParser');
const Processor = require('./ImageProcessing');
// import MultiImage from "MultiImage";
// import init from "MultiImage";
// console.log("Hello world");



async function main() {

    // const node = await IPFS.create({ repo: String(Math.random() + Date.now()) });
    // console.log("ipfs node is ready");


    // const obj = await getDataBuffer("pictures/cat.jpg");
    // // console.log(obj);
    // const child = await getDataBuffer("pictures/640_400.jpg");
    // console.log(child);
    const renderButton = document.getElementById("render");
    renderButton.addEventListener("click", render);
    // const output = await MultiImage.init();
    // await output.addOriginal(obj);
    // await output.addChild(child, "640_400.jpg");
    //
    // const parser = new Parser();
    // const configs = parser.parse();

    // console.log(output.cid)

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