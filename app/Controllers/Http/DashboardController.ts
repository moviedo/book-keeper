import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class DashboardController {
  public async index({ view }: HttpContextContract) {
    return view.render('dashboard', { title: 'Dashboard', application: Application })
  }
}
