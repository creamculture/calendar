$(document).ready(function() {

    document.getElementById("eventPhotoInput").onchange = function() {
        $('#eventPhotoForm').submit();
    };

    status('Choose a file !');

    // Check to see when a user has selected a file
    var jcrop_api;
    var bounds, boundx, boundy;
    var $preview = $('#event-photo-preview-pane');
    var $pcnt = $('#event-photo-preview-pane .event-photo-preview-container');
    var $pimg = $('#event-photo-preview-pane .event-photo-preview-container img');
    var info = {};
    var xsize = $pcnt.width();
    var ysize = $pcnt.height();
    var imgUrl;
    var xscale, yscale;

    $('#eventPhotoForm').submit(function() {
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

                imgUrl = response.path;

                status('Success, file uploaded to:' + imgUrl);
                $('#uploadedEventPhoto').attr({'src':imgUrl});
                $('#uploadedEventPhoto').show();

								$('#eventIdInput').attr({'value':imgUrl.substr(imgUrl.lastIndexOf("/") + 1)});

                $pimg.attr({'src':imgUrl});
                $pimg.show();

                $('#uploadedEventPhoto').Jcrop({
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

                    var img = document.getElementById('uploadedEventPhoto');
                    //or however you get a handle to the IMG
                    var naturalw = img.naturalWidth;
                    var naturalh = img.naturalHeight;

                    xscale = naturalw / boundx;
                    yscale = naturalh / boundy;

                    jcrop_api = this;

                    // Move the preview into the jcrop container for css positioning
                    $preview.appendTo(jcrop_api.ui.holder);
                });


            }
        });

        // Have to stop the form from submitting and causing
        // a page refresh - don't forget this
        return false;
    });

    function disablePreview()
    {
        $('#cropEventPhoto').attr('disabled', 'disabled')
    }

    function showPreview(coords)
    {
        info = coords;
        $('#cropEventPhoto').removeAttr('disabled');

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

    $('#cropEventPhoto').click(function(){
        info.x = Math.round(xscale * info.x);
        info.y = Math.round(yscale * info.y);
        info.w = Math.round(xscale * info.w);
        info.h = Math.round(yscale * info.h);

        $.ajax({
            type: "POST",
            url: "/api/cropEventPhoto",
            data: {'src':imgUrl, 'name':imgUrl.substr(imgUrl.lastIndexOf("/") + 1), 'data':info},
            success: function(res){
                if(res == "success")
                {
                    status('Image Cropped');
                    jcrop_api.destroy();
                    $('#uploadedEventPhoto').removeAttr('src');
                    $('#uploadedEventPhoto').hide();

                    $pimg.removeAttr('src');
                    $pimg.hide();

                    disablePreview();
                    $('#userPhotoInput').val('');

                    setTimeout(function(){
                        var pp = document.getElementById('eventPhoto');
												pp.src = pp.src + '/' + imgUrl.substr(imgUrl.lastIndexOf("/") + 1);
                        pp.src = getImgSrc(pp.src) + "?" + new Date().getTime();
                    }, 1000);

                    $('#uploadedEventPhoto').width('100%');
                    $('#uploadedEventPhoto').height('');
                }
                else
                {
                    status('Err' + res);
                }
            }

        })
    });

    $('#cancelCropEventPhoto').click(function(){
        jcrop_api.destroy();
        $('#uploadedEventPhoto').removeAttr('src');
        $('#uploadedEventPhoto').hide();

        $pimg.removeAttr('src');
        $pimg.hide();

        $('#uploadedEventPhoto').width('100%');
        $('#uploadedEventPhoto').height('');
        disablePreview();
        $('#eventPhotoInput').val('');
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