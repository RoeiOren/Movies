"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const student_post_controller_1 = __importDefault(require("../controllers/student_post_controller"));
const authMiddleware_1 = __importDefault(require("../common/authMiddleware"));
router.get('/', student_post_controller_1.default.get.bind(student_post_controller_1.default));
router.get('/:id', student_post_controller_1.default.getById.bind(student_post_controller_1.default));
router.post('/', authMiddleware_1.default, student_post_controller_1.default.post.bind(student_post_controller_1.default));
router.put('/:id', authMiddleware_1.default, student_post_controller_1.default.putById.bind(student_post_controller_1.default));
router.delete('/:id', authMiddleware_1.default, student_post_controller_1.default.deleteById.bind(student_post_controller_1.default));
exports.default = router;
//# sourceMappingURL=student_post_route.js.map