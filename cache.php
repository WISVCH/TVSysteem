<?php
	function getUrlCached($url, $maxage = 3600){
		$file = "cache/".md5($url); 
		if(!file_exists($file) ||  filemtime($file) < time() - $maxage){
			$data = file_get_contents($url);
			file_put_contents($file, $data);
			return $data;
		}
		return file_get_contents($file);
	}
?>