import path from 'path';

import clone from 'lodash/cloneDeep';
import to from 'await-to-js';

import log from '../../../helpers/log/log';
import { readFile, spawn } from '../../../helpers/utils/utils';
import config from '../../../config/middleware/api';

let updateInProgress = false;

/**
 * Get time difference in seconds
 * @param time
 * @return {number}
 */
function getDiffTime(time) {
  return Math.floor(((Date.now()) - time) / 1000);
}

/**
 * Update tests by running "npm run start:tests"
 */
function updateTests() {

  log.info('updating unit tests', '...');

  updateInProgress = true;

  // fix process.env
  // react-create-app is adding BABEL and NODE env into process.env
  // for our tests to run without crashing we have to remove them
  const env = clone(process.env);
  delete env.BABEL_ENV;
  delete env.NODE_ENV;
  delete env.NODE_PATH;

  // start tests process
  const ls = spawn('npm', ['run', 'start:tests'], {
    cwd: path.resolve(process.cwd()),
    env,
  });

  // handle end of tests process
  // set updateInProgress to false
  ls.on('close', () => {
    log.status('unit tests updated');
    updateInProgress = false;
  });

  setTimeout(() => {
  }, config.reports.estimatedUpdateDuration);
}

/**
 * Get jest unit tests reports
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export default async function reports(req, res) {

  // get reports file
  const coverageFile = path.resolve(process.cwd(), 'coverage/report.json');

  // read coverage html file
  const [err, data] = await to(readFile(coverageFile));

  // if error or no data at all
  if (err || !data) {
    updateTests();
    res.json(null);
    return;
  }

  // parse json
  const json = JSON.parse(data);

  // should update tests
  // update tests every x seconds ( default 600 = 5 min )
  if (getDiffTime(json.startTime) >= config.reports.updateAfter && !updateInProgress) {
    updateTests();
  }

  // if we don't have any json results, run tests again ignoring time diff
  if (!json.numTotalTests && !updateInProgress) {
    updateTests();
  }

  res.json({
    total: json.numTotalTests,
    passed: json.numPassedTests,
    failed: json.numFailedTests,
    lastUpdateTime: getDiffTime(json.startTime),
  });
}

