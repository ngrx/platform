const blockC = require('./region-matchers/block-c');
const html = require('./region-matchers/html');
const inlineC = require('./region-matchers/inline-c');
const inlineCOnly = require('./region-matchers/inline-c-only');
const inlineHash = require('./region-matchers/inline-hash');
const DEFAULT_PLASTER = '. . .';
const {mapObject} = require('../../helpers/utils');

module.exports = function regionParser() {
  return regionParserImpl;
};

regionParserImpl.regionMatchers = {
  ts: inlineC,
  js: inlineC,
  es6: inlineC,
  dart: inlineC,
  html: html,
  css: blockC,
  yaml: inlineHash,
  jade: inlineCOnly,
  json: inlineC,
  'json.annotated': inlineC
};

/**
 * @param contents string
 * @param fileType string
 * @returns {contents: string, regions: {[regionName: string]: string}}
 */
function regionParserImpl(contents, fileType) {
  const regionMatcher = regionParserImpl.regionMatchers[fileType];
  const openRegions = [];
  const regionMap = {};

  if (regionMatcher) {
    let plaster = regionMatcher.createPlasterComment(DEFAULT_PLASTER);
    const lines = contents.split(/\r?\n/).filter((line, index) => {
      const startRegion = line.match(regionMatcher.regionStartMatcher);
      const endRegion = line.match(regionMatcher.regionEndMatcher);
      const updatePlaster = line.match(regionMatcher.plasterMatcher);

      // start region processing
      if (startRegion) {
        // open up the specified region
        const regionNames = getRegionNames(startRegion[1]);
        if (regionNames.length === 0) {
          regionNames.push('');
        }
        regionNames.forEach(regionName => {
          const region = regionMap[regionName];
          if (region) {
            if (region.open) {
              throw new RegionParserError(
                  `Tried to open a region, named "${regionName}", that is already open`, index);
            }
            region.open = true;
            if (plaster) {
              region.lines.push(plaster);
            }
          } else {
            regionMap[regionName] = {lines: [], open: true};
          }
          openRegions.push(regionName);
        });

        // end region processing
      } else if (endRegion) {
        if (openRegions.length === 0) {
          throw new RegionParserError('Tried to close a region when none are open', index);
        }
        // close down the specified region (or most recent if no name is given)
        const regionNames = getRegionNames(endRegion[1]);
        if (regionNames.length === 0) {
          regionNames.push(openRegions[openRegions.length - 1]);
        }

        regionNames.forEach(regionName => {
          const region = regionMap[regionName];
          if (!region || !region.open) {
            throw new RegionParserError(
                `Tried to close a region, named "${regionName}", that is not open`, index);
          }
          region.open = false;
          removeLast(openRegions, regionName);
        });

        // doc plaster processing
      } else if (updatePlaster) {
        const plasterString = updatePlaster[1].trim();
        plaster = plasterString ? regionMatcher.createPlasterComment(plasterString) : '';

        // simple line of content processing
      } else {
        openRegions.forEach(regionName => regionMap[regionName].lines.push(line));
        // do not filter out this line from the content
        return true;
      }

      // this line contained an annotation so let's filter it out
      return false;
    });
    if (!regionMap['']) {
      regionMap[''] = {lines};
    }
    return {
      contents: lines.join('\n'),
      regions: mapObject(regionMap, (regionName, region) => leftAlign(region.lines).join('\n'))
    };
  } else {
    return {contents, regions: {}};
  }
}

function getRegionNames(input) {
  return (input.trim() === '') ? [] : input.split(',').map(name => name.trim());
}

function removeLast(array, item) {
  const index = array.lastIndexOf(item);
  array.splice(index, 1);
}

function leftAlign(lines) {
  let indent = Number.MAX_VALUE;
  lines.forEach(line => {
    const lineIndent = line.search(/\S/);
    if (lineIndent !== -1) {
      indent = Math.min(lineIndent, indent);
    }
  });
  return lines.map(line => line.substring(indent));
}

function RegionParserError(message, index) {
  const lineNum = index + 1;
  this.message = `regionParser: ${message} (at line ${lineNum}).`;
  this.lineNum = lineNum;
  this.stack = (new Error()).stack;
}
RegionParserError.prototype = Object.create(Error.prototype);
RegionParserError.prototype.constructor = RegionParserError;
