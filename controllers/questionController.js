import express from 'express'
import { validateToken } from '../middleware/validateToken.js'
import {Question} from '../models/question.js'

const router = express.Router()

// * Index route
router.get('/questions', async (req, res, next) => {
  try {
    const questions = await Question.find()
    return res.json(questions)
  } catch (error) {
    next(error)
  }
})


// * Create route
router.post('/texts/:textId/questions', validateToken, async (req, res, next) => {
  try {
    // The req.body is only going to contain the "content" field
    // _id, createdAt, updatedAt will all automatically be generated without us doing anything
    // Likes simply don't need to be passed on creation
    // * Author, however, needs to be created by us inside this controller, post token validation

    req.body.questionowner = req.user._id
    req.body.questiontext = req.params.textId
    const question = await Question.create(req.body)
    return res.status(201).json(question)
  } catch (error) {
    next(error)
  }
})

// * Show route
router.get('/texts/:textId/questions/:questionId', async (req, res, next) => {
  try {
    const { questionId } = req.params

    // 1. Search for the post based on the postId in the params
    const question = await Question.findById(questionId)

    // 2. Send a 404 if not found
    if(!question) return res.status(404).json({ message: 'Food Item not found' })

    // 3. Return the post if found
    return res.json(question)
  } catch (error) {
    next(error)
  }
})

// * Update route
router.put('/texts/:textId/questions/:questionId', validateToken, async (req, res, next) => {
  try {
    const { questionId } = req.params
    
    // 1. Search for the post based on the postId in the params
    const question = await Question.findById(questionId)

    // 2. Send a 404 if not found
    if(!question) return res.status(404).json({ message: 'Food item not found' })

    // 3. Authorize the logged in user as the author
    //if (!req.user._id.equals(text.parent)) return res.status(403).json({ message: 'You do not have permssion to access this resource' })

    // 4. Update the existing post with the req.body
    const updatedQuestion = await Question.findByIdAndUpdate(questionId, req.body, { returnDocument: 'after' })

    // 5. Return the updated post to the client
    return res.json(updatedQuestion)
  } catch (error) {
    next(error)
  }
})

// * Delete route
router.delete('/texts/:textId/questions/:questionId', validateToken, async (req, res, next) => {
  try {
    const { questionId } = req.params
    
    // 1. Search for the post based on the postId in the params
    const question = await Question.findById(questionId)

    // 2. Send a 404 if not found
    if(!question) return res.status(404).json({ message: 'Question not found' })

    // 3. Authorize the logged in user as the author
    //if (!req.user._id.equals(text.parent)) return res.status(403).json({ message: 'You do not have permssion to access this resource' })

    // 4. Delete the existing post
    await Question.findByIdAndDelete(questionId)

    // 5. Return a 204 with no body
    return res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})


export default router