const superagent = require('superagent')
const config = require('./.config.js')
const cheerio = require('cheerio')
const request = superagent.agent()

let unescapeHtml = (str) => {
    return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&quot;/g, "\"")
}

let update = (obj, id) => {
    let postData = {
    }
    for (let k in obj) {
        if (k === 'node') {
            postData.nodejs = obj[k]
        } else if (k === 'json'){
            postData.config = obj[k]
        } else {
            postData[k] = obj[k]
        }
    }
    request
        .post(config.login)
        .type('form')
        .send({userName: config.name, userPassword: config.password})
        .then((err, res) => {
        }).then((err, res) => {
            request
                .get(config.codePage + id)
                .then((res) => {
                    let $ = cheerio.load(res.text),
                        data = {},
                        pageRequire = []
                    data.cssUrl = $('[name="cssUrl"]').val() 
                    data.jsUrl = $('[name="jsUrl"]').val()
                    /*$('[name="tempRequire"]').map((k, v) => {
                        let value = v.attribs.value
                        tempRequire.push(value)
                    })*/
                    $('[name="pageRequire"]').map((k, v) => {
                        let value = v.attribs.value
                        pageRequire.push(value)
                    })
                    data.pageRequire = pageRequire
                    //data.tempRequire = tempRequire
                    postData = Object.assign(postData, data)
                    request
                        .post(config.codePage + id)
                        .set('Accept', 'text/html; charset=utf-8')
                        .send(postData)
                        .end((err, res) => {
                            if (err) {
                                console.log('saveCodeErr: ' + JSON.stringify(res))
                            }
                            request
                                .get(config.refreshPage + id)
                                .end((err, res) => {
                                    if (err) {
                                        console.log('RenderErr: ' + JSON.stringify(res))
                                    }
                                })
                        })
                })
        })
}
let pull = (id) => {
    return request
        .post(config.login)
        .type('form')
        .send({userName: config.name, userPassword: config.password})
        .then((err, res) => {
        }).then(() => {
            return request
                .get(config.codePage + id)
                .then((res) => {
                    let $ = cheerio.load(res.text),
                        arr = [],
                        text = res.text,
                        js, css, json, html, nodejs
                    if ($('#J_JsCode').length) {
                        js = unescapeHtml(text.split('isbabel}">')[1].split('<\/div><div id="J_BabelCode"')[0])
                        arr.push({
                            type: 'js',
                            content: js
                        })
                    }
                    if ($('#J_CssCode').length) {
                        css = unescapeHtml(text.split('<div id="J_CssCode">')[1].split('</div><textarea id="J_CssCodeText" name="css">')[0])
                        arr.push({
                            type: 'css',
                            content: css
                        })
                    }
                    if ($('#J_ConfigCode').length) {
                        json = unescapeHtml(text.split('<div id="J_ConfigCode">')[1].split('<\/div><textarea id="J_ConfigCodeText" name="config">')[0])
                        arr.push({
                            type: 'json',
                            content: json
                        })
                    }
                    if ($('#J_HtmlCode').length) {
                        html = unescapeHtml(text.split('<div id="J_HtmlCode">')[1].split('</div><textarea id="J_HtmlCodeText" name="html">')[0])
                        arr.push({
                            type: 'html',
                            content: html
                        })
                    }
                    if ($('#J_NodeJsCode').length) {
                        nodejs = unescapeHtml(text.split('id="J_NodeJsCode">')[1].split('<\/div><textarea id="J_NodeJsCodeText"')[0])
                        arr.push({
                            type: 'node',
                            content: nodejs
                        })
                    }
                    return Promise.resolve(arr)
                })
        })
}
let func = {
    push: update,
    pull: pull
}
module.exports = func

