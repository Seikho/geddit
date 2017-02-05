import { Router } from 'express'
import getOne from './one'
import getLatest from './latest'
import getOldest from './oldest'
import getRandom from './random'
import getTop from './top'
import vote from './vote'
import paging from '../paging'
import create from './create'
import approve from './approve'
import getUnapproved from './unapproved'

const router = Router()

router.get('/random', getRandom)
router.get('/top', paging, getTop)
router.get('/oldest', paging, getOldest)
router.get('/latest', paging, getLatest)
router.get('/unapproved', paging, getUnapproved)

// Approving
router.put('/:id/:status', approve)

// Voting
router.put('/:id/:direction', vote)

router.get('/:id', getOne)
router.get('/', paging, getLatest)
router.post('/', create)

export default router