const fs = require('fs')
const path = require('path');

const directoryPath = path.join(__dirname, 'screenshots\\Google.feature');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        if(file.includes('failed')){
            console.log(file);
        }
        
    });
});