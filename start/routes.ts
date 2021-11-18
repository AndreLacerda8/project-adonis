/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('', 'UsersController.store')
  Route.post('login', 'UsersController.login')
  Route.group(() => {
    Route.post('logout/:id', 'UsersController.logout')
    Route.resource('user', 'UsersController').only(['show', 'update', 'destroy'])
  }).middleware('auth')
}).prefix('users')

Route.group(() => {
  Route.resource('games', 'GamesController').only(['index', 'show'])
  Route.group(() => {
    Route.post('games', 'GamesController.store')
    Route.put('games/:id', 'GamesController.update')
    Route.delete('games/:id', 'GamesController.destroy')
  }).middleware('isAdmin')
}).middleware('auth')

Route.group(() => {
  Route.get('bets/all', 'BetsController.index')
  Route.resource('bets', 'BetsController').apiOnly().except(['index'])
}).prefix('users').middleware('auth')

Route.group(() => {
  Route.post('forgot_password', 'ForgotPasswordsController.store')
  Route.put('forgot_password', 'ForgotPasswordsController.update')
})