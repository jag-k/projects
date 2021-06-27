const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PROJECT_DIR = path.resolve(process.env.PROJECT_DIR || "projects");

console.log(PROJECT_DIR);

const _buffer = {}

function getYaml(pathToFile) {
    if (_buffer[pathToFile]) return Object.assign({}, _buffer[pathToFile]);
    let projectRawData = fs.readFileSync(pathToFile).toString();
    let projectData = yaml.load(projectRawData).project;
    _buffer[pathToFile] = Object.assign({}, projectData);
    return projectData;
}

function getProject (lang) {
    let res = [];
    for (let projectFilename of fs.readdirSync(PROJECT_DIR)) {
        let projectPath = path.join(PROJECT_DIR, projectFilename)
        let projectData = getYaml(projectPath);
        
        console.log(projectData);
        if (typeof lang === 'string') {
            let langs = projectData.langs;
            delete projectData.langs;
            if (lang in langs) {
                res.push({...projectData, ...langs[lang]})
            }
        }
    }
    console.log(res);
    return res;
}

module.exports = function () {
    return {
        en: getProject('en'),
        ru: getProject('ru')
    }
}