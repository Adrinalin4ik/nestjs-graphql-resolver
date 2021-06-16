"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLTypesLoader = void 0;
const tslib_1 = require("tslib");
const merge_1 = require("@graphql-tools/merge");
const common_1 = require("@nestjs/common");
const glob = require("fast-glob");
const fs = require("fs");
const lodash_1 = require("lodash");
const util = require("util");
const normalize = require('normalize-path');
const readFile = util.promisify(fs.readFile);
let GraphQLTypesLoader = class GraphQLTypesLoader {
    mergeTypesByPaths(paths) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!paths || paths.length === 0) {
                return null;
            }
            const types = yield this.getTypesFromPaths(paths);
            const flatTypes = lodash_1.flatten(types);
            return merge_1.mergeTypeDefs(flatTypes, {
                throwOnConflict: true,
                commentDescriptions: true,
                reverseDirectives: true,
            });
        });
    }
    getTypesFromPaths(paths) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const includeNodeModules = this.includeNodeModules(paths);
            paths = Array.isArray(paths)
                ? paths.map((path) => normalize(path))
                : normalize(paths);
            const filePaths = yield glob(paths, {
                ignore: includeNodeModules ? [] : ['node_modules'],
            });
            if (filePaths.length === 0) {
                throw new Error(`No type definitions were found with the specified file name patterns: "${paths}". Please make sure there is at least one file that matches the given patterns.`);
            }
            const fileContentsPromises = filePaths.sort().map((filePath) => {
                return readFile(filePath.toString(), 'utf8');
            });
            return Promise.all(fileContentsPromises);
        });
    }
    includeNodeModules(pathOrPaths) {
        if (Array.isArray(pathOrPaths)) {
            return pathOrPaths.some((path) => path.includes('node_modules'));
        }
        return pathOrPaths.includes('node_modules');
    }
};
GraphQLTypesLoader = tslib_1.__decorate([
    common_1.Injectable()
], GraphQLTypesLoader);
exports.GraphQLTypesLoader = GraphQLTypesLoader;
