import coverage from './_coverage';
import reports from './_reports';

export default function api(app) {

  app.get('/__api/:method', (req, res) => {

    if (req.params.method === 'coverage') {
      coverage(req, res);
    }

    if (req.params.method === 'reports') {
      reports(req, res);
    }
  });
}
