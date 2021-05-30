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
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken:  String,
  resetTokenExp: Date,
  privilege: {
    type: Number,
    required: false,
    default: 1
  },
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

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save()
}

userSchema.methods.purchaseCart = function () {
  this.courseList.items = [...this.courseList.items, ...this.cart.items];
  console.log(this.courseList.items);
  this.cart.items = [];
  console.log(`Cart: ${this.cart.items}`);
  console.log('Successfuly Purchased Courses');
  return this.save();
}

userSchema.methods.removeFromCart = function (item) {
  console.log("Removing: " + item.title);
  const cartCourseIndex = this.cart.items.findIndex(cp => {
    return cp.courseId._id.toString() === item._id.toString();
  });
  const updatedCartItems = [...this.cart.items];
  if (cartCourseIndex !== -1) {
    updatedCartItems.splice(cartCourseIndex, 1);
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save()
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

userSchema.methods.updateUserInfo = function (firstName, lastName, userName, email) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.userName = userName;
  this.email = email;
  return this.save()
}

module.exports = mongoose.model('User', userSchema);