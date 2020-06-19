import React from 'react'

import { observer } from 'mobx-react'

import App from '@web/components/containers/App'
import Container from '@web/components/containers/Container'
import Center from '@web/components/containers/Center'
import PreloderLinear from '@web/components/preloaders/Linear'

import gameLoaderStore from '@shared/stores/gameLoader'

import Logo from './components/Logo/Logo'

export default observer(function HomeRoute() {
  return (
    <App>
      <Container>
        <Center>
          <Logo />
          <PreloderLinear title={gameLoaderStore.taskTitle} max={gameLoaderStore.taskMax} current={gameLoaderStore.taskCurrent} />
        </Center>
      </Container>
    </App>
  )
})
