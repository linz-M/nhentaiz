// our dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const nhentai = require('nhentai-js');
let fs = require('fs');
let request = require('request');
const imgToPDF = require('image-to-pdf');
const path = require('path');
const nHentaiAPI = require('nhentai-api-js');
let api = new nHentaiAPI();
const app = express();

async function getDoujin(id) {

  const PDFpages = []; //name of pages will be stored here, later to smash it all together to make PDF
  const directory = 'temp_images'; // name of the directory where temp_image files will be stored to make PDF
  let pages_array = [];

  try {

    console.log('\x1b[41m%s\x1b[0m', 
      `Welcome To 『 KODE NUKLIR TO PDF :V 』`);
    console.log('\x1b[41m%s\x1b[0m', 
      `        『 Created By Somnath Das, @samurai3247 [Instagram] 』`);
    console.log('\x1b[44m%s\x1b[0m', 
      `Processing and Converting your Code, Please Wait, senpai uwu`);

    // To Create Directory named "temp_images"
    fs.mkdir("temp_images", (damn_error) => {
            if(damn_error) {
              if(damn_error.hasOwnProperty('errno') && damn_error['errno'] == '-17') {
                console.log("Directory already exists");
              } else {
              console.log(damn_error);
              }
            } else if(!damn_error){
              console.log("Created New Directory To Store Images");
            }
          });

    if(nhentai.exists(id)) { // Checks if Doujin exists

        const dojin = await nhentai.getDoujin(id);
        pages_array = dojin.pages;
        let title = dojin.title;
        let download_count = 0;

      // pages_array directly refers to an array of links of the images of the pages.
        pages_array = dojin.pages;

      // To download images from the direct url present in pages_array
        console.log(`Doujin title: ${title}`);
        console.log("Downloading...")
        for (let i = 0; i < pages_array.length; i++) {
          image_name = 'temp_images/image' + i + '.jpg';
          await new Promise((resolve) => request(pages_array[i]).pipe(fs.createWriteStream(image_name)).on('finish', resolve))
          PDFpages.push(image_name);
          download_count++;
          console.log(`Downloading: ${download_count} out of ${pages_array.length}`)
        }

    // To convert images into pdf file using an API named "image-to-pdf"
        imgToPDF(PDFpages, 'A4').pipe(fs.createWriteStream(title + '.pdf'));

    // To Read the temp_images directory, collect the name of files in there and delete image files after using them
        try {
          fs.readdir(directory, (err, files) => {
          if (err) throw err;

          for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
            });
          }
          });

        }catch(eRR) {
          console.log(eRR);
        }

    } else { // Responds if doujin doesn't exists
      console.log("Nuke Code doesn't exists, bakka shi nee *^*")
    }
    
  }catch(err) {
    console.log(err);

  }finally {
    console.log("Completed");        
  }
}








app.use(cors());
// app.options('*', cors()) // TODO: Add whitelisting

//Config bodyparser to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// from top level path e.g. localhost:3000, this response will be sent
app.get('/', (request, response) => response.send('Hello World'));

//Basic GET request
app.get("/hello", function(req, res) {
  if(!req.query.name) {
      return res.send({"status": "error", "message": "missing a parameter"});
  } else {
      return res.send({'message':"Welcome back, "+req.query.name});
  }
});

app.get("/nhentai/pdf", function(req, res) {
  if(!req.query.code) {
      return res.send({"status": "error", "message": "missing parameter code"});
  } else {
  	let doujin_id = req.query.code;
      getDoujin(doujin_id);
      return res.sendFile(__path+ `/${doujin_id}.pdf`)
  }
});

app.get("/nhentai/search", function(req, res) {
  if(!req.query.title) {
      return res.send({"status": "error", "message": "missing a parameter title "});
        } else {
  	api.search(req.query.title)
      .then(data => console.log(data)
      return res.json({data}));
}
});

// set the server to listen on port 3000
app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));

