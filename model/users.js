const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Course = mongoose.Course;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  privilege: {
    type: Number,
    required: false,
    default: 1
  },
  // I need to add items to make a list of items
  cart: {
    items: [{
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
      }
    }]
  },
  courseList: {
    items: [{
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
      }
    }]
  },
});

userSchema.methods.clearCart = function() {
  this.cart.items = [];
  return this.save()
}

userSchema.methods.removeFromCart = function (course) {
  const cartCourseIndex = this.cart.items.findIndex(cp => {
    console.log(course);
    console.log(cp._id);
    return cp.courseId.toString() === course._id.toString();
  });
  const updatedCartItems = [...this.cart.items];
  if (cartCourseIndex !== -1) {
    updatedCartItems.splice(cartCourseIndex, 1);
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.addToCart = function (course) {
  const cartCourseIndex = this.cart.items.findIndex(cp => {
    return cp.courseId.toString() === course._id.toString();
  });
  const updatedCartItems = [...this.cart.items];
  if (cartCourseIndex === -1) {
    updatedCartItems.push({
      courseId: course._id
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
}

module.exports = mongoose.model('User', userSchema);