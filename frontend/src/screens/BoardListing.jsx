import React, { useEffect, useState } from 'react';
import { Plus, Layout, Users, X, User, Edit2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncCreateBoard, asyncGetAllBoards, asyncUpdateBoard, asyncDeleteBoard, asyncAddMemberToBoard } from '../store/slice/authSlice';
import { toast } from 'react-toastify';

const BoardListing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [editBoardId, setEditBoardId] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [boards, setBoards] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const fetchBoards = async () => {
    try {
      const result = await dispatch(asyncGetAllBoards()).unwrap();
      setBoards(result.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
      toast.error('Failed to fetch boards.');
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) {
      toast.error('Board name cannot be empty.');
      return;
    }
    if (!boardDescription) {
      toast.error('Board description cannot be empty.');
      return;
    }
    try {
      await dispatch(asyncCreateBoard({ title: boardName, description: boardDescription })).unwrap();
      toast.success('Board created successfully!');
      fetchBoards();
    } catch (error) {
      toast.error(error.message || 'Failed to create board.');
    } finally {
      setBoardName('');
      setBoardDescription('');
      setIsModalOpen(false);
    }
  };

  const handleEditBoard = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) {
      toast.error('Board name cannot be empty.');
      return;
    }
    if (!boardDescription) {
      toast.error('Board description cannot be empty.');
      return;
    }
    try {
      await dispatch(asyncUpdateBoard({ id: editBoardId, title: boardName, description: boardDescription })).unwrap();
      toast.success('Board updated successfully!');
      fetchBoards();
    } catch (error) {
      toast.error(error.message || 'Failed to update board.');
    } finally {
      setBoardName('');
      setBoardDescription('');
      setEditBoardId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await dispatch(asyncDeleteBoard(boardId)).unwrap();
        toast.success('Board deleted successfully!');
        fetchBoards();
      } catch (error) {
        toast.error(error.message || 'Failed to delete board.');
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) {
      toast.error('Member email cannot be empty.');
      return;
    }
    try {
      await dispatch(asyncAddMemberToBoard({ boardId: selectedBoardId, email: memberEmail })).unwrap();
      toast.success('Member added successfully!');
      fetchBoards();
    } catch (error) {
      toast.error(error.message || 'Failed to add member.');
    } finally {
      setMemberEmail('');
      setSelectedBoardId(null);
      setIsAddMemberModalOpen(false);
    }
  };

  const openEditModal = (board) => {
    setEditBoardId(board._id);
    setBoardName(board.title);
    setBoardDescription(board.description);
    setIsEditModalOpen(true);
  };

  // Open add member modal
  const openAddMemberModal = (boardId) => {
    setSelectedBoardId(boardId);
    setIsAddMemberModalOpen(true);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  useEffect(() => {
    fetchBoards();
    return () => {};
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <p className="text-white text-lg">Please log in to view your boards.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center justify-between mb-8 text-white bg-gray-800 bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">Your Boards</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-12 h-12 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all group relative"
            >
              <span className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded-md py-1 px-2 -top-10 transition-opacity">
                Favorite Boards
              </span>
            </button>
            <button
              className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center relative hover:bg-cyan-700 transition-all group"
            >
              <Users className="w-6 h-6" />
              <span className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded-md py-1 px-2 -top-10 transition-opacity">
                Shared Boards
              </span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium text-sm">Create Board</span>
            </button>
            <button
              onClick={handleProfileClick}
              className="w-12 h-12 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all group relative"
            >
              <User className="w-6 h-6" />
              <span className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded-md py-1 px-2 -top-10 transition-opacity">
                Profile
              </span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards?.length > 0 ? (
              boards?.map((board, index) => (
                <div key={index} className="bg-gray-800 bg-opacity-90 rounded-xl p-4 shadow-md hover:shadow-lg hover:bg-opacity-100 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <Link to={`/board?id=${board._id}`}>
                      <h3 className="text-white font-semibold text-lg">{board?.title}  <span className='text-xs'> {user._id === board?.createdBy ? "(owner)" : "(member)"} </span> </h3>
                    </Link>
                    <div className="flex gap-2">
                      <Link to={`/board?id=${board._id}`}>
                        <button
                          className="text-gray-300 underline hover:text-white hover:bg-blue-600 p-2 rounded-lg transition-all"
                        >
                          View
                        </button>
                      </Link>
                      <button
                        onClick={() => openEditModal(board)}
                        className="text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBoard(board._id)}
                        className="text-gray-300 hover:text-white hover:bg-red-600 p-2 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-400">{board?.description}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>{board?.members?.length} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layout className="w-5 h-5" />
                      <span>{board?.tasks} tasks</span>
                    </div>
                    <button
                      
                      onClick={() => openAddMemberModal(board._id)}
                      className={`text-gray-300 hover:text-white hover:bg-blue-600 p-2 rounded-lg transition-all ${user._id === board?.createdBy ? '' : 'hidden'}`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[60vh] w-screen flex items-center justify-center">
                <p className="text-gray-400">No boards available. Create a new board to get started!</p>
              </div>
            )}
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 bg-opacity-90 rounded-xl p-6 w-full max-w-md shadow-xl transform transition-all scale-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Create New Board</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateBoard}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Board Name</label>
                  <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Enter board name"
                    className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={boardDescription}
                    onChange={(e) => setBoardDescription(e.target.value)}
                    placeholder="Enter board description"
                    className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 resize-none h-24"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 bg-opacity-90 rounded-xl p-6 w-full max-w-md shadow-xl transform transition-all scale-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Edit Board</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditBoard}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Board Name</label>
                  <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Enter board name"
                    className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={boardDescription}
                    onChange={(e) => setBoardDescription(e.target.value)}
                    placeholder="Enter board description"
                    className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 resize-none h-24"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isAddMemberModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 bg-opacity-90 rounded-xl p-6 w-full max-w-md shadow-xl transform transition-all scale-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Add Member to Board</h2>
                <button
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddMember}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Member Email</label>
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="Enter member email"
                    className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardListing;