<?php include 'header.php'; ?>
<h1>Login</h1>
<form action="../index.php" method="post" id="login_form">
    <input type="hidden" name="action" value="login">

    <!-- Username -->
    <div class="formField">
        <label for="username">Username</label>
        <input type="text" name="username" id="username" value="<?php echo $username; ?>">
        <?php if ($LoginForm->getField('username')->hasError() === 'Required') : ?>
            <?php echo $LoginForm->getField('username')->getErrorHTML(); ?>
        <?php endif; ?>
    </div>

    <!-- Password -->
    <div class="formField">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" value="<?php echo $password ?>">
        <?php if ($LoginForm->getField('password')->hasError() === 'Required') : ?>
            <?php echo $LoginForm->getField('password')->getErrorHTML(); ?>
        <?php endif; ?>
    </div>

    <button type="submit">Login</button>

    <!-- Incorrect username/password error -->
    <?php if ($LoginForm->getField('password')->hasError() !== 'Required') : ?>
        <div class="loginError">
            <?php echo $LoginForm->getField('password')->getErrorHTML(); ?>
        </div>
    <?php endif; ?>

</form>
<?php include 'footer.php'; ?>
