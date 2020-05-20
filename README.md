# BasquiatJS

A browser-ready implementation of [basquiat](https://github.com/fission-suite/basquiat).

You can find a live demo [here](https://elltben.fission.name/basquiat/)!
 
## Building

The ipfs node daemon *must* be running.

```shell script
$ git clone https://github.com/ellttBen/basquiatJS.git
$ cd basquiatJS
$ npm install
$ npm run release
```

The script outputs an ipfs CID which links to a simple in-browser demo.

## Known issues

- Basquiat only works in a [*Secure Context*](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts). This means that it should be accessed
through `https` or `localhost`. In the latest version of the ipfs daemon, accessing
content through the local gateway does not satisfy this.
To work around this, one should use a public ipfs gateway such as [cloudflare-ipfs](https://cloudflare-ipfs.com/), 
making sure to have the ipfs companion extension **disabled**.