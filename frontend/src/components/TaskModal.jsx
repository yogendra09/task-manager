import { useState, useEffect } from 'react';
import { X, Calendar, User } from 'lucide-react';
import { TASK_STATUS } from '../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetBoardMembers, asyncUpdateTaskDetails, asyncCreateTask } from '../store/slice/authSlice';
import { toast } from 'react-toastify';

const TaskModal = ({ task, isOpen, onClose, boardId }) => {
  const dispatch = useDispatch();
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    dueDate: '',
    members: [],
  });

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        taskId: task._id,
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUS.TODO,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        members: task.members || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: TASK_STATUS.TODO,
        dueDate: '',
        members: [],
      });
    }
  }, [task]);

  const fetchBoardMembers = async () => {
    try {
      const result = await dispatch(asyncGetBoardMembers(boardId || task.board)).unwrap();
      setMembers(result?.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch board members.');
    }
  };

  useEffect(() => {
    if (isOpen && (task || boardId)) {
      fetchBoardMembers();
    }
  }, [isOpen, task, boardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        // Update existing task
        await dispatch(asyncUpdateTaskDetails({ taskId: task._id, ...formData })).unwrap();
        toast.success('Task updated successfully!');
      } else {
        // Create new task
        await dispatch(asyncCreateTask({ boardId, ...formData })).unwrap();
        toast.success('Task created successfully!');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to save task details.');
    } finally {
      onClose();
    }
  };

  const toggleMember = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }));
  };

  const getAvatar = (name) => {
    if (!name) return 'U';
    const initials = name.split(' ').map((word) => word[0]).join('').toUpperCase();
    return initials.slice(0, 2);
  };

  const assignedMembers = task?.assignedTo || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Task Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={TASK_STATUS.TODO}>To Do</option>
                <option value={TASK_STATUS.DOING}>Doing</option>
                <option value={TASK_STATUS.DONE}>Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Assigned Members</label>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-700 rounded-lg">
              {assignedMembers.length > 0 ? (
                assignedMembers?.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500 text-white"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white">
                      {getAvatar(member.name)}
                    </div>
                    <span className="text-sm">{member.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleMember(member._id)}
                      className="text-white hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No members assigned</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">All Board Members</label>
            <div className="flex flex-wrap gap-2">
              {members?.map((member) => (
                <button
                  key={member.user._id}
                  type="button"
                  onClick={() => toggleMember(member.user._id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    formData.members.includes(member.user._id)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white">
                    {getAvatar(member.user.name)}
                  </div>
                  <span className="text-sm">{member.user.name}</span>
                  <span className="text-xs capitalize">({member.role})</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;