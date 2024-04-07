<?php require_once 'util/main.php'; ?>

<?php include 'view/header.php'; ?>
<section class="loginForm">

    <!-- Login Form -->
    <h1 class="loginHeading">Kanban Login</h1>
    <form action="index.php" method="post" id="login_form" class="form">
        <input type="hidden" name="action" value="login">

        <!-- Username -->
        <div class="formField">
            <div class="labelBox">
                <label for="username" class="inputLabel">Username</label>
                <?php if ($Form->getField('username')->hasError() == 'Required') : ?>
                    <p class="fieldError">
                        <?php echo $Form->getField('username')->getMessage(); ?>
                    </p>
                <?php endif; ?>
            </div>
            <input type="text" name="username" id="username" class="textInput" value="<?php echo
            $username; ?>">
        </div>

        <!-- Password -->
        <div class="formField">
            <div class="labelBox">
                <label for="password" class="inputLabel">Password</label>
                <?php if ($Form->getField('password')->hasError() == 'Required') : ?>
                    <p class="fieldError">
                        <?php echo $Form->getField('password')->getMessage(); ?>
                    </p>
                <?php endif; ?>
            </div>
            <input type="password" name="password" id="password" class="textInput"
                   value="<?php echo $password ?>">
        </div>

        <button type="submit" class="button primary small" id="loginButton">Login</button>

    </form>
</section>
<?php include 'view/footer.php'; ?>
