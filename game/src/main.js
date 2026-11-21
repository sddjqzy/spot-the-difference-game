// main.js — boots Twin Worlds: build the game, apply a screenshot preset
// when the page is opened with ?shot=..., and start the frame loop.
import { TwinWorldsGame } from './game.js';
import { applyShotPreset } from './shots.js';

const game = new TwinWorldsGame();
applyShotPreset(game);
game.start();
