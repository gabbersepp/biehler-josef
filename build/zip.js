var fs = require('fs');
var archiver = require('archiver');

var fileName =   'test.zip'
var fileOutput = fs.createWriteStream(fileName);
const archive = archiver('zip', { zlib: { level: 9 }});

fileOutput.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.pipe(fileOutput);
archive.glob("./dist/**/*"); //some glob pattern here
//archive.glob("../dist/.htaccess"); //another glob pattern
// add as many as you like
archive.on('error', function(err){
    throw err;
});
archive.finalize();