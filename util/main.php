<?php
// Get document root
$docRoot = filter_input(INPUT_SERVER, 'DOCUMENT_ROOT');

// Set the include path to the application path
set_include_path($docRoot);