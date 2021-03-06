import fs from 'fs';
import Jimp = require('jimp');
import axios = require('axios');

const path =  require('path');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async (resolve, reject) => {

        try{
            // inspired by https://stackoverflow.com/questions/62217642/react-and-typescript-which-types-for-axios-response
            const imageBuffer:axios.AxiosResponse = await axios.default.get<Buffer>(inputURL, {responseType: 'arraybuffer'});

            const photo = await Jimp.read(imageBuffer.data);
            const outpath = path.join('/tmp', 'filtered.'+Math.floor(Math.random() * 2000)+'.jpg');
            await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname+outpath, (img)=>{
                resolve(__dirname+outpath);
            });
       }catch(e) {
        reject(`${e}`);
       }
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}