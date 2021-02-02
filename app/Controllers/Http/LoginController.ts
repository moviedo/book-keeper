import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator, { messages } from 'App/Validators/LoginValidator'
import Route from '@ioc:Adonis/Core/Route'

export default class LoginController {
  public async index({ view }: HttpContextContract) {
    return view.render('login', { title: 'Login' })
  }

  public async submit({ auth, request, response, session }: HttpContextContract) {
    try {
      const { username, password, rememberMe = false } = await request.validate(LoginValidator)
      await auth.attempt(username, password, rememberMe)

      response.redirect(Route.makeUrl('home') || '/')
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
