<?php
require_once 'util/main.php';
$overlay = $_SESSION['overlay'];
?>

    <!-- Conditionally include header (avoids duplicate <head> section when a lightbox form is
    rendered -->
<?php if (!$overlay) : ?>
    <?php include 'view/header.php'; ?>
<?php endif; ?>

    <div class="dashboard" id="dashboard">
        <?php include 'sidebar.php'; ?>

        <section class="mainBoard">
            <header class="mainBoardHeader">
                <h1 id="boardTitle"></h1>
                <div class="mainBoardHeaderActions">
                    <button class="button secondary large" id="addNewTaskButton">
                        Add New Task
                    </button>
                    <div class="kebab" id="mainBoardHeaderKebab">
                        <svg xmlns="http://www.w3.org/2000/svg" width="5" height="20"
                             viewBox="0 0 5 20">
                            <circle cx="2.30769" cy="2.30769" r="2.30769" fill="#828FA3"/>
                            <circle cx="2.30769" cy="10.0001" r="2.30769" fill="#828FA3"/>
                            <circle cx="2.30769" cy="17.6922" r="2.30769" fill="#828FA3"/>
                        </svg>
                    </div>
                </div>
            </header>
            <section class="canvas" id="canvas">
                <!-- Dynamically generated content -->
            </section>
        </section>
    </div>

<?php include 'view/footer.php'; ?>