var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var targetScore = 1000; // Set your target score here
var maxMoves = 10;      // Set the maximum number of moves allowed
var currentMoves = 0;

var currTile;
var otherTile;

window.onload = function() {
    startGame();

    window.setInterval(function() {
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = []
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);

    currentMoves = 0;

    // Update the UI with the target score and remaining moves
    document.getElementById("targetScore").innerText = targetScore;
    document.getElementById("remainingMoves").innerText = maxMoves - currentMoves;
}

function dragStart() {
    currTile = this;
}

function dragOver(event) {
    event.preventDefault();
}

function dragEnter(event) {
    event.preventDefault();
    this.style.backgroundColor = "lightblue";
}

function dragLeave(event) {
    event.preventDefault();
    this.style.backgroundColor = "";
}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;
    let moveUp = c == c2 && r2 == r - 1;
    let moveDown = c == c2 && r2 == r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        this.style.backgroundColor = "";
        if (currTile && otherTile) {
            let temp = currTile.src;
            currTile.src = otherTile.src;
            otherTile.src = temp;

            let validMove = checkValid();
            if (!validMove) {
                this.style.backgroundColor = "";
                if (currTile && otherTile) {
                    let temp = currTile.src;
                    currTile.src = otherTile.src;
                    otherTile.src = temp;
                }
            } else {
                currentMoves++;
                checkGameStatus();
            }
        }
    }
}

function crushCandy() {
    crushFive();
    crushFour();
    crushThree();
    document.getElementById("score").innerText = score;
    document.getElementById("remainingMoves").innerText = maxMoves - currentMoves;
}

function crushThree() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function crushFour() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            let candy4 = board[r][c + 3];
            if (candy1.src === candy2.src && candy2.src === candy3.src && candy3.src === candy4.src && !candy1.src.includes("blank")) {
                for (let i = 0; i < 4; i++) {
                    board[r][c + i].src = "./images/blank.png";
                }
                score += 40;
                generateCandy();
                activateStripedCandy("horizontal");
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            let candy4 = board[r + 3][c];
            if (candy1.src === candy2.src && candy2.src === candy3.src && candy3.src === candy4.src && !candy1.src.includes("blank")) {
                for (let i = 0; i < 4; i++) {
                    board[r + i][c].src = "./images/blank.png";
                }
                score += 40;
                generateCandy();
                activateStripedCandy("vertical");
            }
        }
    }
}

function crushFive() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 4; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            let candy4 = board[r][c + 3];
            let candy5 = board[r][c + 4];
            if (candy1.src === candy2.src && candy2.src === candy3.src && candy3.src === candy4.src && candy4.src === candy5.src && !candy1.src.includes("blank")) {
                for (let i = 0; i < 5; i++) {
                    board[r][c + i].src = "./images/blank.png";
                }
                score += 50;
                generateCandy();
                activateChocoBlast(candy1.src);
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 4; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            let candy4 = board[r + 3][c];
            let candy5 = board[r + 4][c];
            if (candy1.src === candy2.src && candy2.src === candy3.src && candy3.src === candy4.src && candy4.src === candy5.src && !candy1.src.includes("blank")) {
                for (let i = 0; i < 5; i++) {
                    board[r + i][c].src = "./images/blank.png";
                }
                score += 50;
                generateCandy();
                activateChocoBlast(candy1.src);
            }
        }
    }
}

function checkValid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    return false;
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}

function activateStripedCandy(direction) {
    if (direction === "horizontal") {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (board[r][c].src.includes("striped_horizontal")) {
                    for (let i = 0; i < columns; i++) {
                        if (!board[r][i].src.includes("blank")) {
                            board[r][i].src = "./images/blank.png";
                            score += 10;  // Adjust score increment as needed
                        }
                    }
                    document.getElementById("score").innerText = score;
                    break;
                }
            }
        }
    } else if (direction === "vertical") {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (board[r][c].src.includes("striped_vertical")) {
                    for (let i = 0; i < rows; i++) {
                        if (!board[i][c].src.includes("blank")) {
                            board[i][c].src = "./images/blank.png";
                            score += 10;  // Adjust score increment as needed
                        }
                    }
                    document.getElementById("score").innerText = score;
                    break;
                }
            }
        }
    }
}

function activateChocoBlast(candySrc) {
    let candyColor = candySrc.split("/").pop().split(".")[0];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c].src.includes(candyColor) && !board[r][c].src.includes("blank")) {
                board[r][c].src = "./images/blank.png";
                score += 20;  // Adjust score increment as needed
            }
        }
    }
    document.getElementById("score").innerText = score;
}

function checkGameStatus() {
    if (score >= targetScore) {
        alert("Congratulations! You've reached the target score!");
        window.location.reload();  // Optionally restart the game or redirect to another page
    } else if (currentMoves >= maxMoves) {
        alert("Game Over! You've exceeded the maximum number of moves.");
        window.location.reload();  // Optionally restart the game or redirect to another page
    } else {
        document.getElementById("remainingMoves").innerText = maxMoves - currentMoves;
    }
}

var hintTimer;
var idleTime = 5000; // 5 seconds of idleness before showing a hint

window.onload = function() {
    startGame();

    window.setInterval(function() {
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);

    document.addEventListener('click', resetHintTimer);
    document.addEventListener('dragstart', resetHintTimer);
    document.addEventListener('drop', resetHintTimer);
    document.addEventListener('dragend', resetHintTimer);

    startHintTimer();
};

function resetHintTimer() {
    clearTimeout(hintTimer);
    startHintTimer();
}

function startHintTimer() {
    hintTimer = setTimeout(showHint, idleTime);
}

function showHint() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (candy1.src === candy2.src && !candy1.src.includes("blank")) {
                if (c + 3 < columns && board[r][c + 3].src === candy1.src) {
                    highlightHint(candy1, board[r][c + 3]);
                    return;
                }
                if (c - 1 >= 0 && board[r][c - 1].src === candy1.src) {
                    highlightHint(candy1, board[r][c - 1]);
                    return;
                }
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (candy1.src === candy2.src && !candy1.src.includes("blank")) {
                if (r + 3 < rows && board[r + 3][c].src === candy1.src) {
                    highlightHint(candy1, board[r + 3][c]);
                    return;
                }
                if (r - 1 >= 0 && board[r - 1][c].src === candy1.src) {
                    highlightHint(candy1, board[r - 1][c]);
                    return;
                }
            }
        }
    }
}

function highlightHint(candy1, candy2) {
    candy1.classList.add('hint');
    candy2.classList.add('hint');
    setTimeout(() => {
        candy1.classList.remove('hint');
        candy2.classList.remove('hint');
    }, 2000); // Highlight hint for 2 seconds
}
