const mongoose = require('mongoose');

const boardMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'member'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Board title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  color: {
    type: String,
    default: '#2563eb'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  members: [boardMemberSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    allowMemberInvites: {
      type: Boolean,
      default: true
    },
    allowMemberEdits: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
boardSchema.index({ createdBy: 1 });
boardSchema.index({ 'members.user': 1 });



// Method to check if user is member of board
boardSchema.methods.isMember = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString()
  );
};

// Method to check if user is owner of board
boardSchema.methods.isOwner = function(userId) {
  const member = this.members.find(m => 
    m.user.toString() === userId.toString()
  );
  return member && member.role === 'owner';
};

// Method to get user's role in board
boardSchema.methods.getUserRole = function(userId) {
  const member = this.members.find(m => 
    m.user.toString() === userId.toString()
  );
  return member ? member.role : null;
};

module.exports = mongoose.model('Board', boardSchema);

