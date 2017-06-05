const fs = require('fs')
const chokidar = require('chokidar');
const config = require('./.config.js')
const git = require('./update.js')
const update = git.push
const pull = git.pull
let dir = process.argv[2], //路径
    id = process.argv[3], //项目id
    temp = process.argv[4] //是否pull

let getFileType = (path, callback) => {
    fs.readdir(path, (err, files) => {
        if (!err) {
            callback(files)
        } else {
            console.log(`getFileType Wrong: ${err}`)
        }
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
let createFiles = (dir, pullArr) => {
    let tempArr
    if (pullArr && pullArr.length > 0) {
        tempArr = pullArr.map((v) => {
            return writePromise(`./${dir}/index.${v.type}`, v.content)
        })
    }
    return Promise.all(tempArr)
}
let getFilesContent = (dir, files) => {
    let tempArr
    tempArr = files.map((v) => {
        return readPromise(`./${dir}/${v}`)
    })
    return Promise.all(tempArr)
}

let watchFiles = (dir) => {
    chokidar.watch(dir, {ignored: /(^|[\/\\])\../}).on('all', (event, fileName) => {
        console.log('正在监听文件')
        let files = new Promise((resolve, reject) => {
            getFileType(dir, (data) => {
                resolve(data)
            }) 
        })
        files.then((files) => {
            let obj = {}
            getFilesContent(dir, files).then((data) => {
                files.map((v, k) => {
                    obj[v.split('.')[1]] = data[k]
                })
                update(obj, id)
                return data
            }).catch((err) => {
                console.log(`read files errors:${err}`)
            })
        }).catch((err) => {
            console.log(`getFileTypes Err: ${err}`)
        })
    })
} 
let pulData = (id) => {
    pull(id).then((data) => {
        if (data.length) {
            createFiles(dir, data)
        } else {
            console.log('没有抓取到数据')
        }
    }).catch((err) => {
        console.log(`pullErr: ${err}`)
    })
}
if (temp && temp === 'pull') {
    console.log('正在拉取星云数据')
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
        pulData(id)
    } else {
        pulData(id)
    }
} else {
    console.log('正在向星云同步')
    watchFiles(dir)
}
