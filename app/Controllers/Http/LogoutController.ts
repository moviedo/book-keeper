import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogoutController {
  public async index({ auth, response }: HttpContextContract) {
    auth.logout()
    response.redirect().toRoute('home')
  }
}
