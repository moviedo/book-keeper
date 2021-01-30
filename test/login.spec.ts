import test from 'japa'
import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test('ensure login page works', async (assert) => {
    const url: string = Route.makeUrl('login.index') || '/'
    const { text } = await supertest(BASE_URL).get(url).expect(200)
    const { document } = new JSDOM(text).window
    const title = document.title

    assert.exists(title)
    assert.equal(title, 'Login')
  })

  test('ensure login form has expected input fields', async (assert) => {
    const url: string = Route.makeUrl('login.index') || '/'
    const { text } = await supertest(BASE_URL).get(url)
    const { document } = new JSDOM(text).window

    const form = document.querySelector('form')
    assert.exists(form)
    assert.equal(form?.getAttribute('method'), 'POST')
    assert.equal(form?.getAttribute('action'), Route.makeUrl('login.create') || '/')

    const fields = ['username', 'password', 'remember_me']
    fields.forEach((el) => {
      const input = document.getElementById(el)
      assert.exists(input)
      assert.equal(input?.getAttribute('name'), el)
    })
  })

  test('ensure user password gets hashed during save', async (assert) => {
    const user = new User()
    user.username = 'virk1'
    user.email = 'virk@adonisjs.com'
    user.password = 'secret'
    await user.save()
    assert.notEqual(user.password, 'secret')
  })
})
