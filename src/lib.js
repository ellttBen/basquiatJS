const ipfs = require('./MultiImage');
const Parser = require('./cfgParser');
const Processor = require('./ImageProcessing');

class Basquiat {
    constructor(){
        this.node = null;
    }

    async init(){
        this.node = await ipfs.init();
    }

    async batch_resize(image, config, render_html=true){
        const image_name = image.name;
        const obj = Buffer.from(await image.arrayBuffer());
        const output = new ipfs.MultiImage(this.node, image_name);
        await output.addOriginal(obj);
        const parser = new Parser(config);
        const configs = parser.parse();
        const original = await loadImage(URL.createObjectURL(image));

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
        if (render_html) {
            await output.generate_html();
        }
        return output.cid.toString()
    }
}

async function init(){
    const out = new Basquiat();
    await out.init();
    return out
}

function loadImage(src){
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", () => reject(img));
        img.src = src;
    })
}

module.exports.init = init;