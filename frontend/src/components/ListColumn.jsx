import { useState, useRef } from 'react';
import { Plus, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import TaskCard from './TaskCard';
import { TASK_STATUS } from '../utils/types';

const ListColumn = ({
  list,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  onDeleteList,
  onRenameList,
  isDraggingOver,
  draggedTaskId
}) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showListOptions, setShowListOptions] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const titleInputRef = useRef(null);

  const handleAddCard = () => {
    if (!newTaskTitle.trim()) {
      return;
    }
    onAddTask({
      title: newTaskTitle,
      listId: list._id,
      status: TASK_STATUS.TODO,
      members: [],
    });
    setNewTaskTitle('');
    setShowAddCard(false);
  };

  const handleDragOver = (e, taskId = null) => {
    e.preventDefault();
    console.log("Drag over:", list._id, draggedTaskId);
    onDragOver(list._id, draggedTaskId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(list._id);
  };

  const handleRenameStart = () => {
    setNewTitle(list.title);
    setIsEditingTitle(true);
    setShowListOptions(false);
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      }
    }, 0);
  };

  const handleRenameSave = () => {
    if (newTitle.trim() && newTitle !== list.title) {
      onRenameList(list.id, newTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleRenameCancel = () => {
    setNewTitle(list.title);
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRenameSave();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  const handleTaskKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCard();
    } else if (e.key === 'Escape') {
      setNewTaskTitle('');
      setShowAddCard(false);
    }
  };

  return (
    <div className="w-80 flex-shrink-0">
      <div
        className={`bg-gray-800 bg-opacity-90 rounded-xl p-4 shadow-md h-full transition-all duration-200 ${
          isDraggingOver ? 'ring-2 ring-blue-500 bg-opacity-100' : ''
        }`}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={handleDrop}
        role="region"
        aria-label={`List: ${list.title}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleRenameSave}
                onKeyDown={handleKeyPress}
                className="w-full bg-gray-700 text-white font-semibold text-lg px-2 py-1 rounded outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={50}
                aria-label="Edit list title"
              />
            ) : (
              <h3 className="text-white font-semibold text-lg truncate">{list.title}</h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm bg-gray-700 px-2 py-1 rounded">
              {tasks.length}
            </span>
            <button
              onClick={() => setShowAddCard(true)}
              className="text-white hover:bg-gray-700 p-2 rounded-lg transition-all group relative"
              aria-label="Add new card"
            >
              <Plus className="w-5 h-5" />
              <span className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded-md py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-opacity">
                Add Card
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowListOptions(!showListOptions)}
                className="text-white hover:bg-gray-700 p-2 rounded-lg transition-all group relative"
                aria-label="List options"
              >
                <MoreHorizontal className="w-5 h-5" />
                <span className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded-md py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-opacity">
                  List Options
                </span>
              </button>
              {showListOptions && (
                <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 w-48">
                  <div className="p-2">
                    <button
                      onClick={handleRenameStart}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2"
                      aria-label="Rename list"
                    >
                      <Edit3 className="w-4 h-4" />
                      Rename List
                    </button>
                    <button
                      onClick={() => {
                        onDeleteList(list._id);
                        setShowListOptions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2"
                      aria-label="Delete list"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete List
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2 min-h-20 max-h-[calc(100vh-300px)] overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task._id}
              draggable
              onDragStart={(e) => onDragStart(e, task._id)}
              onDragOver={(e) =>{ handleDragOver(e, task._id)}}
              className="cursor-grab active:cursor-grabbing"
              role="listitem"
              aria-label={`Task: ${task.title}`}
            >
              <TaskCard
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            </div>
          ))}
        </div>
        {showAddCard ? (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleTaskKeyPress}
              className="w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              autoFocus
              aria-label="New task title"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                aria-label="Add task"
              >
                Add Card
              </button>
              <button
                onClick={() => {
                  setShowAddCard(false);
                  setNewTaskTitle('');
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                aria-label="Cancel adding task"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCard(true)}
            className="mt-3 flex items-center gap-2 text-white text-sm hover:bg-gray-700 px-4 py-3 rounded-lg w-full transition-all"
            aria-label="Add a card"
          >
            <Plus className="w-5 h-5" />
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ListColumn;