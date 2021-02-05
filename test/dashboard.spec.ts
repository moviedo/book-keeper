import test from 'japa'
import supertest from 'supertest'

import Route from '@ioc:Adonis/Core/Route'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Dashboard page', () => {
  test('ensure dashboard page only accessible by auth users', async (assert) => {
    const url: string = Route.makeUrl('dashboard') || '/'
    await supertest(BASE_URL)
      .get(url)
      .expect('location', Route.makeUrl('login.index') || '/')
      .expect(302)
  })
})
