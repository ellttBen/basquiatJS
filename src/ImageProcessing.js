const pica = require("pica")();

class Processor {
    constructor(original, dimensions){
        this.original = original;
        this.original_dimensions = dimensions;
        this.root_canvas = document.createElement("canvas");
        this.root_canvas.width = dimensions.width;
        this.root_canvas.height = dimensions.height;
        let ctx = this.root_canvas.getContext("2d");
        ctx.drawImage(original, 0, 0);
    }

    async resize(config) {
        const target = document.createElement("canvas");
        let scale_ratio = null;
        let target_width = null;
        let target_height = null;
        if (config.type === "width"){
            target_width = config.dimension;
            scale_ratio = target_width/this.original_dimensions.width;
            target_height = Math.floor(scale_ratio * this.original_dimensions.height);

            target.width = target_width;
            target.height = target_height;
        } else if (config.type === "height"){
            target.height = config.dimension;
            scale_ratio = target.height/this.original_dimensions.height;
            target.width = Math.floor(scale_ratio * this.original_dimensions.width)
        }

        await pica.resize(this.root_canvas, target);
        const blob = await canvasToBlob(target);
        return {
            "data": Buffer.from(await blob.arrayBuffer()),
            "name": `${target.width}x${target.height}.jpg`
        };
    }
}

function canvasToBlob(canvas){
    return new Promise((resolve, reject) => {
        try {
            canvas.toBlob((blob) => resolve(blob), "image/jpeg");
        } catch (e){
            reject(e);
        }
    })
}

module.exports = Processor