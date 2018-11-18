    var numAndCompDiff = function(x, y) {
        return Math.abs(x - y);
    };

    // Assign random number from 1 to 50
    var compNum = Math.floor((Math.random() * 100) + 1);
    var hacker = false;
    console.log("hey senin burada ne işin var ? Neyse. Hackerin parolası burada saklanıyor. İşte : "+compNum);
    // Assign variable for number of attempts
    var numAttempts = 1;

    var hotAndCold = function() {
        // Input field to enter number
        var enterNum = $("#enterNum").val();
        //$(enterNum).val("enterNum");
        var diffTotal = numAndCompDiff(enterNum, compNum);

        if (isNaN(enterNum) || enterNum === "") {
            $(".gameStatusAlert").html("Başlamak için\n bir numara girmelisin")
        } else if (diffTotal <= 5 && diffTotal > 0) {
            $("html body").animate({
                backgroundColor: "#ba0000"
            }, 1000);
              $(".game-wrap, .attempts, .startOver, .gameStatusAlert").animate({
                color: "#fff"
             }, 1000);
            $(".gameStatusAlert").html("Başabilirsin, parolayı kırabilirsin ! En yakın tahmin bu ! <br>Tekrar Dene");
            $(".attempts").html("5 hakkından " + numAttempts + " tanesini kullandın.");


        } else if (diffTotal >= 6 && diffTotal <= 10) {
            $("html body").animate({
                backgroundColor: "#e84700"
            }, 1000);
              $(".game-wrap, .attempts, .startOver, .gameStatusAlert").animate({
                color: "#fff"
             }, 1000);
            $(".gameStatusAlert").html("Çok az kaldı, odaklan, iyi düşün ! <br><small>tekrar dene</small>");
            $(".attempts").html("5 hakkından " + numAttempts + " tanesini kullandın.");


        } else if (diffTotal >= 11 && diffTotal <= 20) {
            $("html body").animate({
                backgroundColor: "#e88800"
            }, 1000);
       $(".game-wrap, .attempts, .startOver, .gameStatusAlert").animate({
                color: "#fff"
             }, 1000);
            $(".gameStatusAlert").html("Hey giderek yaklaştın bu rakamın yakınlarında parola var <br>Tekrar Dene");
            $(".attempts").html("5 hakkından " + numAttempts + " tanesini kullandın.");


        } else if (diffTotal >= 21 && diffTotal <= 50) {
            $("html body").animate({
                backgroundColor: "#3bcde7"
            }, 1000);
                 $("#startOverBtn").css("display", "block");
         $(".game-wrap, .attempts, .startOver, .gameStatusAlert").animate({
                color: "#000"
             }, 1000);
            $(".gameStatusAlert").html("Sanırım biraz uzaksın. <br>Tekrar Dene");
            $(".attempts").html("5 hakkından " + numAttempts + " tanesini kullandın.");


        } else if (diffTotal >= 51) {
            $("html body").animate({
                backgroundColor: "#a3effd"
            }, 1000);

            $(".gameStatusAlert").html("Çook uzaklarda arıyorsun ...<br>Tekrar Dene");
            $(".attempts").html("5 hakkından " + numAttempts + " tanesini kullandın.");
            $(".game-wrap, .attempts, .startOver, .gameStatusAlert").animate({
                color: "#000"
              }, 1000);


        } else {
            $("html body").animate({
                backgroundColor: "#a4d741"
            }, 1000);
            $(".game-wrap, .attempts, .startOver, .gameStatusAlert").animate({
                color: "#000"
              }, 1000);
            hacker = true;
            $(".gameStatusAlert").html("Vay be parolayı kırdın, sen iyi niyetli bir hacker mısın ?");
            $("#startOverBtn").css("display", "block");
     

        }
    } // end function


    $("#startOverBtn").click(function() {
        numAttempts = 0;
        $(".gameStatusAlert,.attempts,#startOverBtn").hide();
        compNum = Math.floor((Math.random() * 50) + 1);
        hacker = false;
        console.log("hey senin burada ne işin var ? Neyse. Hackerin parolası burada saklanıyor. İşte : "+compNum);
        $('#enterBtn').show();
        $('#enterNum').show();
        $("#enterNum").val("");
        $("html body").animate({
            backgroundColor: "#4c5562"
        }, 1000);
    });


    //To be able to click return key
    $('#enterNum').keydown(function(event) {
        if (event.keyCode == 13) {
            $('#enterBtn').trigger('click');

        }
    });

    $(document).ready(function() {

        $("#enterBtn").click(function(enterNum) {
            //event.preventDefault();
            hotAndCold();
            $(".gameStatusAlert,.attempts,#startOverBtn").show();
            //increment number of attempts
            numAttempts++
            //stop game after 5 attempts
            console.log("toplam "+ numAttempts +" deneme yapıldi");
            console.log("enterNum "+ enterNum +" compNum"+ compNum);
            if (numAttempts === 6 && enterNum !== compNum && hacker == false) {
                $(".gameStatusAlert").html("Kaybettik :( kötü niyetli hacker seni farketti ve parolasını değiştirdi. ");
                    $('#enterBtn').hide();
                     $('#enterNum').hide();
                $("#startOverBtn").css("display", "block");
                $("html body").animate({
                    backgroundColor: "#4c5562"
                }, 1000);
                event.preventDefault();
            }
            hacker = false;


        });


    });
