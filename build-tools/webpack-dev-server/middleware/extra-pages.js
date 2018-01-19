import path from 'path';

import express from 'express';

import { spawn } from '../../helpers/utils/utils';
import config from '../../config/middleware/extra-pages';

// lets start styleguide process
// it will be available under: localhost:6060
spawn('npm', ['run', config.styleguideCmd]);

/**
 * Include any extra pages into webpack dev server
 * This will allow us to host some of the external pages like:
 * - coverage report
 * @param app
 */
export default function extraPages(app) {
  app.use(config.coverageUrl, express.static(path.resolve(process.cwd(), config.coveragePath)));
}
