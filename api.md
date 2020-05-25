## Classes

<dl>
<dt><a href="#Basquiat">Basquiat</a></dt>
<dd><p>Main API object</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#init">init()</a> ⇒ <code><a href="#Basquiat">Basquiat</a></code></dt>
<dd><p>Instantiates the library API and returns a Basquiat object</p>
</dd>
</dl>

<a name="Basquiat"></a>

## Basquiat
Main API object

**Kind**: global class  
<a name="Basquiat+batch_resize_buffer"></a>

### basquiat.batch\_resize\_buffer(buffer, image_name, config, render_html)
Produces different versions of the same image and adds those to ipfs, returning an ipfs CID.

**Kind**: instance method of [<code>Basquiat</code>](#Basquiat)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| buffer | <code>ArrayBuffer</code> |  | The input image |
| image_name | <code>string</code> |  | A name for the image |
| config | <code>string</code> |  | The config string, following basquiat spec. |
| render_html | <code>boolean</code> | <code>true</code> | Generate thumbnails.html |

<a name="init"></a>

## init() ⇒ [<code>Basquiat</code>](#Basquiat)
Instantiates the library API and returns a Basquiat object

**Kind**: global function  
**Returns**: [<code>Basquiat</code>](#Basquiat) - - An instantiated API object  
