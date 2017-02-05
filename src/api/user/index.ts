import { Router } from 'express'
import login from './login'
import create from './create'

const router = Router()

router.post('/login', login)
router.post('/', create)

export default router