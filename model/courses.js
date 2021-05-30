const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  instructor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  reviews: {
    items: [{
      reviewId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
      },
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      body: {
        type: String,
        required: true
      }
    }]
  }
});

module.exports = mongoose.model('Course', courseSchema);