const IPFS = require("ipfs");

class MultiImage {
    constructor(ipfsNode, original_name) {
        this.node = ipfsNode;
        this.cid = null;
        this.root = null;
        this.versions = Array();
        this.name=original_name;
    }

    async add(data){
        let DAGnode = await this.node.add(data);
        DAGnode = await DAGnode.next();
        DAGnode = DAGnode.value;
        // console.log(DAGnode);
        return DAGnode;
    }

    async addOriginal(data){
        this.root = await this.add(data);
        this.cid = this.root.cid;
    }

    async addChild(image, linkname){
        const DAGnode = await this.add(image);
        const size = DAGnode.size;
        this.versions.push(linkname);
        this.cid = await this.node.object.patch.addLink(this.cid, {
            name: linkname,
            size: size,
            cid: DAGnode.cid
        });
        console.log("Added link to ", linkname);
    }

    async generate_html(){
        let output_text = `<html><head><style> img {{ padding: 10px; }} </style><title>${this.name}</title></head><body>\n<h1><a href='.'>${this.name}</a> - Basquiat Generated Thumbnails</h1>\n<table>\n<tr><th>Thumbnail</th><th>Info</th></tr>`;
        for (let i=0; i<this.versions.length; i++){
            output_text = `${output_text}\n<tr><td><a href='${this.versions[i]}'><img src='${this.versions[i]}'/></a></td><td>${this.versions[i]}</td></tr>`
        }
        output_text = `${output_text}\n</table>\n<hr /><p>Generated by <a href='https://github.com/fission-suite/basquiat'>basquiat, image resizing for IPFS</a>.</p></body></html>`;
        await this.addChild(output_text, "thumbnails.html");
    }
}

async function init(){
    const ipfsNode = await IPFS.create({ repo: String(Math.random() + Date.now()) });
    console.log("ipfs node is ready");
    return ipfsNode
}

exports.init = init;
exports.MultiImage = MultiImage;