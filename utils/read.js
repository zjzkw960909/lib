const fs = require('fs')
const chokidar = require('chokidar');
let dir = process.argv[2]

let readPromise = (path, code = 'utf8') => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, code, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}
let writePromise = (file, content = '', code = 'utf8') => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, content, code, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}
let createFiles = (dir) => {
    let jsFile = writePromise(`${dir}/index.js`)
    let cssFile = writePromise(`${dir}/index.css`)
    let jsonFile = writePromise(`${dir}/index.json`)
    let nodeFile = writePromise(`${dir}/index.node`)
    return Promise.all([jsFile, cssFile, jsonFile, nodeFile])
}
let getFilesContent = (dir) => {
    let jsFile = readPromise(`./${dir}/index.js`)
    let cssFile = readPromise(`./${dir}/index.css`)
    let jsonFile = readPromise(`./${dir}/index.json`)
    let nodeFile = readPromise(`./${dir}/index.node`)
    return Promise.all([jsFile, cssFile, jsonFile, nodeFile]).then((data) => {
        console.log('读取文件成功')
        resolve(data)
    })
}

let postData = () => {

}

let watchFiles = (dir) => {
    chokidar.watch(dir, {ignored: /(^|[\/\\])\../}).on('all', (event, fileName) => {
        console.log('正在监听文件')
        getFilesContent(dir)
    })
} 
console.log('开启服务成功')
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    createFiles(dir).then((err, data) => {
        console.log('创建文件成功')
        watchFiles(dir)
    })
} else {
    watchFiles(dir)
}


