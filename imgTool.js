/*
* 圖片、傳圖相關功能
* 設定完初始參數後, 呼叫 fileView 開啟檔案, 呼叫 fileUploadPrepare 準備上傳
* 要使用縮圖功能的話要載入binaryajax.js, exif.js, megapix-image.js
* 
*/

//設定資料
var IMG_TOOL = {
    CanSend: false,             //是否可按送出
    SendData: null,             //要送出的檔案
    UpImg: null,                //Image物件
    Reader: null,               //FileReader物件
    IsProgressBar: false,       //是否有ProgressBar
    IsImgLoader: false,         //是否有讀取圖示(請定img tag並命名IsImgLoader)
    IsResizeImg: false,         //是否要縮圖
    ResizeMaxH: 150,            //縮圖的最大高
    ResizeMaxW: 450,            //縮圖的最大寬
    IsPreview: false,           //是否有要預覽(請定img tag並命名imgPre)
    ServFunc: "UploadFacePic",   //要呼叫的遠端函式
    overCallback: null,         //結束時的動作,預設是重讀本頁
    barSetValCallback: null,    //設定ProgressBar的進度
    OsType: "0"					//系統類型 1:iphone, 2: android, 3: ipad
};

//共用變數
var MY_VAR = {
    IsReadBinary: false,        //是否在讀Binary
    ImgOrientation: 0,          //圖片的轉向
    IsLoadPrev: false,          //是否已經讀過預覽圖
    MgImg: null
};

////清除
//IMG_TOOL.clear = function () {
//    if (IMG_TOOL.IsPreview) {
//        $("#imgPre").attr("src", "");
//        $('#imgPre').attr("width", 0);
//        $('#imgPre').attr("height", 0);
//    }

//    if (IMG_TOOL.IsProgressBar)
//        TolitoProgressBar('progressbar').setValue(0);
//}

//結束時的動作,預設是重讀本頁
IMG_TOOL.overCallback = function () {
    location.reload();
}

//設定ProgressBar的進度, 預設是使用TolitoProgressBar
IMG_TOOL.barSetValCallback = function (val) {
    TolitoProgressBar('progressbar').setValue(val);
}

//開啟檔案
IMG_TOOL.fileView = function (controller) {
    IMG_TOOL.CanSend = false;
    //alert(controller.files[0].type);
    var file_ = controller.files[0];
    var s = "Type of files[0]: " + file_.toString() + "\n" +
    "File name: " + file_.name + "\n" +
    "File size: " + file_.size + "\n" +
    "File type: " + file_.type;
    //alert(s);

    //$("#Result").text(s);

    var filesp_ = file_.name.split('.');
    fileExt = filesp_[filesp_.length - 1];
    fileSize = file_.size;
    //fileType = file_.type;   //20130817 SC Edit

    //var type_ = file_.type.split('/');
    //if (type_[0] != "image") {
    //    alert("Wrong file type!!");
    //    return;
    //}

    var type_ = file_.name.split('.');
    var typestr_ = type_[type_.length - 1];


    //20130817 SC Edit
    var picfileType = ['jpg','jpeg','png','bmp','gif'];

    if (typestr_.indexOf(picfileType) >= 0) {
        alert("Wrong file type!!");
        return;
    }
    if (typestr_ == "jpg") {
        fileType = "image/jpeg";
    }
    else {
        fileType = "image/" + typestr_;
    }

    MY_VAR.MgImg = new MegaPixImage(file_);

    MY_VAR.IsReadBinary = true;
    IMG_TOOL.UpImg = new Image();
    IMG_TOOL.UpImg.file = file_;
    //IMG_TOOL.UpImg.exif = true;

    IMG_TOOL.Reader = new FileReader();
    IMG_TOOL.Reader.onload = function (e) {
        //alert("MY_VAR.IsReadBinary" + MY_VAR.IsReadBinary);
        if (MY_VAR.IsReadBinary)
            return;

        //$('#imgTest').attr("src", e.target.result);
        //IMG_TOOL.UpImg.src = e.target.result;

        //alert("w:" + IMG_TOOL.UpImg.width + ", h:" + IMG_TOOL.UpImg.height);
        //if (IMG_TOOL.IsPreview) {
        //    $('#imgPre').attr("src", e.target.result);

        //    $('#imgPre').load(function () {
        //        //將預覽縮圖
        //        var maxH_ = 150.0;
        //        fakeImgResize("imgPre", maxH_, $('#imgPre').height(), $('#imgPre').width());
        //    });
        //}
       // alert("into IMG_TOOL.CanSend()");
        //IMG_TOOL.imgResize();
        //if (IMG_TOOL.IsResizeImg) {
        //    IMG_TOOL.imgResize();
        //} else {
        //    IMG_TOOL.CanSend = true;
        //    //讀完縮完圖就上傳
        //    //IMG_TOOL.fileUpload();
        //}
    };

    IMG_TOOL.Reader.onloadend = function () {
        //alert(1);
        if (MY_VAR.IsReadBinary == false) {
            ////

            if (IMG_TOOL.IsPreview) {
                $('#imgPre').attr("src", e.target.result);

                $('#imgPre').load(function () {
                    //將預覽縮圖
                    var maxH_ = 150.0;
                    fakeImgResize("imgPre", maxH_, $('#imgPre').height(), $('#imgPre').width());
                });
            }

            IMG_TOOL.imgResize();

            //////
            return;
        }

        //alert(2);
        var exif = EXIF.readFromBinaryFile(new BinaryFile(this.result));
        //alert("exif:" + exif.Orientation);

        MY_VAR.ImgOrientation = exif.Orientation;
        //if (exif.Orientation == 6 || exif.Orientation == 8) {
        //    MY_VAR.IsChangeHW = true;
        //}

        MY_VAR.IsReadBinary = false;
        IMG_TOOL.Reader.abort();
        IMG_TOOL.Reader.readAsDataURL(IMG_TOOL.UpImg.file);
    }

    //IMG_TOOL.CanSend = true;
    //IMG_TOOL.Reader.readAsDataURL(IMG_TOOL.UpImg.file);
    //IMG_TOOL.Reader.readAsBinaryString(file_);
    console.log(IMG_TOOL.UpImg.file);
    IMG_TOOL.Reader.readAsBinaryString(IMG_TOOL.UpImg.file);

}

