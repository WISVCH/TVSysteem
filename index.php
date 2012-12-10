<?php 
	$pages = array("front", "admin");
	if(isset($_GET['page']) && in_array($_GET['page'], $pages)){
		$page = $_GET['page'];
	} else {
		$page = "front";
	}
?>
<!DOCTYPE html>
<html>
  <?php include("includes/head.php"); ?>
  <body data-page="<?php echo $page; ?>">
  
    <?php include("includes/nav.php"); ?>

    <div id="content">
      <?php require("includes/".$page.".php"); ?>
    </div>

    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="lib/underscore-1.4.2/underscore-min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/fullscreen.js"></script>
    <script src="js/tv.js"></script>
  </body>
</html>