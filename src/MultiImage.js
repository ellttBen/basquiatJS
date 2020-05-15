const IPFS = require("ipfs");

class MultiImage {
    constructor(ipfsNode) {
        this.node = ipfsNode;
        this.cid = null;
        this.root = null;
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
        this.cid = await this.node.object.patch.addLink(this.cid, {
            name: linkname,
            size: size,
            cid: DAGnode.cid
        });
        console.log("Added link to ", linkname);
    }
}

async function init(){
    const ipfsNode = await IPFS.create({ repo: String(Math.random() + Date.now()) });
    console.log("ipfs node is ready");
    return new MultiImage(ipfsNode)
}

exports.init = init;