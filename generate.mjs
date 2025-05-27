import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import * as path from "node:path";

const decompPath = "decomp/";
const assetsPath = "assets/";

if (!fsSync.existsSync(decompPath + "global.gd")) {
	throw new Error(`${decompPath + "global.gd"} does not exist! Make sure you are running this in the right directory and you put your Branches decomp in that folder.`)
	
}

// get version from decompiled code
const globalCode = await fs.readFile(decompPath + "global.gd", {encoding: "utf-8"});
const version = globalCode.match(/var\s+version\s*=\s*"(.+?)"/s)[1];

const code = await fs.readFile(import.meta.filename, {encoding: "utf-8"});

function escapeHTML(text) {
	text = text.replaceAll("&", "&amp;");
	text = text.replaceAll("<", "&lt;");
	text = text.replaceAll(">", "&gt;");
	text = text.replaceAll('"', "&quot;");
	return text;
}

await fs.rm(assetsPath, {force: true, recursive: true});
console.log("Cleaned assets folder.");

let html = "";
html += `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="icon" href="${assetsPath}newicon.png" />
		<title>Every BFDI Branches Image</title>
		<style>
			body {
				background: black;
				color: white;
				font-family: system-ui, sans-serif;
				color-scheme: dark;
			}
			table {
				width: 100%;
				max-width: 100%;
				border-collapse: collapse;
			}
			table, thead, tbody, tr, td {
				border: solid 1px white;
			}
			thead {
				border: solid 1px white;
			}
			th {
				position: sticky;
				top: 0;
				padding: 0;
				margin: 0;
			}
			thead, th {
				background: #410;
			}
			img {
				max-width: 100%;
			}
			
			details {
				margin-bottom: 1em;
			}
			pre {
				padding: 1em;
				border-radius: 0.5em;
			}
			.inline-code {
				padding: 0.15em 0.33em;
				border-radius: 0.25em;
			}
			pre, .inline-code {
				background: #333;
			}
		</style>
	</head>
	<body>`;
html += `
<h1>Every BFDI Branches Image (as of v${version})</h1>
<p>For use in NPC <code class="inline-code">[img]</code> tags.</p>
<p>Page made by CST1229. You can Ctrl+F this page!</p>
<p>Image previews are limited to the size of the screen to keep this page somewhat readable, as some of them are very large. You might have to downscale them when using them in NPCs. Relevant syntax from <a target="_blank" href="https://docs.godotengine.org/en/stable/tutorials/ui/bbcode_in_richtextlabel.html">the Godot docs</a>:</p>
<pre><code>[img]{path}[/img]
[img={width}]{path}[/img]
[img={width}x{height}]{path}[/img]
[img={valign}]{path}[/img]
[img <a href="https://docs.godotengine.org/en/stable/tutorials/ui/bbcode_in_richtextlabel.html" target="_blank">{options}</a>]{path}[/img]</code></pre>
<p>The source code that generated this page: <a target="_blank" href="https://github.com/CST1229/EveryBranchesImage">https://github.com/CST1229/EveryBranchesImage</a></p>
<table><thead><tr>
<th scope="col">Path</th>
<th scope="col">Image</th>
</tr></thead><tbody>`;
for await (const rawPath of fs.glob([decompPath + "**/*.png", decompPath + "**/*.svg", decompPath + "**/*.jpg"])) {
	const relativePath = rawPath.replaceAll("\\", "/").replaceAll(decompPath, "");
	const resPath = "res://" + relativePath;
	
	// the invite in this image expired but just to be safe
	// it's literally just some text anyways, not very useful for creators
	if (resPath === "res://assets/ui/hmm.png") continue;
	
	const dir = path.dirname(assetsPath + relativePath);
	await fs.mkdir(dir, {recursive: true});
	await fs.copyFile(rawPath, assetsPath + relativePath);
	console.log(`Copied ${resPath}.`);
	
	html += `<tr><td><code class="inline-code">${resPath}</code></td><td><img loading="lazy" src="${assetsPath + relativePath}"></td>`;
}
html += "</tbody><table></body></html>";

await fs.writeFile("index.html", html);
console.log("Written to index.html.");