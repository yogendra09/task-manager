const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors.js");
const User = require("../models/user.model.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { sendJwtToken } = require("../utils/SendJwtToken.js");
const Board = require("../models/boards.model.js");
const List = require("../models/list.model.js");
const Task = require("../models/task.model.js");
const { default: mongoose } = require("mongoose");


exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.id);
  res.status(200).json({
    status: true
    , user,
  });
});

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password  } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("please enter all fields", 400));
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("user already exist", 409));
  }
  const user = new User(req.body);
  await user.save();
  sendJwtToken(user, 200, res);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("user not exist", 401));
  const isMatch = user.comparepassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("invalid credential"), 403);
  sendJwtToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  const option = {
    exipres: new Date(),
    httpOnly: true,
    secure:true
  };
  res
    .status(200)
    .cookie("token",'', option)
    .json({ message: "user logout!" });
});


exports.getAllBoards = catchAsyncErrors(async (req, res, next) => {
const boards = await Board.find({
    $or: [
      { createdBy: req.id }, 
      { 'members.user': req.id },
    ],
  });
  return res.status(200).json({
    status: true,
    data: boards || [],
  });
});

exports.createBoard = catchAsyncErrors(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const boardExists = await Board.findOne({ title, createdBy: req.id });
  if (boardExists) {
    return next(new ErrorHandler("Board already exists", 409));
  }
  const board = await Board.create({
    title,
    description,
    createdBy: req.id,

  });
  res.status(201).json({
    status: true,
    data: board,
  });
});


exports.createList = catchAsyncErrors(async (req, res, next) => {
  const { title, boardId } = req.body;
  if (!title || !boardId) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const board = await Board.findById(boardId);
  if (!board) {
    return next(new ErrorHandler("Board not found", 404));
  }

  const list = await List.create({
    title,
    board: boardId,
    createdBy: req.id,
    position: 0,
  });

  res.status(201).json({
    status: true,
    data: list,
  });
});

exports.updateBoard = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, } = req.body;
  const board = await Board.findById(id);
  if (!board) {
    return next(new ErrorHandler("Board not found", 404));
  }

  board.title = title || board.title;
  board.description = description || board.description;
  await board.save();

  res.status(200).json({
    status: true,
    data: board,
  });
});


exports.getAllLists = catchAsyncErrors(async (req, res, next) => {
  const lists = await List.find();
  res.status(200).json({
    status: true,
    data: lists || [],
  });
});

exports.getBoardLists = catchAsyncErrors(async (req, res, next) => {
  const { boardId } = req.params;
  const lists = await List.find({ board: boardId });
  res.status(200).json({
    status: true,
    data: lists || [],
  });
});

exports.updateList = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  const list = await List.findById(id);
  if (!list) {
    return next(new ErrorHandler("List not found", 404));
  }

  list.title = title || list.title;
  await list.save();

  res.status(200).json({
    status: true,
    data: list,
  });
});

exports.deleteList = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const list = await List.findById(id);
  if (!list) {
    return next(new ErrorHandler("List not found", 404));
  }

  await Task.deleteMany({ list: list._id });

  await list.deleteOne();

  res.status(200).json({
    status: true,
    message: "List deleted successfully",
  });
});

  
exports.getBoardById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const board = await Board.findById(id)
    .populate('createdBy', 'name email')
    .populate('members', 'name email')
    .lean(); 

  if (!board) {
    return next(new ErrorHandler('Board not found', 404));
  }

  const lists = await List.find({ board: id }).lean();
  
  if (!lists.length) {
    return res.status(200).json({
      status: true,
      data: { board, lists: [] },
    });
  }

  const listIds = lists.map((list) => list._id);
  const tasks = await Task.find({ list: { $in: listIds } }).populate('assignedTo').lean();

  const listsWithTasks = lists.map((list) => ({
    ...list,
    tasks: tasks.filter((task) => task.list.toString() === list._id.toString()),
  }));

  res.status(200).json({
    status: true,
    data: { board, lists: listsWithTasks },
  });
});


exports.createTask = catchAsyncErrors(async (req, res, next) => {
  const { title, list, status, members, boardId } = req.body;
  if (!title || !list || !status) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const existingList = await List.findById(list);
  if (!existingList) {
    return next(new ErrorHandler("List not found", 404));
  }

  const task = await Task.create({
    title,
    list: existingList._id,
    status,
    board: boardId,
    members: members || [],
    createdBy: req.id,
    position: 0,
  });

  res.status(201).json({
    status: true,
    data: task,
  });
});


