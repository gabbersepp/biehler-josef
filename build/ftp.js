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
        logging: 'debug'
    },
    client = new ftpClient(config, options);

    client.connect(function () {

        client.upload(['dist/**'], '/', {
            baseDir: 'dist',
            overwrite: 'all'
        }, function (result) {
            console.log(result);
        });
    });
  }

  upload()