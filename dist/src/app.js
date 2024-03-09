"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const env_config_1 = __importDefault(require("./config/env.config"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const auth_routes_1 = __importDefault(require("./express/routes/auth.routes"));
const user_routes_1 = __importDefault(require("./express/routes/user.routes"));
const post_routes_1 = __importDefault(require("./express/routes/post.routes"));
const errorMiddleware_1 = require("./express/errorMiddleware");
const initializeSwagger = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Movies Application REST API',
                version: '1.0.0',
                description: 'HTTP server including authentication using JWT and refresh token',
            },
            servers: [{ url: 'http://localhost:3000' }],
        },
        apis: ['./src/express/routes/*.ts'],
    };
    const specs = (0, swagger_jsdoc_1.default)(options);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
});
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_config_1.default.mongo.url, { dbName: env_config_1.default.mongo.dbName });
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.log('Error connecting to MongoDB', err.message);
        throw err;
    }
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)('dev'));
    app.use((0, express_1.static)('public'));
    app.use('/auth', auth_routes_1.default);
    app.use('/users', user_routes_1.default);
    app.use('/posts', post_routes_1.default);
    initializeSwagger(app);
    app.use('*', (_req, res) => {
        res.status(404).send('Invalid Route');
    });
    app.use(errorMiddleware_1.errorMiddleware);
    return app;
});
exports.default = initApp;
//# sourceMappingURL=app.js.map