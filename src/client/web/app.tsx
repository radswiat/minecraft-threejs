import React from 'react'
import { Router } from 'react-router'
import { createBrowserHistory } from 'history'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import routes from './routes'

export default function App() {
  render(
    <Router history={createBrowserHistory()}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Router>,
    document.getElementById('root'),
  )
}
