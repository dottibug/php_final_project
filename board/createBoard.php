<?php
$startingLists = $_SESSION['startingLists'];
?>
<?php include 'view/header.php'; ?>
<div class="overlay">
    <div class="lightbox">
        <div class="lightboxHeading">
            <!-- Heading -->
            <h1>Add New Board</h1>

            <!-- Close Button -->
            <form class="closeLightboxForm" method="post" id="closeLightbox">
                <input type="hidden" name="action" value="showBoard">
                <button type="submit" class="iconCloseButton" form="closeLightbox">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </form>
        </div>

        <!-- Lightbox Form -->
        <form action="createBoard/index.php" method="post" id="addEditBoardForm"
              class="lightboxForm">
            <!-- Hidden actions -->
            <input type="hidden" name="action" value="addBoard">

            <!-- Title -->
            <div class="lightboxField">
                <label for="title">
                    Title
                    <?php if ($CreateBoardForm->getField('title')->hasError()) : ?>
                        <?php echo $CreateBoardForm->getField('title')->getErrorHTML(); ?>
                    <?php endif; ?>
                </label>
                <input type="text" name="title" id="title" value="<?php echo $title; ?>">
            </div>

            <!-- Description -->
            <div class="lightboxField">
                <label for="description">
                    Description
                    <?php if ($CreateBoardForm->getField('description')->hasError()) : ?>
                        <?php echo $CreateBoardForm->getField('description')->getErrorHTML(); ?>
                    <?php endif; ?>
                </label>
                <textarea name="description" id="description"><?php echo $description; ?></textarea>
            </div>
        </form>

        <!-- Lists -->
        <div class="lightboxField">
            <label>Lists</label>

            <div id="startingListsContainer">
                <?php foreach ($startingLists as $startingList) : ?>
                    <div class="startingTaskList">
                        <input type="text" class="startingTaskListInput"
                               name="<?php echo $startingList; ?>"
                               value="<?php echo $startingList; ?>">
                        <!-- Delete List Button -->
                        <button class="iconDeleteButton"
                                data-list-name="<?php echo $startingList; ?>">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Button: Add New List -->
        <button class="button secondary small">
            <span class="plus">&plus;</span>
            Add New List
        </button>

        <!-- Submit Button -->
        <button form="lightboxForm" class="button primary small">Create New Board</button>
    </div>
</div>
