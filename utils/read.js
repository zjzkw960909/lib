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
    return Promise.all([jsFile, cssFile, jsonFile, nodeFile]).then((err, data) => {
        if (err) throw err
        resolve(1)
    })
}
let getFilesContent = (dir) => {
    let jsFile = readPromise(`./${dir}/index.js`)
    let cssFile = readPromise(`./${dir}/index.css`)
    let jsonFile = readPromise(`./${dir}/index.json`)
    let nodeFile = readPromise(`./${dir}/index.node`)
    return Promise.all([jsFile, cssFile, jsonFile, nodeFile]).then((data) => {
        resolve(data)
    })
}

let postData = () => {

}

let watchFiles = (dir) => {
    chokidar.watch(dir, {ignored: /(^|[\/\\])\../}).on('all', (event, fileName) => {
        getFilesContent(dir)
    })
} 
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    createFiles(dir).then(() => {
        console.log('开启服务成功')
    })
} else {
    watchFiles(dir)
    console.log('开启服务成功')
}


