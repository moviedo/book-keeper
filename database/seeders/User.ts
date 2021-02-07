import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    await User.updateOrCreateMany('username', [
      {
        username: 'alice1',
        email: 'alice@adonisjs.com',
        password: 'secret',
        emailVerified: true,
      },
      {
        username: 'bob123',
        email: 'bob@adonisjs.com',
        password: 'supersecret',
        emailVerified: true,
      },
    ])
  }
}
