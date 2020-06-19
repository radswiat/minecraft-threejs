/* eslint-disable max-len */
import React, { Suspense, ReactElement } from 'react'
import { RouteConfig } from 'react-router-config'

import { ReactPage } from './routes.d'

const routes = [
  ['/', React.lazy((): Promise<ReactPage> => import(/* webpackChunkName: "dashboard-route" */ '@web/routes/Home'))],
]

export default routes.map(
  ([routeUrl, RoutePage]): RouteConfig => ({
    path: `/${routeUrl}`,
    component: (): ReactElement => (
      <Suspense fallback={''}>
        <RoutePage />
      </Suspense>
    ),
    exact: true,
  }),
)
