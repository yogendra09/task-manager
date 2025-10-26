const router = require("express").Router();
const apiController = require("../controllers/api.controller.js");
const { isAuthenticated } = require("../middlewares/authenticate.js");


router.get("/current-user", isAuthenticated, apiController.currentUser);
router.post("/register", apiController.register);
router.post("/login", apiController.login);
router.post("/logout", apiController.logout);

// Board Routes
router.post("/boards", isAuthenticated, apiController.createBoard);
router.get("/boards", isAuthenticated, apiController.getAllBoards);
router.get("/boards/:id", isAuthenticated, apiController.getBoardById);
router.put("/boards/:id", isAuthenticated, apiController.updateBoard);
router.delete("/boards/:id", isAuthenticated, apiController.deleteBoard);
router.post("/boards/:id/members", isAuthenticated, apiController.addMemberToBoard);
router.get("/boardmembers/:id", isAuthenticated, apiController.getBoardMembers);

router.post("/tasks", isAuthenticated, apiController.createTask);
// router.get("/tasks", apiController.getAllTasks);
// router.get("/tasks/:id", apiController.getTaskById);
router.put("/tasks/:id", isAuthenticated, apiController.updateTask);
router.delete("/tasks/:id", isAuthenticated, apiController.deleteTask);
router.post("/update-task-details", isAuthenticated, apiController.updateTaskDetails);

// List Routes
router.post("/lists", isAuthenticated, apiController.createList);
router.get("/lists", isAuthenticated,  apiController.getAllLists);
router.get("/lists/:boardId", isAuthenticated, apiController.getBoardLists);
router.put("/lists/:id", isAuthenticated, apiController.updateList);
router.delete("/lists/:id", isAuthenticated, apiController.deleteList);

module.exports = router;
