const fs = require('fs')
const chokidar = require('chokidar');
let dir = process.argv[2],
    arr = ['js', 'css', 'html', 'json', 'node']

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
    let tempArr
    tempArr = arr.map((v) => {
        let content = ''
        if (v === 'json') {
            content = '[]'
        }
        return writePromise(`./${dir}/index.${v}`, content)
    })
    return Promise.all(tempArr)
}
let getFilesContent = (dir) => {
    let tempArr
    tempArr = arr.map((v) => {
        return readPromise(`./${dir}/index.${v}`)
    })
    return Promise.all(tempArr)
}

let postData = () => {

}

let watchFiles = (dir) => {
    chokidar.watch(dir, {ignored: /(^|[\/\\])\../}).on('all', (event, fileName) => {
        console.log('正在监听文件')
        getFilesContent(dir).then((data) => {
            console.log('读取文件成功')
            return data
        }).catch((err) => {
            console.log(`read files errors:${err}`)
        })
    })
} 
console.log('开启服务成功')
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    createFiles(dir).then((err, data) => {
        console.log('创建文件成功')
        watchFiles(dir)
    }).catch((err) => {
        console.log(`create files errors:${err}`)
    })
} else {
    watchFiles(dir)
}


