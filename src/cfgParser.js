class Parser {
    constructor(){
        this.raw = document.getElementById("config").innerText.split(/\r?\n/);
    }

    parse(){
        let configs = this.raw.map((el) => this.parse_line(el));
        configs = configs.filter((el) => el != null);
        console.log(configs);
        return configs
    }

    parse_line(line){
        const regExp = /(\d+|_)x(\d+|_)/;
        let match = regExp.exec(line);
        if (match == null) {
            return null
        }
        let width = match[1];
        let height = match[2];

        if (width === "_" && height === "_"){
            return resize_cfg("original", null);
        } else if (width === "_"){
            return resize_cfg("height", parseInt(height));
        } else {
            return resize_cfg("width", parseInt(width))
        }
    }
}

function resize_cfg(type, dimension){
    return {
        "type": type,
        "dimension": dimension
    }
}

module.exports = Parser