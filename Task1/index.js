//Command to run, and should be in the following pattern
//node index.js dir result.txt

const fs = require('fs');
const arguments = process.argv.slice(2);
console.log("the path args", arguments);

const path = require('path');
const crypto = require('crypto');

//This iterates through directory, to give the required hash output
function crawlFile(dir, outputFile) {
    fileWriter('[+]' + dir + '\n', outputFile);
    var files = fs.readdirSync(dir);
    for (file of files) {
        let next = path.join(dir, file);
        if (fs.lstatSync(next).isDirectory() === true) {
            crawlFile(next, outputFile);
        }
        else {
            let output = next + "\t-[MD5]->" + hashGenerator(next, "md5") + "t-[SHA!]->" + hashGenerator(next, "sha1") + "\n";
            fileWriter('\t -' + output, outputFile);
        }
    }
}

//This generates the Hash Value
function hashGenerator(file, algo) {
    let fileBuffer = fs.readFileSync(file);
    let sum = crypto.createHash(algo);
    sum.update(fileBuffer);
    return sum.digest('hex');
}

//This stores the result in the output file
const outputFile = process.argv.slice(2)[1];

function fileWriter(data){
    fs.appendFileSync(outputFile, data);
}

//The Main function, starting one 
try{
    if(arguments.length !=2){
        console.log("Give all the appropriate parameters");
    }
    else if(fs.statSync(arguments[0]).isDirectory() === false){
        console.log("Give the directory path as paramameter not a file");
    }
    else{
        let outputFilePath = arguments[1];
        fs.writeFileSync(outputFilePath, `Code Executed at ${Date()}\n`);
        let directoryInputPath = arguments[0];
        crawlFile(directoryInputPath, outputFilePath);
        console.log("The Output is stored in the given file path ...")
    }
}
catch(error) {
    console.log(error);
    console.log("Error-404 (File not found");
}