import { Router } from 'express'
import quote from './quote'

const router = Router()

router.use('/quote', quote)

export default router