//準備上傳圖片
IMG_TOOL.fileUploadPrepare = function () {
    //alert(IMG_TOOL.CanSend);
    if (IMG_TOOL.CanSend == false)
        return;

    if (IMG_TOOL.IsImgLoader)
        $("#imgLoader").show();
    IMG_TOOL.CanSend = false;
    //alert("aaa:"+upImg.src);

    //IMG_TOOL.Reader.readAsDataURL(IMG_TOOL.UpImg.file);

    //讀完縮完圖就上傳
    IMG_TOOL.fileUpload();
}

//真的上傳圖片
IMG_TOOL.fileUpload = function () {
    //alert("fileUpload");
    var separator_ = 'base64,';
    //var idx_ = reader.result.indexOf(separator_);
    //var dataRst_ = reader.result.substring(idx_ + separator_.length);
    var idx_ = IMG_TOOL.UpImg.src.indexOf(separator_);
    var dataRst_ = IMG_TOOL.UpImg.src.substring(idx_ + separator_.length);

    var total_ = dataRst_.length;
    var chunk_ = total_ / 2048;
    var mod_ = total_ % 2048;
    chunk_ = Math.ceil(chunk_);
    var begin_ = 0;
    var i_ = 0;
    //alert("fileType:" + fileType);
    //分片上傳
    IMG_TOOL.uploadChunk(dataRst_, fileExt, fileType, begin_, i_, chunk_);
}

