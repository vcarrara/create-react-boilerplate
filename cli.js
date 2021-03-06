#!/usr/bin/env node
const shell = require('shelljs')
const fs = require('fs')
const { join } = require('path')

const repo = 'https://github.com/vcarrara/react-boilerplate.git'
const argv = process.argv.slice(2)
const dir = argv[0] || 'react-boilerplate'

const run = () => {
    if (!shell.which('git')) {
        shell.echo('Error, this script requires git')
        shell.exit(1)
    }

    shell.mkdir(dir)
    shell.cd(dir)
    shell.exec(`git clone ${repo} .`)
    shell.exec('git init')
    updateTemplateFiles()
    shell.echo('Installing dependencies...')
    shell.exec('npm install')
    shell.echo('React boileplate successfully created!')
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
        'webpack.config.js': (path) => {
            if (dir !== 'react-boilerplate') {
                let config = fs.readFileSync(path, 'utf-8')
                config = config.replace('react-boilerplate', dir)
                fs.writeFileSync(path, config)
            }
        },
        '.travis.yml': (path) => {
            fs.unlinkSync(path)
        },
        'README.md': (path) => {
            fs.unlinkSync(path)
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
