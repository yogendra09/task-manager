// types.js
export const LIST_TYPES = {
  TODO: 'To Do',
  DOING: 'Doing',
  DONE: 'Done'
};

export const TASK_STATUS = {
  TODO: 'todo',
  DOING: 'doing',
  DONE: 'done'
};

export const MEMBERS = [
  { id: 1, name: 'John Doe', avatar: 'JD', color: 'bg-blue-500' },
  { id: 2, name: 'Jane Smith', avatar: 'JS', color: 'bg-green-500' },
  { id: 3, name: 'Mike Johnson', avatar: 'MJ', color: 'bg-purple-500' },
  { id: 4, name: 'Sarah Wilson', avatar: 'SW', color: 'bg-yellow-500' }
];

export const DEFAULT_LISTS = [
  { id: 'todo', title: 'To Do', type: LIST_TYPES.TODO },
  { id: 'doing', title: 'Doing', type: LIST_TYPES.DOING },
  { id: 'done', title: 'Done', type: LIST_TYPES.DONE }
];