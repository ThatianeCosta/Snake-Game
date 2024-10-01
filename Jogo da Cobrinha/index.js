(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // canvas tamanho
  const canvasSize = 680;
  const w = (canvas.width = canvasSize);
  const h = (canvas.height = canvasSize);
  const canvasFillColor = "#001866";
  const canvasStrokeColor = "rgba(211, 211, 211, 0.19)";

  const scoreEl = document.getElementById("score");
  const resetEl = document.getElementById("reset");
  const showGridEl = document.getElementById("show-grid");
  const highScoreEl = document.getElementById("high-score");
  const pauseEl = document.getElementById("pause");
  const playEl = document.getElementById("play");

  let score = 0;

  const setScore = () => {
    scoreEl.innerHTML = `Pontuação 👉 ${score}`;
    if (score >= localStorage.getItem("highScore"))
      localStorage.setItem("highScore", score);
    highScoreEl.innerHTML = `Pontuação Máxima 🚀 ${localStorage.getItem("highScore")}`;
  };

  // frame rate
  const frameRate = 9.5;

  // preenchimentovda grade
  const pGrid = 4;
  // largura da grade
  const grid_line_len = canvasSize - 2 * pGrid;
  //  contagem de células
  const cellCount = 44;
  // tamanho da célula
  const cellSize = grid_line_len / cellCount;

  let gameActive;

  // Isso vai gerar uma cor aleatória para a cabeça
  const randomColor = () => {
    let color;
    let colorArr = ["#ffcc00", "#00bfff"];
    color = colorArr[Math.floor(Math.random() * 2)];
    return color;
  };

  const head = {
    x: 2,
    y: 1,
    color: randomColor(),
    vX: 0,
    vY: 0,
    draw: () => {
      ctx.fillStyle = head.color;
      ctx.shadowColor = head.color;
      ctx.shadowBlur = 2.5;
      ctx.fillRect(
        head.x * cellSize + pGrid,
        head.y * cellSize + pGrid,
        cellSize,
        cellSize
      );
    },
  };

  let tailLength = 4;
  let snakeParts = [];
  class Tail {
    color = "#00ff1e";
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 2.5;
      ctx.fillRect(
        this.x * cellSize + pGrid,
        this.y * cellSize + pGrid,
        cellSize,
        cellSize
      );
    }
  }

  const food = {
    x: 5,
    y: 5,
    color: "#ff0000",
    draw: () => {
      ctx.fillStyle = food.color;
      ctx.shadowColor = food.color;
      ctx.shadowBlur = 5;
      ctx.fillRect(
        food.x * cellSize + pGrid,
        food.y * cellSize + pGrid,
        cellSize,
        cellSize
      );
    },
  };

  // Isso definirá o estilo do canvas
  const setCanvas = () => {
    // canvas preencher
    ctx.fillStyle = canvasFillColor;
    ctx.fillRect(0, 0, w, h);

    // canvas contorno
    ctx.strokeStyle = canvasStrokeColor;
    ctx.strokeRect(0, 0, w, h);
  };

  //   Isso desenhará a grade
  const drawGrid = () => {
    ctx.beginPath();
    for (let i = 0; i <= grid_line_len; i += cellSize) {
      ctx.moveTo(i + pGrid, pGrid);
      ctx.lineTo(i + pGrid, grid_line_len + pGrid);
    }
    for (let i = 0; i <= grid_line_len; i += cellSize) {
      ctx.moveTo(pGrid, i + pGrid);
      ctx.lineTo(grid_line_len + pGrid, i + pGrid);
    }
    ctx.closePath();
    ctx.strokeStyle = canvasStrokeColor;
    ctx.stroke();
  };

  const drawSnake = () => {
    // Percorra nosso array snakeparts
    snakeParts.forEach((part) => {
      part.draw();
    });

    snakeParts.push(new Tail(head.x, head.y));

    if (snakeParts.length > tailLength) {
      snakeParts.shift(); //remove o item mais distante da parte da cobra se tivermos mais do que o tamanho da nossa cauda
    }
    head.color = randomColor();
    head.draw();
  };

  const updateSnakePosition = () => {
    head.x += head.vX;
    head.y += head.vY;
  };

  const changeDir = (e) => {
    let key = e.keyCode;

    if (key == 68 || key == 39) {
      if (head.vX === -1) return;
      head.vX = 1;
      head.vY = 0;
      gameActive = true;
      return;
    }
    if (key == 65 || key == 37) {
      if (head.vX === 1) return;
      head.vX = -1;
      head.vY = 0;
      gameActive = true;
      return;
    }
    if (key == 87 || key == 38) {
      if (head.vY === 1) return;
      head.vX = 0;
      head.vY = -1;
      gameActive = true;
      return;
    }
    if (key == 83 || key == 40) {
      if (head.vY === -1) return;
      head.vX = 0;
      head.vY = 1;
      gameActive = true;
      return;
    }
  };

  const foodCollision = () => {
    let foodCollision = false;
    snakeParts.forEach((part) => {
      if (part.x == food.x && part.y == food.y) {
        foodCollision = true;
      }
    });
    if (foodCollision) {
      food.x = Math.floor(Math.random() * cellCount);
      food.y = Math.floor(Math.random() * cellCount);
      score++;
      tailLength++;
    }
  };

  const isGameOver = () => {
    let gameOver = false;

    snakeParts.forEach((part) => {
      if (part.x == head.x && part.y == head.y) {
        gameOver = true;
      }
    });

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x > cellCount - 1 ||
      head.y > cellCount - 1
    ) {
      gameOver = true;
    }

    return gameOver;
  };

  const showGameOver = () => {
    const text = document.createElement("div");
    text.setAttribute("id", "game_over");
    text.innerHTML = "game over !";
    const body = document.querySelector("body");
    body.appendChild(text);
  };

  addEventListener("keydown", changeDir);

  const PlayButton = (show) => {
    if (!show) {
      playEl.style.display = "none";
    } else {
      playEl.style.display = "block";
    }
  };

  const pauseGame = () => {
    gameActive = false;
    if(!gameActive) {
      pauseEl.removeAttribute('class');
      pauseEl.setAttribute('class', 'pause-not-active')
    }
    if (!isGameOver()) PlayButton(true);
  };

  pauseEl.addEventListener("click", pauseGame);

  let showGrid = false;

  // Isso iniciará tudo
  const animate = () => {
    setCanvas();
    if (showGrid) drawGrid();
    drawSnake();
    food.draw();
    if (gameActive) {
      PlayButton(false);
      pauseEl.removeAttribute('class');
      pauseEl.setAttribute('class','pause-active');
      updateSnakePosition();
      if (isGameOver()) {
        showGameOver();
        PlayButton(false);
        return;
      }
    }
    setScore();
    foodCollision();
    setTimeout(animate, 1000 / frameRate);
  };

  const resetGame = () => {
    location.reload();
  };

  resetEl.addEventListener("click", resetGame);

  const toggleGrid = () => {
    if (!showGrid) {
      showGrid = true;
      showGridEl.innerHTML = `Esconder Grade`
      return;
    }
    showGrid = false;
    showGridEl.innerHTML=`Mostrar Grade`
  };

  showGridEl.addEventListener("click", toggleGrid);
  animate();
})();
