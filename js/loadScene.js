class loadScene extends Phaser.Scene {
    constructor() {
      super("loadScene");
    }
  
     preload()
    {
        // background
        this.load.image('bg', 'assets/background.png');
        
        // load debris
        this.load.image('debris', 'assets/images/asteroid1.png');
        this.load.image('debris1', 'assets/images/asteroid2.png');
        this.load.image('debris2', 'assets/images/asteroid3.png');
        this.load.image('debris3', 'assets/images/asteroid4.png');
        this.load.image('astro', ['assets/images/astro-1.png']);

        // audio files
        this.load.audio('menuMusic', 'assets/audio/menu.mp3');
        this.load.audio('explodeSfx', 'assets/audio/explosion.mp3');
        this.load.audio('mainMusic', 'assets/audio/main.mp3');
        this.load.audio('gameOver', 'assets/audio/gameover.mp3');
        this.load.audio('collectAstro', 'assets/audio/pickup.mp3');
        
        // spritesheets
        this.load.spritesheet('explode', 'assets/images/explosion.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('ship1', 'assets/images/enemy-big.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('ship2', 'assets/images/enemy-medium.png', {frameWidth: 33, frameHeight: 16});
        this.load.spritesheet('player', 'assets/images/player.png', {frameWidth: 21, frameHeight: 26});

        // font
        this.load.bitmapFont('pixelFont', "assets/font/font.png", "assets/font/font.xml");

        // loading screen
        for(var i = 0; i < 100; i++){
            this.load.audio('collectAstro' + i, 'assets/audio/pickup.mp3');
            this.load.spritesheet('ship1' + i, 'assets/images/enemy-big.png', {frameWidth: 32, frameHeight: 32});
            this.load.spritesheet('ship2' + i, 'assets/images/enemy-medium.png', {frameWidth: 33, frameHeight: 16});
            this.load.spritesheet('player' + i, 'assets/images/player.png', {frameWidth: 21, frameHeight: 26});

            this.load.bitmapFont('pixelFont' + i, "assets/font/font.png", "assets/font/font.xml");
        }

        var progressBar = this.add.graphics({
            fillstyle: {
                color: 0xfffff
            }
        });
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(35, 200, 320, 50);
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 + 20,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (percent)=>{
            progressBar.fillRect(0, config.width / 2, config.height * percent, 50); 
            console.log(percent);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(45, 210, 300 * percent, 30);
        });
                    
        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });
        
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            console.log('complete');
        });


    }
  
    create() {
        this.menuMusic = this.sound.add('menuMusic');
        this.mainMusic = this.sound.add('mainMusic');
        this.menuMusic.play();

        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'bg').setOrigin(0, 0);

        var hoverSprite = this.add.sprite(100, 100, 'player');
        hoverSprite.setVisible(false);

        this.anims.create({
            key: "anim0",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [2, 3]
            }),
            frameRate: 6,
            repeat: -1
          });
        
        this.add.bitmapText(config.width / 2 - 140, config.height / 2 - 100, 'pixelFont', '< ASTROS >', 80);
        this.add.bitmapText(config.width / 2 - 60, config.height / 2 - 50 , 'pixelFont', '< COLLECT ASTRONAUTS >', 14);
        this.startGame = this.add.bitmapText(config.width / 2 - 50, config.height / 2, 'pixelFont', 'START GAME', 24).setOrigin(0, 0);
        this.startGame.setTintFill(['0x86979E']);
        this.startGame.setInteractive();
        this.startGame.on('pointerdown', () => {
            this.menuMusic.pause();
            this.scene.start("sceneMain");
        });
        this.startGame.on('pointerover', () => {
            hoverSprite.setVisible(true);
            hoverSprite.anims.play("anim0", true);
            hoverSprite.x = this.startGame.x - 20;
            hoverSprite.y = this.startGame.y + 10;
        });
        this.startGame.on('pointerout', () => {
            hoverSprite.setVisible(false);
        });
      
    }

    update () {
        this.background.tilePositionY -= 0.5;
        
    }
  }