<?php
require 'db.php';

$error   = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $error   = '';
    $success = '';
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirm  = trim($_POST['confirm'] ?? '');

    if (empty($email) || empty($password) || empty($confirm)) {
        $error = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters.';
    } elseif ($password !== $confirm) {
        $error = 'Passwords do not match.';
    } else {
        $error = '';
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = 'This email is already registered.';
        } else {
            $hashed = password_hash($password, PASSWORD_DEFAULT);
            $stmt   = $pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
            $stmt->execute([$email, $hashed]);
            $success = 'Account created successfully! You can now log in.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="page-wrap">
    <div class="card">

      <!-- Logo / Brand -->
      <div class="brand">
        <svg aria-label="App logo" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="10" fill="#2563eb"/>
          <path d="M18 10a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c5.33 0 8 2.24 8 4v1H10v-1c0-1.76 2.67-4 8-4z" fill="#fff"/>
        </svg>
        <span>MyApp</span>
      </div>

      <h1>Create an account</h1>
      <p class="subtitle">Enter your email and a password to get started.</p>

      <!-- Alerts -->
      <?php if ($error): ?>
        <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
      <?php endif; ?>

      <?php if ($success): ?>
        <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
      <?php endif; ?>

      <!-- Register Form -->
      <?php if (!$success): ?>
      <form method="POST" novalidate>

        <div class="form-group">
          <label for="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
            autocomplete="email"
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Min. 6 characters"
            autocomplete="new-password"
          >
        </div>

        <div class="form-group">
          <label for="confirm">Confirm Password</label>
          <input
            type="password"
            id="confirm"
            name="confirm"
            placeholder="Re-enter password"
            autocomplete="new-password"
          >
        </div>

        <button type="submit" class="btn-submit">Create Account</button>

      </form>
      <?php endif; ?>

      <p class="footer-note">
        Already have an account? <a href="#">Log in</a>
      </p>

    </div>
  </div>

</body>
</html>