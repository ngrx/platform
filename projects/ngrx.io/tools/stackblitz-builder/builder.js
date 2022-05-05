'use strict';

// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
const path = require('canonical-path');
const jsdom = require('jsdom');
const fs = require('fs-extra');
const globby = require('globby');

const regionExtractor = require('../transforms/examples-package/services/region-parser');

class StackblitzBuilder {
  constructor(basePath, destPath) {
    this.basePath = basePath;
    this.destPath = destPath;

    this.copyrights = {};
    this._buildCopyrightStrings();
  }

  build() {
    // When testing it sometimes helps to look a just one example directory like so:
    const stackblitzPaths = path.join(this.basePath, '**/*stackblitz.json');
    const fileNames = globby.sync(stackblitzPaths, {
      ignore: ['**/node_modules/**'],
    });
    fileNames.forEach((configFileName) => {
      try {
        this._buildStackblitzFrom(configFileName);
      } catch (e) {
        console.log(e);
      }
    });
  }

  _buildCopyrightStrings() {
    const copyright =
      '' +
      'Use of this source code is governed by an MIT-style license that\n' +
      'can be found in the LICENSE file at https://github.com/ngrx/platform';
    const pad = '\n\n';
    this.copyrights.jsCss = `${pad}/*\n${copyright}\n*/`;
    this.copyrights.html = `${pad}<!-- \n${copyright}\n-->`;
  }

  // Build stackblitz from JSON configuration file (e.g., stackblitz.json):
  // all properties are optional
  //   files: string[] - array of globs - defaults to all js, ts, html, json, css and md files (with certain files removed)
  //   description: string - description of this stackblitz - defaults to the title in the index.html page.
  //   tags: string[] - optional array of stackblitz tags (for searchability)
  //   main: string - name of file that will become index.html in the stackblitz - defaults to index.html
  //   file: string - name of file to display within the stackblitz (e.g. `"file": "app/app.module.ts"`)
  _buildStackblitzFrom(configFileName) {
    // replace ending 'stackblitz.json' with 'stackblitz.no-link.html' to create output file name;
    const outputFileName = configFileName.replace(
      /stackblitz\.json$/,
      `stackblitz.no-link.html`
    );
    let altFileName;
    if (this.destPath && this.destPath.length > 0) {
      const partPath = path.dirname(
        path.relative(this.basePath, outputFileName)
      );
      altFileName = path
        .join(this.destPath, partPath, path.basename(outputFileName))
        .replace('.no-link.', '.');
    }
    try {
      const config = this._initConfigAndCollectFileNames(configFileName);
      const postData = this._createPostData(config, configFileName);

      this._addStackblitzrc(postData, config);

      const html = this._createStackblitzHtml(config, postData);
      fs.writeFileSync(outputFileName, html, 'utf-8');
      if (altFileName) {
        const altDirName = path.dirname(altFileName);
        fs.ensureDirSync(altDirName);
        fs.writeFileSync(altFileName, html, 'utf-8');
      }
    } catch (e) {
      // if we fail delete the outputFile if it exists because it is an old one.
      if (this._existsSync(outputFileName)) {
        fs.unlinkSync(outputFileName);
      }
      if (altFileName && this._existsSync(altFileName)) {
        fs.unlinkSync(altFileName);
      }
      throw e;
    }
  }

  _getPrimaryFile(config) {
    if (config.file) {
      if (!this._existsSync(path.join(config.basePath, config.file))) {
        throw new Error(
          `The specified primary file (${config.file}) does not exist in '${config.basePath}'.`
        );
      }
      return config.file;
    } else {
      const defaultPrimaryFiles = [
        'src/app/app.component.html',
        'src/app/app.component.ts',
        'src/app/main.ts',
      ];
      const primaryFile = defaultPrimaryFiles.find((fileName) =>
        fs.existsSync(path.join(config.basePath, fileName))
      );

      if (!primaryFile) {
        throw new Error(
          `None of the default primary files (${defaultPrimaryFiles.join(
            ', '
          )}) exists in '${config.basePath}'.`
        );
      }

      return primaryFile;
    }
  }

  _addStackblitzrc(postData, config) {
    postData['project[files][.stackblitzrc]'] = JSON.stringify({
      installDependencies: true,
      startCommand: `turbo ${config?.type === 'testing' ? 'test' : 'start'}`,
      env: {
        ENABLE_CJS_IMPORTS: true,
      },
    });
  }

  _createBaseStackblitzHtml(config) {
    const file = `?file=${this._getPrimaryFile(config)}`;
    const action = `https://stackblitz.com/run${file}`;
    const html = `<!DOCTYPE html><html lang="en"><body>
    <form id="mainForm" method="post" action="${action}" target="_self"></form>
    <script>
      var embedded = 'ctl=1';
      var isEmbedded = window.location.search.indexOf(embedded) > -1;

      if (isEmbedded) {
        var form = document.getElementById('mainForm');
        var action = form.action;
        var actionHasParams = action.indexOf('?') > -1;
        var symbol = actionHasParams ? '&' : '?'
        form.action = form.action + symbol + embedded;
      }
      document.getElementById("mainForm").submit();
    </script>
    </body></html>`;

    return html;
  }

