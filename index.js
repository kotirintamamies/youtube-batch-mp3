var youtubedl = require('youtube-dl');
var converter = require('video-converter');
var fs = require('fs');

//Edit this path if installing ffmpeg elsewhere
converter.setFfmpegPath(require('path').dirname(require.main.filename)+"\\ffmpeg.exe", function(err) {
    if (err) throw err;
});

fs.readFile(require('path').dirname(require.main.filename)+"\\videoUrls.txt", 'utf8', function(err, data) {
  if (err) throw err;
  work(data);

});

function work(data)
{
  var urls = data.split('\n');
  urls.forEach(function(url)
  {
    if (url.length>0)
      downloadAndConvert(url);
  })
}

function downloadAndConvert(url)
{
  var video = youtubedl(url,
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });
  var output = "";
  video.on('info', function(info) {
    output = require('path').dirname(require.main.filename)+"\\" + info.title;
    video.pipe(fs.createWriteStream(output + ".mp4"));
  });

  // Will be called if download was already completed and there is nothing more to download.
  video.on('end', function () {
    'use strict';
    convert(output);
  });
}

function convert(videoPath)
{
  console.log(videoPath);
  converter.convert(videoPath + ".mp4", videoPath + ".mp3", function(err) {
    if (err) throw err;
    fs.unlinkSync(videoPath + ".mp4");
    console.log(videoPath + ".mp3 Rendered.");
  });
}
