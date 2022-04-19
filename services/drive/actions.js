const { createSecretKey } = require('crypto');
const fs = require('fs');
const { google } = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');
const path = require('path');
function generateID(auth) {
    const drive = google.drive({ version: "v3", auth });
    drive.files.generateIds({
        count: 1,
    }, function (err, res) {
        data = res.data;
        if (err) {
            //Handle error
            console.log(err);
        } else {
            console.log('Generated Id: ', data.ids[0]);
        }
    })
}

function listFiles(auth) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name, webContentLink)',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        files.map((file) => {
          console.log(`${file.name} (${file.id}) ${file.webContentLink}`);
        });
      } else {
        console.log('No files found.');
      }
    });
  }

  async function appendFile(auth,file_updated){
    const drive = google.drive({ version: "v3",auth});
    let data = null;
    var fileMetadata = {
        name: `representativo_${Date.now()}${path.extname(file_updated.originalname)}`,
        parents: ['1-V9u0fEtbT_m4mYmCd2sMIse9t1NqcW_'],//Id del folder
        
    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(file_updated.path),
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields : 'id, name, webContentLink',
    }, function (err,res){
        if (err){
            //Handle error
            console.log(err);
            res.status(404).send(err);
        }else {
            console.log('File Id: ',res.data);
            drive.permissions.create({
              fileId: res.data.id,
              requestBody:{
                type: 'anyone',
                role: 'reader'
              }
            }, function (error,response){
              
              if(error) console.log(error);
              else data=file;

            })
        }
    });
    return data;

}

  module.exports={
      generateID,
      listFiles,
      appendFile
  }