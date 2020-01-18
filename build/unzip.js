var axios = require("axios");

axios.get('https://biehler-josef.de/zip.php')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });