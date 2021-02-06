import test from 'japa'
import puppeteer from 'puppeteer'
import faker from 'faker'
import supertest from 'supertest'
import { JSDOM } from 'jsdom'

import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import { messages } from 'App/Validators/LoginValidator'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
const relativeUrl: string = Route.makeUrl('login.index') || '/'
const url: string = `${BASE_URL}${relativeUrl}`

test.group('Login page', () => {
  test('ensure login page works', async (assert) => {
    const url: string = Route.makeUrl('login.index') || '/'
    const { text } = await supertest(BASE_URL).get(url).expect(200)
    const { document } = new JSDOM(text).window
    const title = document.title

    assert.exists(title)
    assert.equal(title, 'Login')
  })

  test('ensure login form has expected input fields', async (assert) => {
    const { text } = await supertest(BASE_URL).get(relativeUrl)
    const { document } = new JSDOM(text).window

    const form = document.querySelector('form')
    assert.exists(form)
    assert.equal(form?.getAttribute('method'), 'POST')
    assert.equal(form?.getAttribute('action'), Route.makeUrl('login.submit') || '/')

    const fields = ['username', 'password', 'remember_me']
    fields.forEach((el) => {
      const input = document.getElementById(el)
      assert.exists(input)
      assert.equal(input?.getAttribute('name'), el)
    })
  })

  test('ensure user password gets hashed during save', async (assert) => {
    const user = new User()
    const password = faker.internet.password()
    user.username = faker.internet.userName()
    user.email = faker.internet.email()
    user.password = password
    await user.save()

    assert.notEqual(user.password, password)
  })
})

test.group('Login submission', (group) => {
  const username = faker.internet.userName()
  const password = faker.internet.password()
  let user: User
  let browser
  let page

  group.before(async () => {
    user = new User()
    user.username = username
    user.email = faker.internet.email()
    user.password = password
    user.emailVerified = true
    await user.save()

    browser = await puppeteer.launch()
  })

  group.after(async () => {
    await browser.close()
  })

  group.beforeEach(async () => {
    page = await browser.newPage()
  })

  group.afterEach(async () => {
    await page.close()
  })

  test('ensure login fails with missing username', async (assert) => {
    await page.goto(url)
    await page.$eval('#username', (input) => input.removeAttribute('required'))
    await page.type('#password', password)
    await page.click('[type="submit"]')
    await page.waitForNavigation()

    const inputValue = await page.$eval('#password', (input) => input.value)
    assert.isEmpty(inputValue)

    const errorMsg = await page.$eval('p', (p) => p.textContent)
    assert.equal(errorMsg, messages['username.required'])
  })

  test('ensure login fails with missing password', async (assert) => {
    await page.goto(url)
    await page.$eval('#password', (input) => input.removeAttribute('required'))
    await page.type('#username', username)
    await page.click('[type="submit"]')
    await page.waitForNavigation()

    const inputValue = await page.$eval('#username', (input) => input.value)
    assert.equal(inputValue, username)

    const errorMsg = await page.$eval('p', (p) => p.textContent)
    assert.equal(errorMsg, messages['password.required'])
  })

  test('ensure login fails with nonexisting account', async (assert) => {
    const fakerUser = 'faker'
    await page.goto(url)
    await page.type('#username', fakerUser)
    await page.type('#password', password)
    await page.click('[type="submit"]')
    await page.waitForNavigation()

    const inputValue = await page.$eval('#username', (input) => input.value)
    assert.equal(inputValue, fakerUser)

    const pwValue = await page.$eval('#password', (input) => input.value)
    assert.isEmpty(pwValue)

    const errorMsg = await page.$eval('p', (p) => p.textContent)
    assert.equal(errorMsg, messages.invalid)
  })

  test('ensure login fails when email not verified', async (assert) => {
    const user = new User()
    const password = faker.internet.password()
    user.username = faker.internet.userName()
    user.email = faker.internet.email()
    user.password = password
    user.emailVerified = false
    await user.save()

    await page.goto(url)
    await page.type('#username', user.username)
    await page.type('#password', password)
    await page.click('[type="submit"]')
    await page.waitForNavigation()

    const inputValue = await page.$eval('#username', (input) => input.value)
    assert.equal(inputValue, user.username)

    const pwValue = await page.$eval('#password', (input) => input.value)
    assert.isEmpty(pwValue)

    const errorMsg = await page.$eval('p', (p) => p.textContent)
    assert.equal(errorMsg, messages.inactive)
  })

  test('ensure login works with username/pw', async (assert) => {
    await page.goto(url)
    await page.type('#username', username)
    await page.type('#password', password)
    await page.click('[type="submit"]')
    await page.waitForNavigation()

    assert.equal(page.url(), `${BASE_URL}${Route.makeUrl('dashboard')}`)
  })

  test.skip('ensure login works with TOTP', async (assert) => {
    assert.fail()
  })

  test.skip('ensure login fails with bad TOTP', async (assert) => {
    assert.fail()
  })
})
