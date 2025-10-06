"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
async function seed() {
    await (0, node_fetch_1.default)('http://localhost:4001/seed', { method: 'POST' });
    console.log('Seeded basic users/teams.');
}
seed();
