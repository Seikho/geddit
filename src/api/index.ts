import { Router } from 'express'
import quote from './quote'
import user from './user'

const router = Router()

router.use('/quote', quote)
router.use('/user', user)

export default router