import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'

import LoginValidator, { messages } from 'App/Validators/LoginValidator'
import VerificationException from 'App/Exceptions/VerificationException'

export default class LoginController {
  public async index({ view }: HttpContextContract) {
    return view.render('login', { title: 'Login' })
  }

  public async submit({ auth, request, response, session }: HttpContextContract) {
    try {
      const { username, password, rememberMe = false } = await request.validate(LoginValidator)
      const user = await auth.verifyCredentials(username, password)

      if (user?.emailVerified === false) {
        throw new VerificationException(true, {
          inactive: messages.inactive,
        })
      }

      await auth.login(user, rememberMe)

      response.redirect(Route.makeUrl('dashboard') || '/')
    } catch (error) {
      if (error.code === 'E_INVALID_AUTH_UID' || error.code === 'E_INVALID_AUTH_PASSWORD') {
        // unable to find user using account
        session.flash({
          invalid: messages.invalid,
        })
      }

      throw error
    }
  }
}
