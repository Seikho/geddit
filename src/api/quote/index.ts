import { Router } from 'express'
import getOne from './one'
import getMany from './many'
import paging from '../paging'

const router = Router()

router.use('/:id', getOne)
router.use('/', paging, getMany)

export default router