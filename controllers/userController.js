import express from 'express'
import {User} from '../models/user.js'
import { generateToken } from '../utils/token.js'

//Router 
const router = express.Router()

//Controllers

console.log('✅ userController loaded');


router.post('/signup', async (req, res, next) => {
  console.log('SIGNUP BODY', req.body)
    try {
      const user = await User.create(req.body)
  
      // If the user is successfully created, we now want to provide the client with a token that identifies them as an authenticated user
      const token = generateToken(user)
  
      return res.status(201).json({ 
        message: 'User created successfully', 
        token
      })
    } catch (error) {
      console.log(error.code, Object.keys(error.keyPattern)[0])
      next(error)
    }
  })


  router.post('/signin', async (req, res, next) => {
      console.log('SIGNIN BODY', req.body.password)
    try {
      // Search the user collection for a document with a matching username OR email
      const foundUser = await User.findOne({ $or: [{ username: req.body.identifier }, { email: req.body.identifier }] })
  
      // If the search returns null, return an unauthorized error
      if(!foundUser) {
        console.log('Username or email was incorrect')
        return res.status(401).json({ message: 'Invalid credentials provided' })
      }
  
      // If the search returns a user object, we need to ensure the password matches the user object
      if (!foundUser.isPasswordValid(req.body.password)) return res.status(401).json({ message: 'Invalid credentials provided' })
  
      // If the password matches, generate a token
      const token = generateToken(foundUser)
  
      // Return the token to the client
      return res.json({ message: 'Login was successful', token })
    } catch (error) {
      next(error)
    }
  })

  // * Show route
  router.get('/users/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params
  
      // 1. Search for the post based on the postId in the params
      const user = await User.findById(userId)
     .populate('username')
      // 2. Send a 404 if not found
      if(!user) return res.status(404).json({ message: 'Post not found' })
  
      // 3. Return the post if found
      return res.json(user)
    } catch (error) {
      next(error)
    }
  })
  

export default router