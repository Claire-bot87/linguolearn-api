import express from 'express'
import { validateToken } from '../middleware/validateToken.js'
import {Text} from '../models/text.js'
//import {Question} from '../models/question.js'
const router = express.Router()

// * Index route
router.get('/texts', async (req, res, next) => {
  try {
    const texts = await Text.find()
    //.populate('parent')
    //.populate('likes')
    return res.json(texts)
  } catch (error) {
    next(error)
  }
})


// * Create route - use this route when we want anyone to be able to add a text
router.post('/texts',
   //validateToken, 
   async (req, res, next) => {
console.log('TEXT POST REQUEST LOADED👍')
  try {
    // req.body.owner = req.user._id
    console.log(`api log: ${req.body}`)
    const text = await Text.create(req.body)
    return res.status(201).json(text)
  } catch (error) {
    next(error)
  }
})


// * Create route - add this route in if you want visitors to have to log in to add a text to the DB
router.post('/texts',
   //validateToken, 
   async (req, res, next) => {
console.log('TEXT POST REQUEST LOADED👍')
  try {
    // The req.body is only going to contain the "content" field
    // _id, createdAt, updatedAt will all automatically be generated without us doing anything
    // Likes simply don't need to be passed on creation
    // * Author, however, needs to be created by us inside this controller, post token validation
console.log('USER ID' + req.user._id)
    req.body.owner = req.user._id
    console.log(`api log: ${req.body}`)
    const text = await Text.create(req.body)
    return res.status(201).json(text)
  } catch (error) {
    next(error)
  }
})

// * Show route
router.get('/texts/:textId', async (req, res, next) => {
  try {
    const { textId } = req.params

    // 1. Search for the post based on the postId in the params
    const text = await Text.findById(textId)
    //.populate('parent')
    //.populate('likes')
    //.populate('dislikes')
    // 2. Send a 404 if not found
    if(!text) return res.status(404).json({ message: 'Post not found' })

    // 3. Return the post if found
    return res.json(text)
  } catch (error) {
    next(error)
  }
})

// * Update route
router.put('/texts/:textId', validateToken, async (req, res, next) => {
  try {
    const { textId } = req.params
    
    // 1. Search for the post based on the postId in the params
    const text = await Text.findById(textId)

    // 2. Send a 404 if not found
    if(!text) return res.status(404).json({ message: 'Post not found' })

    // 3. Authorize the logged in user as the author
    if (!req.user._id.equals(text.owner)) return res.status(403).json({ message: 'You do not have permission to access this resource' })

    // 4. Update the existing post with the req.body
    const updatedText = await Text.findByIdAndUpdate(textId, req.body, { returnDocument: 'after' })

    // 5. Return the updated post to the client
    return res.json(updatedText)
  } catch (error) {
    next(error)
  }
})

// * Delete route
router.delete('/texts/:textId', validateToken, async (req, res, next) => {
  try {
    const { textId } = req.params
    
    // 1. Search for the post based on the postId in the params
    const text = await Text.findById(textId)

    // 2. Send a 404 if not found
    if(!text) return res.status(404).json({ message: 'Post not found' })

    // 3. Authorize the logged in user as the author
    if (!req.user._id.equals(text.owner)) return res.status(403).json({ message: 'You do not have permission to access this resource' })

    // 4. Delete the existing post
    await Text.findByIdAndDelete(textId)

    // 5. Return a 204 with no body
    return res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})



export default router