

const ipfs = require('./MultiImage');
const Parser = require('./cfgParser');
const Processor = require('./ImageProcessing');



async function main() {

    const renderButton = document.getElementById("render");
    renderButton.addEventListener("click", render);

}

async function render(){
    const file = document.getElementById("input").files[0];
    const original_name = file.name;
    const obj = Buffer.from(await file.arrayBuffer());
    const node = await ipfs.init();
    const output = new ipfs.MultiImage(node, original_name);
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
    await output.generate_html();
    const cid = output.cid.toString();
    document.getElementById("cid").innerText = `${cid}`;

    const div = document.getElementById("output");

    const anchor = document.getElementById("cid-gateway");
    anchor.setAttribute("href", `https://cloudflare-ipfs.com/ipfs/${cid}`);

    const thumbnails = document.getElementById("thumbnails-gateway");
    thumbnails.setAttribute("href", `https://cloudflare-ipfs.com/ipfs/${cid}/thumbnails.html`);

    div.hidden = false;
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