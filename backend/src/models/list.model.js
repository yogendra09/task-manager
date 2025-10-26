const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'List title is required'],
    trim: true,
    maxlength: [50, 'Title cannot exceed 50 characters']
  },
  position: {
    type: Number,
    required: true,
    min: 0
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
  color: {
    type: String,
    default: '#6b7280'
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for unique position per board
listSchema.index({ board: 1, position: 1 }, { unique: true });

// Auto-increment position for new lists in a board
listSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastList = await this.constructor
      .findOne({ board: this.board })
      .sort({ position: -1 });
    
    this.position = lastList ? lastList.position + 1 : 0;
  }
  next();
});

module.exports = mongoose.model('List', listSchema);