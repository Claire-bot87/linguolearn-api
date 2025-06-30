import mongoose from 'mongoose'

const textSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      message: 'A name must not exceed 200 characters.',
      validator: (content) => content.length <= 200
    }
  },
  bodyoftext: {
    type: String,
    required: true,
    validate: {
      message: 'A name must not exceed 5000 characters.',
      validator: (content) => content.length <= 5000
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // This specifies a one-to-many referenced relationship
    ref: 'User', // This refers to the name of the model that this field is related to (user in this case)
   // required: [true, 'Please provide a parent field']
  },
  taggedstudents: [{
    type: mongoose.Schema.Types.ObjectId, // This specifies a one-to-many referenced relationship
    ref: 'User' // This refers to the name of the model that this field is related to (user in this case)
  }],
 
})



const Text = mongoose.models.Text || mongoose.model('Text', textSchema)
export {Text}