async function upload() {
    var ftpClient = require('ftp-client'),
    config = {
        host: process.env.FTP_SERVER,
        user: process.env.FTP_USER,
        password: process.env.FTP_PWD,
        port: 21,
        secure: true
    },
    options = {
        logging: 'basic'
    },
    client = new ftpClient(config, options);

    client.connect(function () {

        client.upload(['dist/**'], '/', {
            //baseDir: 'test',
            overwrite: 'older'
        }, function (result) {
            console.log(result);
        });
    });
  }

  upload()