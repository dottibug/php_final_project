<?php
require_once 'util/main.php';
?>

<section class="sidebar">
    <div class="sidebarLogo">
        <?php include 'view/logo.php'; ?>
    </div>
    <h1 id="sidebarHeading"></h1>
    <nav class="boardsNav">
        <ul class="boards" id="boards">
            <!-- Boards generated via fetch api -->

            <!-- Create Board -->
            <li class="board createBoard" id="createNewBoard">
                <img src="../images/iconBoardPurple.svg" alt="" class="iconBoard">
                <span class="boardLink">Create New Board</span>
            </li>
        </ul>

        <!-- Logout Button -->
        <form action="../fetch/fetchController.php" method="post">
            <input type="hidden" name="action" value="logout">
            <button class="button secondary small" id="logoutButton">Logout</button>
        </form>

    </nav>
</section>
