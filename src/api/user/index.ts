import { Router } from 'express'
import login from './login'
import create from './create'
import logout from './logout'

const router = Router()

router.get('/logout', logout)
router.post('/login', login)
router.post('/', create)

export default router