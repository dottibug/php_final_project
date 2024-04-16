<?php session_start(); ?>

<?php include './header.php'; ?>
<section class="errorPage">
    <h1 class="errorHeading">Oops! There was an error.</h1>
    <p class="errorPageMessage"><?php echo $_SESSION['errorMessage']; ?></p>
    <a href="../kanban/board" class="errorPageLink">Return to your dashboard</a>
</section>
<?php include './footer.php'; ?>