//上傳單一碎片
IMG_TOOL.uploadChunk = function (dataRst, ext, type, bg, cnt, chunk) {
    var ed_ = bg + 2048;
    var IsFirstFinal_ = false;  //是否第一包就是最後一包(剛好2048)
    if (dataRst.length == 2048)
        IsFirstFinal_ = true;

    if (ed_ > dataRst.length)
    	ed_ = dataRst.length;

//  console.log("dataRst=" + dataRst);
    console.log("ext=" + ext);
    console.log("type=" + type);

    //console.log("upload:%d, %d",cnt,chunk);
    var dataStr_ = dataRst.substring(bg, ed_);
    //var mydata = {
    //    MemNo: IMG_TOOL.MemNo,
    //    ExtName: ext,
    //    Data: dataStr_,
    //    //Size: fileSize,
    //    Type: type
    //};

    IMG_TOOL.SendData.ExtName = ext;
    IMG_TOOL.SendData.Data = dataStr_;
    IMG_TOOL.SendData.Type = type;
    //alert("type:" + type);
    var sendOK_ = true;
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json",
        url: "http://" + MUSE.GetDomain('File') + "/Upload.svc/"+IMG_TOOL.ServFunc,
        data: JSON.stringify(IMG_TOOL.SendData),
        success: function (data) {
            if (data.EM != "") {
                alert("Error:" + data.EM);
                //alert("pppp");
            }
            if (data.RD == "2") {
                $("#imgLoader").hide();
                //alert("All Over!!");
                IMG_TOOL.overCallback();
                if (IMG_TOOL.IsProgressBar)
                    IMG_TOOL.barSetValCallback(100);
            }
            else {
                var pa_ = Math.ceil((cnt / chunk) * 100);
                if (pa_ > 99)
                    pa_ = 99;
                if (IMG_TOOL.IsProgressBar)
                    IMG_TOOL.barSetValCallback(pa_);

                ////////
                bg = ed_;

                //若還有沒傳完的就繼續
                if (ed_ >= dataRst.length) {
                    //剛好2048,就在送一包空的作結束
                    if (IsFirstFinal_) {
                        //var mydata = {
                        //    MemNo: IMG_TOOL.MemNo,
                        //    ExtName: ext,
                        //    Data: "",
                        //    Type: type
                        //};

                        $.ajax({
                            type: "POST",
                            async: false,
                            contentType: "application/json",
                            url: "http://" + MUSE.GetDomain('File') + "/Upload.svc/" + IMG_TOOL.ServFunc,
                            data: JSON.stringify(IMG_TOOL.SendData),
                            success: function (data) {
                                if (data.EM != "") {
                                    //alert("hioo");
                                    alert("Error:" + data.EM);
                                }

                                if (data.RD == "2") {
                                    $("#imgLoader").hide();
                                    //alert("All Over!!");
                                    location.reload();
                                    IMG_TOOL.barSetValCallback(100);
                                }
                            },
                            error: function (error) { }
                        });
                    }

                    //傳完了
                    IMG_TOOL.CanSend = true;
                }
                else {
                    if (sendOK_) {
                        setTimeout(function () {
                            IMG_TOOL.uploadChunk(dataRst, ext, type, bg, cnt, chunk);
                        }, 1);
                        cnt++;
                    }
                }
                ///////
            }
        },
        error: function (error) {
            //alert("發生錯誤");
            sendOK_ = false;
        }
    });

    //bg = ed_;

    ////若還有沒傳完的就繼續
    //if (ed_ >= dataRst.length) {
    //    //剛好2048,就在送一包空的作結束
    //    if (IsFirstFinal_) {
    //        //var mydata = {
    //        //    MemNo: IMG_TOOL.MemNo,
    //        //    ExtName: ext,
    //        //    Data: "",
    //        //    Type: type
    //        //};

    //        $.ajax({
    //            type: "POST",
    //            async: true,
    //            contentType: "application/json",
    //            url: "http://" + MUSE.GetDomain('File') + "/Upload.svc/"+IMG_TOOL.ServFunc,
    //            data: JSON.stringify(IMG_TOOL.SendData),
    //            success: function (data) {
    //                if (data.EM != "")
    //                    alert("Error:" + data.EM);

    //                if (data.RD == "2") {
    //                    $("#imgLoader").hide();
    //                    //alert("All Over!!");
    //                    location.reload();
    //                    IMG_TOOL.barSetValCallback(100);
    //                }
    //            },
    //            error: function (error) { }
    //        });
    //    }

    //    //傳完了
    //    IMG_TOOL.CanSend = true;
    //}
    //else {
    //    if (sendOK_) {
    //        setTimeout(function () {
    //            IMG_TOOL.uploadChunk(dataRst, ext, type, bg, cnt, chunk);
    //        }, 10);
    //        cnt++;
    //    }
    //}
}

