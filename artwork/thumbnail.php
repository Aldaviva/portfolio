<?

header("Content-type: image/jpeg");

$quality = 88;
$image = null;
$width = $_GET['width'];
$height = $_GET['height'];
$smallImage = imagecreatetruecolor($width, $height);
$filename = $_GET['filename'];

if(file_exists($filename)){

	switch(strtolower(pathinfo($filename, PATHINFO_EXTENSION))){
		case "png":
			$image = imagecreatefrompng($filename);
			break;
		case "jpg":
		case "jpeg":
			$image = imagecreatefromjpeg($filename);
			break;
		case "gif":
			$image = imagecreatefromgif($filename);
			break;
	}

	$originalRatio = imagesx($image)/imagesy($image);
		
	$desiredRatio = $width/$height;

	if($desiredRatio > $originalRatio){
		imagecopyresampled($smallImage, $image, 0, 0, 0, 0, $width, $height, imagesx($image), imagesx($image)/$desiredRatio);
	} else {
		imagecopyresampled($smallImage, $image, 0, 0, 0, 0, $width, $height, imagesy($image)*$desiredRatio, imagesy($image));
	}

}

$dir = $width.'x'.$height;
if(!is_dir($dir)){
	mkdir($dir);
}

if(file_exists($filename)){
	imagejpeg($smallImage, $dir.'/'.pathinfo($filename, PATHINFO_BASENAME), $quality);
}

imagejpeg($smallImage, null, $quality);

?>