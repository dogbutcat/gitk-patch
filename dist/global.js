"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageJson = exports.baseDir = void 0;
const path = require("path");
const fs = require("fs-extra");
const pkgDir = require("pkg-dir");
exports.baseDir = pkgDir.sync(__dirname);
exports.packageJson = fs.readJSONSync(path.join(exports.baseDir, "package.json"));
