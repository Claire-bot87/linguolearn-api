import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    validate: {
      message: 'A name must not exceed 50 characters.',
      validator: (content) => content.length <= 50
    }
  },
    questionowner: {
      type: mongoose.Schema.Types.ObjectId, // This specifies a one-to-many referenced relationship
      ref: 'User', // This refers to the name of the model that this field is related to (user in this case)
     // required: [true, 'Please provide a parent field']
    },
    questiontext: {
      type: mongoose.Schema.Types.ObjectId, // This specifies a one-to-many referenced relationship
      ref: 'Text', // This refers to the name of the model that this field is related to (user in this case)
     // required: [true, 'Please provide a parent field']
    },


})



const Question =  mongoose.model('Question', questionSchema)
export {Question}