exports.updateTask = catchAsyncErrors(async (req, res, next) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return next(new ErrorHandler('Updates must be a non-empty array', 400));
  }

  for (const update of updates) {
    if (!update.id || !mongoose.Types.ObjectId.isValid(update.id)) {
      return next(new ErrorHandler('Invalid task ID in updates', 400));
    }
    if (!update.list || !mongoose.Types.ObjectId.isValid(update.list)) {
      return next(new ErrorHandler('Invalid list ID in updates', 400));
    }
    if (typeof update.position !== 'number' || update.position < 0) {
      return next(new ErrorHandler('Invalid position in updates', 400));
    }
  }

  try {
    const listIds = [...new Set(updates.map((update) => update.list))];
    for (const listId of listIds) {
      const updatesForList = updates.filter((update) => update.list === listId);
      const positions = updatesForList.map((update) => update.position);
      const uniquePositions = new Set(positions);

      if (uniquePositions.size !== positions.length) {
        return next(new ErrorHandler('Duplicate positions detected in the same list', 400));
      }

      const existingTasks = await Task.find({ list: listId });
      const existingPositions = existingTasks
        .filter((task) => !updates.some((update) => update.id === task._id.toString()))
        .map((task) => task.position);

      for (const position of positions) {
        if (existingPositions.includes(position)) {
          return next(new ErrorHandler(`Position ${position} is already taken in list ${listId}`, 400));
        }
      }
    }

    const updatedTasks = [];
    for (const update of updates) {
      const task = await Task.findById(update.id).populate('assignedTo');
      if (!task) {
        return next(new ErrorHandler(`Task with ID ${update.id} not found`, 404));
      }

      task.list = update.list;
      task.position = update.position;

      const updatedTask = await task.save();
      updatedTasks.push(updatedTask);
    }

    res.status(200).json({
      status: true,
      message: 'Tasks updated successfully',
      data: updatedTasks,
    });
  } catch (error) {
    console.error("Error updating tasks:", error);
    return next(new ErrorHandler("An error occurred", 500));
  }
});

exports.deleteTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  await task.deleteOne();

  res.status(200).json({
    status: true,
    message: "Task deleted successfully",
  });
});


exports.deleteBoard = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const board = await Board.findById(id);
  if (!board) {
    return next(new ErrorHandler("Board not found", 404));
  }

  const lists = await List.find({ board: board._id });
  for (const list of lists) {
    await Task.deleteMany({ list: list._id });
    await list.deleteOne();
  }

  await board.deleteOne();

  res.status(200).json({
    status: true,
    message: "Board deleted successfully",
  });
});

exports.updateBoard = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const board = await Board.findById(id);
  if (!board) {
    return next(new ErrorHandler("Board not found", 404));
  }

  board.title = title || board.title;
  board.description = description || board.description;
  await board.save();

  res.status(200).json({
    status: true,
    data: board,
  });
});

exports.addMemberToBoard = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; 
  const { email } = req.body;

  const board = await Board.findById(id);
  if (!board) {
    return next(new ErrorHandler("Board not found", 404));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (board.members.includes(user._id)) {
    return next(new ErrorHandler("User is already a member of the board", 400));
  }

  board.members.push({
    user: user._id,
    role: 'member',
  });
  await board.save();

  res.status(200).json({
    status: true,
    message: "Member added to board successfully",
    data: board,
  });
});

exports.updateTaskDetails = catchAsyncErrors(async (req, res, next) => {
  const { taskId, title, description, status, dueDate, members } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }


  Object.assign(task, {
    title: title || task.title,
    description: description || task.description,
    status: status || task.status,
    dueDate: dueDate || task.dueDate,
    assignedTo: members || task.assignedTo,
  });
  await task.save();

  res.status(200).json({
    status: true,
    message: "Task details updated successfully",
    data: task,
  });
});


exports.getBoardMembers = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const board = await Board.findById(id).populate('members.user', 'name email');
  if (!board) {
    return next(new ErrorHandler("Board not found", 404));
  }

  res.status(200).json({
    status: true,
    data: board.members,
  });
});