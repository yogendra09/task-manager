const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  dueDate: {
    type: Date
  },
  position: {
    type: Number,
    required: true,
    min: 0
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done', "doing"],
    default: 'todo'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for unique position per list
// taskSchema.index({ list: 1, position: 1 }, { unique: true });

// Auto-increment position for new tasks in a list
taskSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastTask = await this.constructor
      .findOne({ list: this.list })
      .sort({ position: -1 });
    
    this.position = lastTask ? lastTask.position + 1 : 0;
  }
  next();
});

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return this.dueDate < new Date();
});

module.exports = mongoose.model('Task', taskSchema);