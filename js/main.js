var player;
var score;
var obstacle;
var gameOver = false;
var game;
var config;
var gameSettings = {
    playerSpeed: 200,
}
window.onload = function() {
    config = {
        type: Phaser.AUTO,
        width: 400,
        height: 500,
        backgroundColor: 0x000000,
        parent: 'phaser-game',
        scene: [loadScene, sceneMain],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        pixelArt: true
    };
    game = new Phaser.Game(config);
}