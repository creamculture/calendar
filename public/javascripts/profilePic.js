$(document).ready(function() {

  document.getElementById("userPhotoInput").onchange = function() {
    $('#uploadForm').submit();
  };

  status('Choose a file !');

  // Check to see when a user has selected a file
  var jcrop_api;
  var bounds, boundx, boundy;
  var $preview = $('#preview-pane');
  var $pcnt = $('#preview-pane .preview-container');
  var $pimg = $('#preview-pane .preview-container img');

  var xsize = $pcnt.width();
  var ysize = $pcnt.height();

  var xscale, yscale;

  $('#uploadForm').submit(function() {
    status('uploading the file ...');

    $(this).ajaxSubmit({

      error: function(xhr) {
        status('Error: ' + xhr.status);
      },

      success: function(response) {
        //TODO: We will fill this in later
        if(response.error){
          status('Something went wrong.');
          return;
        }

        var imgUrl = response.path;

        status('Success, file uploaded to:' + imgUrl);
        $('#uploadedImage').attr({'src':imgUrl});
        $('#uploadedImage').show();

        $pimg.attr({'src':imgUrl});
        $pimg.show();

        $('#uploadedImage').Jcrop({
          minSize: [ 50,50 ],
          onChange: showPreview,
          onSelect: showPreview,
          onRelease: disablePreview,
          aspectRatio: 1,
          setSelect: [0,0,50,50]
        }, function(){
          // Use the API to get the real image size
          var bounds = this.getBounds();
          boundx = bounds[0];
          boundy = bounds[1];

          var img = document.getElementById('uploadedImage');
          //or however you get a handle to the IMG
          var naturalw = img.naturalWidth;
          var naturalh = img.naturalHeight;

          xscale = naturalw / boundx;
          yscale = naturalh / boundy;

          jcrop_api = this;

          // Move the preview into the jcrop container for css positioning
          $preview.appendTo(jcrop_api.ui.holder);
        });

        var info = {};

        function disablePreview()
        {
          $('#sendCrop').attr('disabled', 'disabled')
        }

        function showPreview(coords)
        {
          info = coords;
          $('#sendCrop').removeAttr('disabled');

          if (parseInt(coords.w) > 0)
          {
            var rx = xsize / coords.w;
            var ry = ysize / coords.h;

            $pimg.css({
              width: Math.round(rx * boundx) + 'px',
              height: Math.round(ry * boundy) + 'px',
              marginLeft: '-' + Math.round(rx * coords.x) + 'px',
              marginTop: '-' + Math.round(ry * coords.y) + 'px'
            });
          }
        };
        $('#sendCrop').click(function(){
          info.x = Math.round(xscale * info.x);
          info.y = Math.round(yscale * info.y);
          info.w = Math.round(xscale * info.w);
          info.h = Math.round(yscale * info.h);

          $.ajax({
            type: "POST",
            url: "/api/cropProfilePicture",
            data: {'src':imgUrl, 'name':imgUrl.substr(imgUrl.lastIndexOf("/") + 1), 'data':info},
            success: function(res){
              if(res == "success")
              {
                status('Image Cropped');
                jcrop_api.destroy();
                $('#uploadedImage').removeAttr('src');
                $('#uploadedImage').hide();

                $pimg.removeAttr('src');
                $pimg.hide();

                disablePreview();
                $('#userPhotoInput').val('');

                var pp = document.getElementById('profilePicture');
                pp.src = getImgSrc(pp.src) + "?" + new Date().getTime();

                var pp2 = document.getElementById('homeProfilePicture');
                pp2.src = getImgSrc(pp2.src) + "?" + new Date().getTime();

                var pp3 = document.getElementById('navProfilePicture');
                pp3.src = getImgSrc(pp3.src) + "?" + new Date().getTime();

                $('#uploadedImage').width('100%');
                $('#uploadedImage').height('');
              }
              else
              {
                status('Err' + res);
              }
            }

          })
        });
        $('#cancelCrop').click(function(){
          jcrop_api.destroy();
          $('#uploadedImage').removeAttr('src');
          $('#uploadedImage').hide();

          $pimg.removeAttr('src');
          $pimg.hide();

          $('#uploadedImage').width('100%');
          $('#uploadedImage').height('');
          disablePreview();
          $('#userPhotoInput').val('');
        });
      }
    });

    // Have to stop the form from submitting and causing
    // a page refresh - don't forget this
    return false;
  });

  function status(message) {
    $('#status').text(message);
  }

  function getImgSrc(src) {
    var i = src.indexOf("?");

    if(i > 0)
      return  src.slice(0, i);
    else
      return src;
  }
});