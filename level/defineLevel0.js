const defineLevel = () => {
    const skipIntro = false

    world.useReflections = true

    player.allowFly = true


    const color = {
        rock: "#909190",
        cave: "#5b5b5b"
    }


    spawn.bush(-200, 70, 2)

    spawn.tree(150, 0, 1)

    spawn.bush(100, 70, 4)

    spawn.flowers(0, 80, 3)

    spawn.flowers(220, 80, 9)

    spawn.gears(0, -100)

    define.gear(0, -100, 100)



    //spawn.bush(500, -30, 1)
    //spawn.bush(450, 0, 1)
    //spawn.bush(400, 30, 1)

    define.object(1000, -300, 900, 800, "#373737", 1, -1)

    //too tired to explain all this man just go dfind it out urself
    define.object(1000, -600, 500, 1000, "#373737", 1, -1)

    spawn.rock(550, 40, 1, 10, 1)
    spawn.rock(800, -20, 10, 10, 1)
    spawn.rock(1000, -20, 10, 10, 0)
    spawn.rock(1200, -20, 10, 10, 0)
    spawn.rock(1300, 20, 10, 10, 0)
    spawn.rock(1000, -150, 10, 10, 1)
    spawn.rock(1200, -150, 10, 10, 1)
    spawn.rock(950, -200, 1, 10, 1)
    spawn.rock(950, -250, 1, 10, 1)
    spawn.rock(950, -300, 1, 10, 1)
    spawn.rock(950, -350, 1, 10, 1)
    spawn.rock(950, -400, 1, 10, 1)



    spawn.rock(600, 0, 4, 10)


    //ground
    define.object(-500, 100, 1200, 200, '#61471b', 0)
    define.object(-500, 100, 1200, 10, '#267126', 0)

    define.object(-600, -400, 300, 1000, '#61471b', 0)

    //first jumps
    define.object(600, 50, 1000, 300, color.cave)

    define.object(1000, -600, 300, 500, color.cave)

    //annoying ass crawl
    //define.object(1200, -550, 300, 500, "#5b5b5b")


    define.object(800, 0, 800, 500, color.cave) //part before you have to fly up to the thing

    define.object(1850, -200, 1000, 700, color.cave) //ledge you have to fly up to

    spawn.hydrant(50, 54)

    spawn.foliage(-300, 97, 50, 900)


    define.image(1700, 100, 60, 60, 90, "warn", 1)


    define.text(-100, -50, 30, 'evil cat server', 'Archivo Black', '#ffffff')
    define.text(-100, -25, 20, 'an official ecg server', 'Archivo', '#e7e7e7')


    set.water(0)

    if(!skipIntro) {

        camera.follow = false;
        player.animation = "freefall";
        player.canMove = false;
        player.y = -500
        camera.y = 0;
        audio.fall.volume = 0.2
        audio.fall.play();

        (async() => {
            while(1) {
                if(player.onFloor) {
                    audio.impact.volume = .3
                    audio.impact.play()
                    player.animation = "dead"
                    spawnFluidSplash(player.x, player.y+50, 100, "blood")
                    spawnBloodPool(player.x, player.y, 5)
                    await wait(2000)
                    player.animation = "standup"
                    await wait(2000)
                    player.animation = "idle"
                    camera.follow = true
                    player.canMove = true
                    loadJetCatTextures();
                    return
                }
                await wait(1)
            }
        })()


    }

}
