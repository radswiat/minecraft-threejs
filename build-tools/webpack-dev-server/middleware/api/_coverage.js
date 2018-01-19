import path from 'path';

import cheerio from 'cheerio';
import to from 'await-to-js';

import { readFile } from '../../../helpers/utils/utils';
import config from '../../../config/middleware/api';

/**
 * Get percentage for selector
 * @param $
 * @param selector
 * @return {number}
 */
function getPercentage($, selector) {
  const container = $(selector).parent();
  const val = container.find('span').first().html();
  return parseInt(val, 10);
}

/**
 * Get coverage scores
 * - returns total, statements, branches etc as a percentage coverage
 * - we have to read this from html file!
 * - returns null if file doesn't exists
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export default async function coverage(req, res) {

  // prepare coverage file path
  const coverageFile = path.resolve(process.cwd(), config.coverage.indexFilePath);

  // read coverage html file
  const [err, content] = await to(readFile(coverageFile));

  if (err) {
    res.json(null);
    return;
  }

  // load coverage html into cheerio for querying
  const $ = cheerio.load(content);

  // get percentage values
  const statements = getPercentage($, 'span:contains(Statements)');
  const branches = getPercentage($, 'span:contains(Branches)');
  const functions = getPercentage($, 'span:contains(Functions)');
  const lines = getPercentage($, 'span:contains(Lines)');

  // calculate total coverage
  const total = (statements + branches + functions + lines) * 100 / 400;

  res.json({
    total,
    statements,
    branches,
    functions,
    lines,
  });

}
