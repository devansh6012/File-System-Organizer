#!/usr/bin/env node
let inputArr = process.argv.slice(2); // array of arguments
let fs = require("fs");
let path = require("path");
// console.log(inputArr);
// node main.js tree "directoryPath"
// node main.js organize "directoryPath"
// node main.js help
let command = inputArr[0];
let types = {
    media: ["mp4","mkv","png"],
    archives: ['zip','rar','tar'],
    documents: ['docx','c','txt'],
    app: ['exe','pkg']
}
switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please 🙏 Input Right Command");
        break;
}

function treeFn(dirPath) {
    // console.log("Tree command implemented for ",dirPath);
    let destPath;
    if(dirPath == undefined){
        treeHelper(process.cwd(), "");  // current working directory()cwd
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist) {
            treeHelper(dirPath, "");
        }
        else{
            console.log("kindly enter the correct path");
        }
    }
}

function treeHelper(dirPath, indent) {
    // is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile == true){
        let fileName = path.basename(dirPath);
        console.log(indent + "|----" + fileName);
    } else{
        let dirName = path.basename(dirPath)
        console.log(indent + "|----"+ dirName);
        let childrens = fs.readdirSync(dirPath);
        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
            
        }
    }
}

function organizeFn(dirPath) {
    // console.log("Organize command implemented for ",dirPath);
    // 1. input -> diretory path given
    let destPath;
    if(dirPath == undefined){
        destPath = process.cwd();     // current working directory()cwd
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist) {

            // 2. create -> organized_files -> directory
            destPath = path.join(dirPath,"organized_path");
            if(fs.existsSync(destPath) == false){ // if doesn't exist then form the folder
                fs.mkdirSync(destPath);
                console.log("done");
            }
        }
        else{
            console.log("kindly enter the correct path");
        }
    }

    organizeHelper(dirPath, destPath);


}

function organizeHelper(src, dest){
    // 3. identify categories of all the files present in that input directory
    let childNames = fs.readdirSync(src);
    // console.log(childNames);
    for(let i = 0; i < childNames.length; i++){
        let childAdress = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childAdress).isFile();
        if(isFile){
            // console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            console.log(childNames[i],"belongs to -->",category);
            // 4. copy / cut files to that organized directory inside of any category folder
            sendFiles(childAdress, dest, category);
        }
    }
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1); // to remove dot(.)
    for(let type in types){
        // cTypeArray -> current type array
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if(ext == cTypeArray[i]){
                return type;
            }
        }
    }
    return "others";
}

function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    // to cut (delete the original ones)
    fs.unlinkSync(srcFilePath);
    console.log(fileName,"copied to",category);
}

function helpFn() {
    console.log(`
    List of All the commands:
                            node main.js tree "directoryPath"
                            node main.js organize "directoryPath"
                            node main.js help
    `);
}
