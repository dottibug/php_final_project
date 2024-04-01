<?php
require_once 'util/main.php';
require_once 'model/BoardsDB.php';

$BoardsDB = new BoardsDB();
$numberOfBoards = $BoardsDB->getNumberOfBoards($userID);

?>

<section class="sidebar">
    <div class="sidebarLogo">
        <?php include 'view/logo.php'; ?>
    </div>
    <h1>ALL BOARDS(<?php echo $numberOfBoards; ?>)</h1>
    <nav class="boardsNav">
        <ul class="boards" id="boards">
            <!-- Boards generated via fetch api -->

            <!-- Create Board -->
            <li class="board createBoard" id="createNewBoard">
                <img src="../images/iconBoardPurple.svg" alt="" class="iconBoard">
                <span class="boardLink">Create New Board</span>
            </li>
        </ul>
    </nav>
</section>
