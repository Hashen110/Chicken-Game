let gameLoop = null;
let eggLoop = null;
const floor = $('#floor');
const basket = $('#basket');
let mouseMove = null;
const main = $('main')
const livesOb = $('#lives');
const scoreOb = $('#score');

$(function () {
    $('.eggs').css('display', 'none');
    basket.css('display', 'none');
});

function collision($div1, $div2) {
    let x1 = $div1.offset().left;
    let y1 = $div1.offset().top;
    let h1 = $div1.outerHeight(true);
    let w1 = $div1.outerWidth(true);
    let b1 = y1 + h1;
    let r1 = x1 + w1;
    let x2 = $div2.offset().left;
    let y2 = $div2.offset().top + 50;
    let h2 = $div2.outerHeight(true);
    let w2 = $div2.outerWidth(true);
    let b2 = y2 + h2;
    let r2 = x2 + w2;
    return !(b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2);
}

function start() {
    let audio = new Audio('assets/mp3/chicken.mp3');
    let lives = 5
    let score = 0;
    audio.play();
    main.append('<img src="assets/img/egg.png" style="left: ' + (Math.floor(Math.random() * ((parseInt(floor.css('width')) - 25) - 25 + 1)) + 25) + 'px" alt="Egg" class="eggs">');
    $('.start').css('display', 'none');
    basket.css('display', 'block');
    $('.eggs').css('display', 'block');
    livesOb.text(lives);
    scoreOb.text(score);
    main.on('mousemove', function (e) {
        basket.css('left', e.pageX - 75)
    });
    let level = $('#level').val();
    let speed = {
        game: level === 'easy' ? 15 : level === 'medium' ? 10 : level === 'hard' ? 5 : 15,
        egg: level === 'easy' ? 6000 : level === 'medium' ? 5000 : level === 'hard' ? 4000 : 6000,
        fall: level === 'easy' ? 3 : level === 'medium' ? 4 : level === 'hard' ? 5 : 3,
    }
    gameLoop = setInterval(function () {
        $('.eggs').each(function () {
            if (collision($(this), floor) && !collision($(this), $('#basket'))) {
                let id = Math.floor(Math.random() * 1000);
                main.append('<img src="assets/img/brokenEgg.png" alt="Broken Egg" id="' + id + '" style="width: 50px; position: absolute; bottom: 1vh; left: ' + $(this).css('left') + '">');
                setTimeout(function () {
                    document.getElementById(id.toString()).remove();
                }, 1500);
                $(this).css({
                    'top': 0,
                    'left': Math.floor(Math.random() * ((parseInt(floor.css('width')) - 25) - 25 + 1)) + 25
                });
                lives--
                livesOb.text(lives);
                if (lives === 0) {
                    gameOver();
                }
            } else if (collision($(this), basket)) {
                $(this).css({
                    'top': 0,
                    'left': Math.floor(Math.random() * ((parseInt(floor.css('width')) - 25) - 25 + 1)) + 25
                });
                score++;
                scoreOb.text(score);
            }
            fallEgg($(this), (Math.floor(Math.random() * speed.fall) + 1));
        });
    }, speed.game);
    let bool = true;
    eggLoop = setInterval(function () {
        main.append('<img src="assets/img/egg.png" style="left: ' + (Math.floor(Math.random() * ((parseInt(floor.css('width')) - 25) - 25 + 1)) + 25) + 'px" alt="Egg" class="eggs">');
        audio.play();
        if (bool) {
            $("p").transition({'font-size': 'calc(1.5rem + 2vw)' }, speed.egg / 2);
            bool = false;
        } else {
            $("p").transition({'font-size': 'calc(1.375rem + 1.5vw)' }, speed.egg / 2);
            bool = true;
        }
    }, speed.egg);
}

function fallEgg(egg, speed) {
    egg.css('top', parseInt(egg.css('top')) + speed)
}

function gameOver() {
    clearInterval(gameLoop);
    clearInterval(eggLoop);
    $('.eggs').remove();
    main.off('mousemove')
    $('.eggs').css('display', 'none');
    basket.css('display', 'none');
    $('.start').css('display', 'block');
}