//縮圖程式
IMG_TOOL.imgResize = function () {
    //alert("IMG_TOOL.CanSend:" + IMG_TOOL.CanSend);
    if (IMG_TOOL.CanSend) {
        //alert("can't send");
        return;
    }

    var myW_ = MY_VAR.MgImg.srcImage.width;
    var myH_ = MY_VAR.MgImg.srcImage.height;

    var ratio_ = Math.max(
        myW_ / IMG_TOOL.ResizeMaxW,
        myH_ / IMG_TOOL.ResizeMaxH,
        1
    );

    if (IMG_TOOL.IsResizeImg==false)
        ratio_ = 1.0;

    var d_ = {
        w: Math.floor(Math.max(myW_ / ratio_, 1)),
        h: Math.floor(Math.max(myH_ / ratio_, 1))
    }

    //alert("imgResize w1:" + myW_ + ", w2:" + d_.w + ", h1:" + myH_ + ", h2:" + d_.h);

    var canvas = document.createElement('canvas');
    //canvas.setAttribute('width', d_.w);
    //canvas.setAttribute('height', d_.h);
    canvas.width = d_.w;
    canvas.height = d_.h;
    var ctx = canvas.getContext("2d");

    //ctx.drawImage(IMG_TOOL.UpImg, 0, 0);
    //ctx.drawImage(IMG_TOOL.UpImg, 0, 0, IMG_TOOL.UpImg.height, IMG_TOOL.UpImg.width);
    //ctx.drawImage(IMG_TOOL.UpImg, 0, 0, 
    //    IMG_TOOL.UpImg.width, IMG_TOOL.UpImg.height,0 ,0, d_.w, d_.h);
    //ctx.rotate(20 * Math.PI / 180);
    //ctx.drawImage(IMG_TOOL.UpImg, 0, 0, d_.w, d_.h);
    //ctx.restore();

    //MY_VAR.MgImg.render(canvas,
    //    { maxWidth: d_.w, maxHeight: d_.h, orientation: MY_VAR.ImgOrientation });

    //$("#finimg").attr("src", canvas.toDataURL());

    //ctx.save();
	////ctx.translate(-10, 10);
	//ctx.rotate(45 * Math.PI / 180);
	//ctx.restore();

	//ctx.fillStyle = 'rgb(200, 0, 0)';
	//ctx.fillRect (10, 10, 55, 50);
	//ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
	//ctx.fillRect (30, 30, 55, 50);
	////ctx.drawImage(MY_VAR.MgImg.srcImage, 10,10);
	//ctx.restore();

	//ctx.save();
	//ctx.translate(-10, 10);
	//ctx.rotate(45 * Math.PI / 180);
	//ctx.restore();
	
	//alert("os:"+IMG_TOOL.OsType);
	if ( IMG_TOOL.OsType == "1" || IMG_TOOL.OsType == "3" ){
    	MY_VAR.MgImg.render(canvas,
        	{ maxWidth: d_.w, maxHeight: d_.h, orientation: MY_VAR.ImgOrientation });		
	} else {
		switch (MY_VAR.ImgOrientation) {
	      case 5:
	      case 6:
	      case 7:
	      case 8:
	        canvas.width = d_.h;
	        canvas.height = d_.w;
	        break;
	      default:
	        canvas.width = d_.w;
	        canvas.height = d_.h;
	    }
	    
	    switch (MY_VAR.ImgOrientation) {
	      case 2:
	        // horizontal flip
	        ctx.translate(d_.w, 0);
	        ctx.scale(-1, 1);
	        break;
	      case 3:
	        // 180 rotate left
	        ctx.translate(d_.w, d_.h);
	        ctx.rotate(Math.PI);
	        break;
	      case 4:
	        // vertical flip
	        ctx.translate(0, d_.h);
	        ctx.scale(1, -1);
	        break;
	      case 5:
	        // vertical flip + 90 rotate right
	        ctx.rotate(0.5 * Math.PI);
	        ctx.scale(1, -1);
	        break;
	      case 6:
	        // 90 rotate right
	        ctx.rotate(0.5 * Math.PI);
	        ctx.translate(0, -d_.h);
	        break;
	      case 7:
	        // horizontal flip + 90 rotate right
	        ctx.rotate(0.5 * Math.PI);
	        ctx.translate(d_.w, -d_.h);
	        ctx.scale(-1, 1);
	        break;
	      case 8:
	        // 90 rotate left
	        ctx.rotate(-0.5 * Math.PI);
	        ctx.translate(-d_.w, 0);
	        break;
	      default:
	        break;
	    }

		ctx.drawImage(MY_VAR.MgImg.srcImage, 0, 0, 
	        myW_, myH_,0 ,0, d_.w, d_.h);

	    ctx.restore();
	}


    //alert("toData bbb:"+MY_VAR.ImgOrientation);
    IMG_TOOL.UpImg.src = canvas.toDataURL();
    //alert(IMG_TOOL.UpImg.src);
    IMG_TOOL.UpImg.height = d_.h;
    IMG_TOOL.UpImg.width = d_.w;
    IMG_TOOL.CanSend = true;
}

//將預覽縮圖
function fakeImgResize(tagID, maxHeight, orgH, orgW) {
    var myW_ = orgW;
    var myH_ = orgH;

    var rateH_ = maxHeight / myH_;
    var newW_ = myW_ * rateH_;
    //alert("fakeImgResize h:" + maxHeight + ", w:" + newW_);
    $('#' + tagID).attr("width", newW_);
    $('#' + tagID).attr("height", maxHeight);
}

//直接將預覽縮圖,不管你本來多大
function forceFakeImgResizeH(tagID, maxHeight) {
    //var myW_ = orgW;
    //var myH_ = orgH;

    //var rateH_ = maxHeight / myH_;
    //var newW_ = myW_ * rateH_;
    //alert("forceFakeImgResize h:" + maxHeight);
    //$('#' + tagID).attr("width", newW_);
    $('#' + tagID).attr("height", maxHeight);
}