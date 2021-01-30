import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class LoginController {
  public async index({ view }: HttpContextContract) {
    return view.render('login', { title: 'Login' })
  }
}
