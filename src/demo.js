

const ipfs = require('./MultiImage');
const Parser = require('./cfgParser');
const Processor = require('./ImageProcessing');

const basquiat = require('./lib')();



async function main() {

    const renderButton = document.getElementById("render");
    renderButton.addEventListener("click", render);

}

async function render(){

    const file = document.getElementById("input").files[0];
    const config_in = document.getElementById("config").innerText.split(/\r?\n/)

    // const basquiat = await basquiat_lib.init();
    // const cid = await basquiat.batch_resize(file, config_in)

    const obj = Buffer.from(await file.arrayBuffer());
    const cid = await basquiat.batch_resize_buffer(obj, file.name, config_in);

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