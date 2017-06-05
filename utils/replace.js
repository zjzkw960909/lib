const fs = require('fs')
const dir = process.argv[2] //路径
let patt = (str) => {
    return /.styl$/.test(str)
}

let loop = (path) => {
    fs.readdir(path, (err, files) => {
        if (err) {
            console.log(`readErr: ${err}`)
        } else {
            files.map((v) => {
                let tempPath = path + '/' + v
                fs.stat(tempPath, (err1, stats) => {
                    if (err1) {
                        console.log(`statErr: ${err1}`)
                    } else {
                        if (stats.isDirectory()) {
                            loop(tempPath)
                        } else {
                            if (patt(v)) {
                                readPromise(tempPath).then((styl) => {
                                    return styl.replace(/\d*rpx/g, (data) => {
                                        return data.split('rpx')[0] / 2 + 'px'
                                    })
                                }).then((px) => {
                                    writePromise(tempPath, px)
                                })
                            }
                        }
                    }
                })
            })
        }
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

loop(dir)
