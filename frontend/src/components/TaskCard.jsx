import { useState } from 'react';
import { MoreHorizontal, Calendar, User } from 'lucide-react';
import { MEMBERS, TASK_STATUS } from '../utils/types';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);


  const getStatusColor = (status) => {
    switch (status) {
      case TASK_STATUS.TODO:
        return 'bg-red-500';
      case TASK_STATUS.DOING:
        return 'bg-yellow-500';
      case TASK_STATUS.DONE:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-3 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-600">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-white font-medium text-sm flex-1 pr-2">{task.title}</h4>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-600 transition-colors"
            aria-label="Task options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10 w-48">
              <div className="p-2">
                <button
                  onClick={() => onEdit(task)}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                >
                  Edit Task
                </button>
                
                <div className="border-t border-gray-600 mt-2 pt-2">
                  <button
                    onClick={() => {
                      onDelete(task._id);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Delete Task
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {task.description && (
        <p className="text-gray-300 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <div
            className={`px-2 py-1 rounded-full ${getStatusColor(task.status) || "bg-gray-600"} text-white text-xs`}
          >
            {task?.status?.charAt(0)?.toUpperCase() + task?.status?.slice(1) || "Todo"}
          </div>
        </div>
        {task.members && task.members.length > 0 && (
          <div className="flex -space-x-2">
            {task.members.slice(0, 3).map((memberId) => {
              const member = MEMBERS.find((m) => m.id === memberId);
              return member ? (
                <div
                  key={member.id}
                  className={`w-6 h-6 rounded-full border-2 border-gray-700 ${member.color} flex items-center justify-center text-xs text-white`}
                  title={member.name}
                >
                  {member.avatar}
                </div>
              ) : null;
            })}
            {task.members.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-gray-700 flex items-center justify-center text-xs text-white">
                +{task.members.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;