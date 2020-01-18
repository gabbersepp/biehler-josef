const request = require("request");
const fs = require("fs");
const path = require("path");
var options = {
    url: 'https://biehler-josef.de/upload.php',
    headers: {
        secret: process.env.JB_UPLOAD_SECRET
    }
}
var r = request.post(options, function optionalCallback (err, httpResponse, body) {
  // todo: fail if die() was called in php
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body);
})
var form = r.form()
form.append('zip-file', fs.createReadStream(path.join(__dirname, "..", 'test.zip')))