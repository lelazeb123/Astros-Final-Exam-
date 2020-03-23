class sceneMain extends Phaser.Scene {
    constructor() {
        super('sceneMain');

        this.gameOver = false;
    }
    create() 
    {   
        
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'bg').setOrigin(0, 0);

        this.explodeMusic = this.sound.add('explodeSfx');
        this.mainMusic = this.sound.add('mainMusic');
        this.gameOver = this.sound.add('gameOver');
        this.collectMusic = this.sound.add('collectAstro');

        this.mainMusic.play();
        
        this.debris = this.physics.add.image(0, 0, 'debris');
        this.debris1 = this.physics.add.image(270, 0, 'debris1');
        this.debris2 = this.physics.add.image(150, 0, 'debris2');
        this.debris3 = this.physics.add.image(70, 0, 'debris3');

        //obstacle group
        this.obstacles = this.physics.add.group();
        this.obstacles.add(this.debris);
        this.obstacles.add(this.debris1);
        this.obstacles.add(this.debris2);
        this.obstacles.add(this.debris3);

        this.spaceboy = this.physics.add.image(100, 0, 'astro');
        this.spaceboy1 = this.physics.add.image(0, 0, 'astro');
        this.spaceboy2 = this.physics.add.image(255, 0, 'astro');

        //astro group
        this.spaceboys = this.physics.add.group();
        this.spaceboys.add(this.spaceboy);
        this.spaceboys.add(this.spaceboy1);
        this.spaceboys.add(this.spaceboy2);

        this.ship1 = this.add.sprite(config.width/2 - 50, 0, 'ship1');
        this.player = this.physics.add.sprite(config.width/2, config.height/2 + 200, 'player');
        this.ship2 = this.add.sprite(config.width/2 + 50, 0, 'ship2');

        this.score = 0;
        this.scoreLabel = this.add.bitmapText(10, 4, 'pixelFont', 'SCORE ', 18).setOrigin(0, 0);

        //animation
        this.anims.create({
            key: "anim",
            frames: this.anims.generateFrameNumbers("explode", {
                start: 0,
                end: 10
            }),
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true
          });

        this.anims.create({
            key: "anim1",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 6
            }),
            frameRate: 6,
            repeat: -1
          });
        
        this.anims.create({
            key: "anim2",
            frames: this.anims.generateFrameNumbers("ship1", {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
          });

        this.anims.create({
            key: "anim3",
            frames: this.anims.generateFrameNumbers("ship2", {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
          });

        //animate
        this.player.anims.play("anim1", true);
        this.ship2.anims.play("anim2", true);
        this.ship1.anims.play("anim3", true);

        //keys 
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);

        //collision
        this.physics.add.overlap(this.player, this.obstacles, this.destroyShip, null, this);
        this.physics.add.overlap(this.player, this.spaceboys, this.collectAstro, null, this);
    }

    update() 
    {
        if (gameOver)
        {
            return;
        }

        this.movePlayer();

        //astronauts to catch 
        this.spaceboy.angle += 3;
        this.spaceboy1.angle += 1;
        this.spaceboy2.angle += 2;
        this.moveSpaceboy(this.spaceboy, 4);
        this.moveSpaceboy(this.spaceboy1, 3);
        this.moveSpaceboy(this.spaceboy2, 5);
        
        //obstacles to avoid
        this.debris.angle += 2;
        this.debris1.angle += 2;
        this.debris2.angle += 4;
        this.debris3.angle += 3;
        this.moveAsteroid(this.debris3, 8);
        this.moveAsteroid(this.debris2, 5);
        this.moveAsteroid(this.debris1, 6);
        this.moveAsteroid(this.debris, 7);

        //props
        this.moveShip(this.ship1, 2);
        this.moveShip(this.ship2, 3);

        // background movement
        this.background.tilePositionY -= 0.5;
        
    }


    movePlayer() {

        this.player.setVelocity(0);

        if(this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if(this.cursorKeys.right.isDown){
            this.player.setVelocityX(gameSettings.playerSpeed);
        } else if(this.cursorKeys.up.isDown) {   
            this.player.setVelocityY(-gameSettings.playerSpeed);
        } else if(this.cursorKeys.down.isDown){     
            this.player.setVelocityY(gameSettings.playerSpeed);
        } 
    }

    collectAstro(player, spaceboy) {
        this.resetShipPos(spaceboy);
        this.score += 10;
        this.scoreLabel.text = "SCORE " + this.score;
        var scoreFormated = this.scorePad(this.score, 6);
        this.scoreLabel.text = "SCORE " + scoreFormated;
        this.collectMusic.play();

    }

    destroyShip(player, obstacle) {
        this.player.anims.play('anim', true);
        this.explodeMusic.play();
        this.resetShipPos(obstacle);
        this.mainMusic.pause();
        this.gameOver.play();

        this.physics.pause();
        gameOver = false;

        this.add.bitmapText(config.width / 2 - 150, config.height / 2 - 50, 'pixelFont', 'GAME OVER', 80);
        this.time.addEvent({
            delay: 1000,
            callback: this.restartGame,
            callbackScope: this,
            loop: false
        });
    }

    //movement of debris
    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > 680) {
            this.resetShipPos(ship);
        }
    }

    moveSpaceboy(spaceboy, speed) {
        spaceboy.y += speed;
        if (spaceboy.y > 680) {
            this.resetShipPos(spaceboy);
        }
    }

    moveAsteroid(asteroid, speed) {
        asteroid.y += speed;
        if (asteroid.y > 680) {
            this.resetShipPos(asteroid);
        }
    }

    // reset position
    resetShipPos(ship) {
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, 650);
        ship.x = randomX;
    }

    resetSpaceboyPos(spaceboy) {
        spaceboy.y = 0;
        var randomX = Phaser.Math.Between(0, 650);
        spaceboy.x = randomX;
    }

    resetAsteroidPos(asteroid) {
        asteroid.y = 0;
        var randomX = Phaser.Math.Between(0, 650);
        asteroid.x = randomX;
    }

    // aesthetic score
    scorePad(number, size) {
        var stringNumber = String(number);
        while(stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }

        return stringNumber;
    }

    // try again function 
    restartGame() {
        this.tryAgain = this.add.bitmapText(config.width / 2 - 30, config.height / 2 + 50, 'pixelFont', 'TRY AGAIN', 20);
        this.tryAgain.setInteractive().on('pointerdown', () => {
            this.scene.start('sceneMain');
            this.gameOver.pause();
        });
    }

}