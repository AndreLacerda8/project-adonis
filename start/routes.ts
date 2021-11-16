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

Route.get('/', async () => {
  return { hello: 'world' }
})


// Route.resource('/users', 'UsersController').only(['show', 'update', 'destroy'])
Route.get('users/:id', 'UsersController.show').middleware('auth')
Route.put('users/:id', 'UsersController.update').middleware('auth')
Route.delete('users/:id', 'UsersController.destroy').middleware('auth')
Route.post('users/login', 'UsersController.login')
Route.post('users/logout/:id', 'UsersController.logout').middleware('auth')
Route.post('users', 'UsersController.store')

Route.post('games', 'GamesController.store').middleware(['auth', 'isAdmin'])
Route.put('games/:id', 'GamesController.update').middleware(['auth', 'isAdmin'])
Route.delete('games/:id', 'GamesController.destroy').middleware(['auth', 'isAdmin'])
Route.get('games/:id', 'GamesController.show').middleware('auth')
Route.get('games', 'GamesController.index').middleware('auth')

Route.get('users/bets/all', 'BetsController.index').middleware('auth')
Route.get('users/bets/:id', 'BetsController.show').middleware('auth')
Route.post('bets', 'BetsController.store').middleware('auth')