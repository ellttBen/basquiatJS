const ipfs = require('./MultiImage');
const Parser = require('./cfgParser');
const Processor = require('./ImageProcessing');

/**
 * Instantiates the library API and returns a Basquiat object
 * @return {Basquiat} - An instantiated API object*/
function init(){
    return new Basquiat()
}

/**
 * Main API object*/
class Basquiat {

    /**
     * Produces different versions of the same image and adds those to ipfs, returning an ipfs CID.
     * @param {ArrayBuffer} buffer - The input image
     * @param {string} image_name - A name for the image
     * @param {string} config - The config string, following basquiat spec.
     * @param {boolean} render_html - Generate thumbnails.html*/
    async batch_resize_buffer(buffer, image_name, config, render_html=true){
        // const image_name = image.name;
        const node = await this.node;
        const obj = buffer;
        const output = new ipfs.MultiImage(node, image_name);
        await output.addOriginal(obj);
        const parser = new Parser(config);
        const configs = parser.parse();
        const blob = new Blob([buffer])
        const original = await loadImage(URL.createObjectURL(blob));

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

    constructor(){
        this.node = ipfs.init();
    }
}

/**@private*/
function loadImage(src){
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", () => reject(img));
        img.src = src;
    })
}

module.exports = init;