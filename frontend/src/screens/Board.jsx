import { useEffect, useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { TASK_STATUS } from "../utils/types";
import ListColumn from "../components/ListColumn";
import TaskModal from "../components/TaskModal";
import { useDispatch } from "react-redux";
import {
  asyncCreateList,
  asyncCreateTask,
  asyncDeleteList,
  asyncDeleteTask,
  asyncGetBoardList,
  asyncUpdateTask,
} from "../store/slice/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState({
    lists: [],
    boardInfo: null,
  });
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverList, setDragOverList] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null); // Track target task for position
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("id");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchLists = async () => {
    try {
      const result = await dispatch(asyncGetBoardList(boardId)).unwrap();
      setData({
        lists: result.data.lists || [],
        boardInfo: result.data.board || null,
      });
      setTasks(result.data.lists.flatMap((list) => list.tasks || []));
    } catch (error) {
      toast.error(error.message || "Failed to fetch board data.");
    }
  };

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (listId, taskId = null) => {
    console.log("Drag over:", listId, taskId);
    setDragOverList(listId);
    setDragOverTaskId(taskId);
  };

const handleDrop = async (targetListId) => {
  if (!draggedTaskId || !targetListId) return;

  try {
    const draggedTask = tasks.find((task) => task._id === draggedTaskId);
    if (!draggedTask) {
      toast.error("Dragged task not found.");
      return;
    }
    if (!targetListId || typeof targetListId !== 'string') {
      toast.error("Invalid target list.");
      return;
    }

    const isSameList = draggedTask.list?.toString() === targetListId?.toString();
    let updatedTasks = [...tasks];

    const reassignPositions = (tasksInList) => {
      return tasksInList
        .sort((a, b) => a.position - b.position)
        .map((task, index) => ({ ...task, position: index }));
    };

    if (isSameList) {
      let listTasks = tasks
        .filter((task) => task.list?.toString() === targetListId)
        .sort((a, b) => a.position - b.position);

      const draggedIndex = listTasks.findIndex((task) => task._id === draggedTaskId);
      let targetIndex = dragOverTaskId
        ? listTasks.findIndex((task) => task._id === dragOverTaskId)
        : listTasks.length - 1;

      if (dragOverTaskId && draggedIndex < targetIndex) {
        targetIndex += 1;
      }

      const [movedTask] = listTasks.splice(draggedIndex, 1);
      listTasks.splice(targetIndex, 0, { ...movedTask });

      listTasks = reassignPositions(listTasks);

      updatedTasks = tasks.map((task) => {
        const updatedTask = listTasks.find((t) => t._id === task._id);
        return updatedTask || task;
      });
    } else {
  
      const sourceListTasks = tasks
        .filter((task) => task.list?.toString() === draggedTask.list?.toString())
        .sort((a, b) => a.position - b.position);
      let targetListTasks = tasks
        .filter((task) => task.list?.toString() === targetListId)
        .sort((a, b) => a.position - b.position);

      const sourceListTasksUpdated = sourceListTasks.filter(
        (task) => task._id !== draggedTaskId
      );

      let targetIndex = dragOverTaskId
        ? targetListTasks.findIndex((task) => task._id === dragOverTaskId)
        : targetListTasks.length;

      if (dragOverTaskId && targetListTasks[targetIndex]) {
        targetIndex += 1;
      }

      targetListTasks.splice(targetIndex, 0, { ...draggedTask, list: targetListId });

      const updatedSourceListTasks = reassignPositions(sourceListTasksUpdated);
      const updatedTargetListTasks = reassignPositions(targetListTasks);

      updatedTasks = tasks.map((task) => {
        const sourceTask = updatedSourceListTasks.find((t) => t._id === task._id);
        const targetTask = updatedTargetListTasks.find((t) => t._id === task._id);
        return sourceTask || targetTask || task;
      });
    }

    setTasks(updatedTasks);

    const affectedListIds = [
      ...new Set([draggedTask.list?.toString(), targetListId].filter(Boolean)),
    ];
    const updates = updatedTasks
      .filter((task) => affectedListIds.includes(task.list?.toString()))
      .map((task) => ({
        id: task._id,
        list: task.list,
        position: task.position,
      }));

    await dispatch(asyncUpdateTask({ id: draggedTaskId, updates })).unwrap();
    toast.success("Task moved successfully!");
    fetchLists(); // Refresh lists to ensure consistency
  } catch (error) {
    toast.error(error.message || "Failed to move task.");
    fetchLists(); // Revert to server state
  } finally {
    setDraggedTaskId(null);
    setDragOverList(null);
    setDragOverTaskId(null);
  }
};

  const handleAddTask = async (data) => {
    const newTask = {
      title: data.title,
      list: data.listId || null,
      status: TASK_STATUS.TODO,
      members: data.members || [],
      boardId,
      position: tasks.filter((task) => task.list?.toString() === data.listId?.toString()).length,
    };
    try {
      const result = await dispatch(asyncCreateTask(newTask)).unwrap();
      fetchLists();
      toast.success(result.message || "Task created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create task.");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await dispatch(asyncDeleteTask(taskId)).unwrap();
      fetchLists();
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete task.");
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task))
      );
      await dispatch(asyncUpdateTask({ id: taskId, status: newStatus })).unwrap();
      toast.success("Task status updated!");
    } catch (error) {
      toast.error(error.message || "Failed to update task status.");
      fetchLists();
    }
  };

  const handleAddMemberToTask = async (taskId, memberId) => {
    try {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                members: task.members.includes(memberId)
                  ? task.members
                  : [...task.members, memberId],
              }
            : task
        )
      );
      const task = tasks.find((t) => t._id === taskId);
      await dispatch(
        asyncUpdateTask({
          id: taskId,
          members: task.members.concat(memberId),
        })
      ).unwrap();
      toast.success("Member added to task!");
    } catch (error) {
      toast.error(error.message || "Failed to add member.");
      fetchLists();
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        const result = await dispatch(asyncUpdateTask(taskData)).unwrap();
        setTasks((prev) =>
          prev.map((task) => (task.id === taskData.id ? result.data : task))
        );
        toast.success(result.message || "Task updated successfully!");
      } else {
        const result = await dispatch(asyncCreateTask(taskData)).unwrap();
        setTasks((prev) => [...prev, result.data]);
        toast.success(result.message || "Task created successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save task.");
    } finally {
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleAddNewList = async () => {
    if (!newListTitle || !boardId) {
      toast.error("Please enter a list title.");
      return;
    }
    try {
      const result = await dispatch(asyncCreateList({ title: newListTitle, boardId })).unwrap();
       fetchLists();
      setNewListTitle("");
      toast.success(result.message || "List created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create list.");
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await dispatch(asyncDeleteList(listId)).unwrap();
      fetchLists();
      toast.success("List deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete list.");
      fetchLists();
    }
  };

  const handleRenameList = async (listId, newTitle) => {
    try {
      setData((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId ? { ...list, title: newTitle } : list
        ),
      }));
      toast.success("List renamed successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to rename list.");
      fetchLists();
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchLists();
    } else {
      toast.error("No board ID provided.");
      navigate("/");
    }
  }, [boardId, dispatch, navigate]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6 text-white bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              {data?.boardInfo?.title || "My Board"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              {tasks.filter((task) => task.list !== null).length} tasks on board
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-x-auto p-6 bg-gray-900 bg-opacity-80">
          <div className="flex gap-6 h-full">
            {data?.lists?.map((list) => (
              <ListColumn
                boardId={boardId}
                key={list._id}
                list={list}
                tasks={list.tasks || []}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onAddMemberToTask={handleAddMemberToTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDeleteList={handleDeleteList}
                onRenameList={handleRenameList}
                isDraggingOver={dragOverList === list._id}
                draggedTaskId={draggedTaskId}
              />
            ))}
            <div className="w-80 flex-shrink-0">
              <div className="bg-gray-800 bg-opacity-90 rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title"
                  className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                />
                <button
                  onClick={handleAddNewList}
                  className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 w-full flex items-center gap-2 text-white text-sm font-medium transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TaskModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => {
          fetchLists();
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Board;