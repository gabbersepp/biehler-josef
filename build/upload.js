const request = require("request");
const fs = require("fs");
const path = require("path");
/*var options = {
  url: 'https://biehler-josef.de/upload.php',
  headers: {
    secret: process.env.JB_UPLOAD_SECRET
  }
}
var r = request.post(options, function optionalCallback(err, httpResponse, body) {
  // todo: fail if die() was called in php
  if (err || httpResponse.statusCode !== 200) {
    throw new Error(`upload failed: ${err} ${httpResponse.statusMessage}`);
  }
  console.log('Upload successful!  Server responded with:', body);
})
var form = r.form()
form.append('zip-file', fs.createReadStream(path.join(__dirname, "..", 'test.zip')))
*/
// upload zip
async function uploadAll() {
  uploadFile(path.join(__dirname, "..", 'test.zip'));
  const dirPath = path.join(__dirname, "..", "dist", "data", "images");
  const files = fs.readdirSync(dirPath);

  for(let i =0; i < files.length; i++) {
    let file = files[i];
    const wholePath = path.join(dirPath, file);
    await uploadFile(wholePath);
  }
}
function uploadFile(filePath) {
  return new Promise((resolve, reject) => {
    var options = {
      url: 'https://biehler-josef.de/upload.php',
      headers: {
        secret: process.env.JB_UPLOAD_SECRET
      }
    }
    var r = request.post(options, function optionalCallback(err, httpResponse, body) {
      if (err || httpResponse.statusCode !== 200) {
        throw new Error(`upload failed: ${err} ${httpResponse.statusMessage}`);
      }
      console.log(`Upload of '${filePath}' successful!  Server responded with:`, body);
      resolve(true);
    })
    var form = r.form()
    form.append('jbfile', fs.createReadStream(filePath))
  });
}

uploadAll()