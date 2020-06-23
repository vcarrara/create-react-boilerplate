#!/usr/bin/env node
const shell = require('shelljs')
const fs = require('fs')
const { join } = require('path')

const repo = 'https://github.com/vcarrara/react-boilerplate.git'
const argv = process.argv.slice(2)
const dir = argv[0] || 'react-boilerplate'

const run = () => {
    shell.mkdir(dir)
    shell.cd(dir)
    shell.exec(`git clone ${repo} .`)
    updateTemplateFiles()
    shell.exec('npm install')
}

const updateTemplateFiles = () => {
    const files = {
        'package.json': (path) => {
            let package = require(path)
            package.name = dir
            package.description = ''
            delete package.repository
            delete package.bugs
            delete package.homepage
            fs.writeFileSync(path, JSON.stringify(package))
        },
        '.travis.yml': (path) => {
            fs.unlinkSync(path)
        },
        'REAMDE.md': (path) => {
            fs.unlinkSync(path)
        },
        '.git': (path) => {
            fs.rmdirSync(path)
        },
    }
    Object.keys(files).forEach((fileName) => {
        const filePath = join(shell.pwd().stdout, fileName)
        if (fs.existsSync(filePath)) {
            files[fileName](filePath)
        }
    })
}

run()
