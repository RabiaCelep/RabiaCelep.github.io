let canvas, ctx;
let cat, owner;
let score = 0;
let gameCompleted = false;
let backgroundImg = new Image();

const totalRequiredScore = 30;
let completedActivities = new Set();

// Sahne tanımları
const scenes = [
    {
        name: "bedroom",
        background: "backgrounds/bedroom.jpg",
        ownerImage: "characters/owner_sleeping.png",
        score: 0
    },
    {
        name: "clean",
        background: "backgrounds/cleaning.jpg",
        ownerImage: "characters/owner_cleaning.png",
        score: 10
    },
    {
        name: "cook",
        background: "backgrounds/cooking.jpg",
        ownerImage: "characters/owner_cooking.png",
        score: 10
    },
    {
        name: "read",
        background: "backgrounds/reading.jpg",
        ownerImage: "characters/owner_reading.png",
        score: 10
    }
];

let currentSceneIndex = 0;

function loadScene(index) {
    const scene = scenes[index];
    backgroundImg.src = scene.background;
    owner.currentImage.src = scene.ownerImage;
}
//Oyun başlatma fonksiyonu
function startGame() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    cat = {
        x: 50, y: 50, width: 80, height: 80,
        image: new Image(),
        speedX: 0, speedY: 0,
        gravity: 0.5,
        jumpPower: -10,
        isJumping: false,
        meow: new Audio("sounds/meow.mp3")
    };
    cat.image.src = "images/cat.png";

    owner = {
        x: 200, y: 200, width: 120, height: 120,
        currentImage: new Image()
        

    };
    owner.x = canvas.width / 2 - owner.width / 2;
          owner.y = 200;

           cat.x = 20;
            cat.y = canvas.height - cat.height - 10;

    loadScene(currentSceneIndex); // İlk sahne

    window.addEventListener("keydown", moveCat);
    window.addEventListener("keyup", stopCat);

    let loadedImages = 0;
    const totalImages = 3;

    [backgroundImg, cat.image, owner.currentImage].forEach(img => {
        img.onload = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
                setInterval(updateGame, 1000 / 60);
            }
        };
    });
}
//Kedi haraketleri tanımı
function moveCat(e) {
    switch (e.key) {
        case "ArrowRight":
            cat.speedX = 2;
            break;
        case "ArrowLeft":
            cat.speedX = -2;
            break;
        case "ArrowUp":
            cat.speedY = -2;
            break;
        case "ArrowDown":
            cat.speedY = 2;
            break;
        case "w":
            if (!cat.isJumping) {
                cat.speedY = cat.jumpPower;
                cat.isJumping = true;
            }
            break;
        case " ":
            cat.meow.play();
            owner.x += 10;

            if (owner.x + owner.width >= canvas.width) {
                showActivityMenu();
            }
            break;
    }
}

function stopCat(e) {
    cat.speedX = 0;
    if (e.key !== "w") {
        cat.speedY = 0;
    }
}
//Aktivite menüsü tanımı ve kullanımı
function showActivityMenu() {
    const menu = document.getElementById("activityMenu");
    menu.innerHTML = "<h3>Bir aktivite seç:</h3>";

    let available = 0;

    scenes.forEach(scene => {
        if (scene.name !== "bedroom" && !completedActivities.has(scene.name)) {
            const btn = document.createElement("button");
            btn.textContent = scene.name;
            btn.onclick = () => selectActivity(scene.name);
            menu.appendChild(btn);
            available++;
        }
    });

    if (available === 0 && !gameCompleted) {
        gameCompleted = true;
        showGameMessage("Tüm aktiviteler tamamlandı!");
        return;
    }

    menu.style.display = "block";
}
//Aktivite seçimi, skor artışı, oyun tamamlanması halinde çıkan mesaj bildirimi
function selectActivity(activityName) {
    document.getElementById("activityMenu").style.display = "none";

    const selectedScene = scenes.find(scene => scene.name === activityName);
    if (selectedScene) {
        currentSceneIndex = scenes.indexOf(selectedScene);
        score += selectedScene.score;
        completedActivities.add(activityName);
        loadScene(currentSceneIndex);
        owner.x = canvas.width / 2 - owner.width / 2;
          owner.y = 200;

         cat.x = 20;
         cat.y = canvas.height - cat.height - 10;

    }

    if (score >= totalRequiredScore && !gameCompleted) {
        gameCompleted = true;
        showGameMessage("Tebrikler! Tüm aktiviteleri başarıyla tamamladınız!");
    }
}
//Kedi haraketi, owner haraketi, sahne güncellemesi, oyunun gerçek zamanlı olarak işlenmesi
function updateGame() {
    cat.x += cat.speedX;
    cat.speedY += cat.gravity;
    cat.y += cat.speedY;

    const groundY = 250;
    if (cat.y >= groundY) {
        cat.y = groundY;
        cat.speedY = 0;
        cat.isJumping = false;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(cat.image, cat.x, cat.y, cat.width, cat.height);
    ctx.drawImage(owner.currentImage, owner.x, owner.y, owner.width, owner.height);

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Skor: " + score, 10, 30);
}

function showGameMessage(text) {
    document.getElementById("gameMessage").textContent = text;
    document.getElementById("gameMessage").style.display = "block";
    document.getElementById("restartBtn").style.display = "block";
}

function restartGame() {
    score = 0;
    gameCompleted = false;
    currentSceneIndex = 0;
    completedActivities.clear();
    loadScene(currentSceneIndex);
    owner.x = canvas.width / 2 - owner.width / 2;
    owner.y = 200;

    cat.x = 20;
    cat.y = canvas.height - cat.height - 10;

    document.getElementById("gameMessage").style.display = "none";
    document.getElementById("restartBtn").style.display = "none";
}