  _createPostData(config, configFileName) {
    const postData = {};

    // If `config.main` is specified, ensure that it points to an existing file.
    if (
      config.main &&
      !this._existsSync(path.join(config.basePath, config.main))
    ) {
      throw Error(
        `The main file ('${config.main}') specified in '${configFileName}' does not exist.`
      );
    }

    config.fileNames.forEach((fileName) => {
      let content;
      const extn = path.extname(fileName);
      if (extn == '.png') {
        content = this._encodeBase64(fileName);
        fileName = fileName.substring(0, fileName.length - 4) + '.base64.png';
      } else {
        content = fs.readFileSync(fileName, 'utf-8');
      }

      if (extn == '.js' || extn == '.ts' || extn == '.css' || extn == '.scss') {
        content = content + this.copyrights.jsCss;
      } else if (extn == '.html') {
        content = content + this.copyrights.html;
      }

      let relativeFileName = path.relative(config.basePath, fileName);

      // Is the main a custom index-xxx.html file? Rename it
      if (relativeFileName == config.main) {
        relativeFileName = 'src/index.html';
      }

      // A custom main.ts file? Rename it
      if (/src\/main[-.]\w+\.ts$/.test(relativeFileName)) {
        relativeFileName = 'src/main.ts';
      }

      if (relativeFileName == 'index.html') {
        if (config.description == null) {
          // set config.description to title from index.html
          const matches = /<title>(.*)<\/title>/.exec(content);
          if (matches) {
            config.description = matches[1];
          }
        }
      }

      content = regionExtractor()(content, extn.substring(1)).contents;

      postData[`project[files][${relativeFileName}]`] = content;
    });

    const tags = ['angular', 'example'].concat(config.tags || []);
    tags.forEach(function (tag, ix) {
      postData[`project[tags][${ix}]`] = tag;
    });

    postData['project[description]'] = 'NgRx Example - ' + config.description;
    postData['project[template]'] = 'node';

    return postData;
  }

  _createStackblitzHtml(config, postData) {
    const baseHtml = this._createBaseStackblitzHtml(config);
    const doc = jsdom.jsdom(baseHtml);
    const form = doc.querySelector('form');

    for (const [key, value] of Object.entries(postData)) {
      const ele = this._htmlToElement(
        doc,
        `<input type="hidden" name="${key}">`
      );
      ele.setAttribute('value', value);
      form.appendChild(ele);
    }

    return doc.documentElement.outerHTML;
  }

  _encodeBase64(file) {
    // read binary data and convert binary data to base64 encoded string
    return fs.readFileSync(file, { encoding: 'base64' });
  }

  _existsSync(filename) {
    try {
      fs.accessSync(filename);
      return true;
    } catch (ex) {
      return false;
    }
  }

  _htmlToElement(document, html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
  }

  _initConfigAndCollectFileNames(configFileName) {
    const config = this._parseConfig(configFileName);
    const defaultIncludes = [
      '**/*.ts',
      '**/*.js',
      '**/*.css',
      '**/*.scss',
      '**/*.html',
      '**/*.md',
      '**/*.json',
      '**/*.png',
    ];
    const boilerplateIncludes = [
      'src/environments/*.*',
      'src/polyfills.ts',
      '*.json',
    ];
    if (config.files) {
      if (config.files.length > 0) {
        if (config.files[0].substring(0, 1) == '!') {
          config.files = defaultIncludes.concat(config.files);
        }
      }
    } else {
      config.files = defaultIncludes;
    }
    config.files = config.files.concat(boilerplateIncludes);

    let includeSpec = false;
    const gpaths = config.files.map(function (fileName) {
      fileName = fileName.trim();
      if (fileName[0] === '!') {
        return '!' + path.join(config.basePath, fileName.substring(1));
      } else {
        includeSpec = includeSpec || /\.spec\.(ts|js)$/.test(fileName);
        return path.join(config.basePath, fileName);
      }
    });

    const defaultExcludes = [
      '!**/e2e/**/*.*',
      '!**/example-config.json',
      '!**/tslint.json',
      '!**/.editorconfig',
      '!**/wallaby.js',
      '!**/*stackblitz.*',
    ];

    // exclude all specs if no spec is mentioned in `files[]`
    if (!includeSpec) {
      defaultExcludes.push('!**/*.spec.*', '!**/spec.js');
    }

    gpaths.push(...defaultExcludes);

    config.fileNames = globby.sync(gpaths, { ignore: ['**/node_modules/**'] });

    return config;
  }

  _parseConfig(configFileName) {
    try {
      const configSrc = fs.readFileSync(configFileName, 'utf-8');
      const config =
        configSrc && configSrc.trim().length ? JSON.parse(configSrc) : {};
      config.basePath = path.dirname(configFileName); // assumes 'stackblitz.json' is at `/src` level.
      return config;
    } catch (e) {
      throw new Error(
        `Stackblitz config - unable to parse json file: ${configFileName}\n${e}`
      );
    }
  }
}

module.exports = StackblitzBuilder;
