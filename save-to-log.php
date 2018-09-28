<?php
  $log_file_name = 'results.log';
  $message = $_POST['data'];
  file_put_contents($log_file_name, $message, FILE_APPEND);
  header('Location: /submitted.html'); 
?>
