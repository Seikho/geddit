import { Router } from 'express'
import login from './login'
import create from './create'
import logout from './logout'
import whoAmI from './who-am-i'
import update from './update'
import changePassword from './change-password'
import register from './register'
import getAll from './get-all'
import paging from '../paging'

const router = Router()

router.get('/', paging, getAll)
router.get('/who-am-i', whoAmI)
router.get('/logout', logout)
router.post('/update', update)
router.post('/login', login)
router.post('/', create)
router.post('/change-password', changePassword)
router.post('/register', register)

export default router