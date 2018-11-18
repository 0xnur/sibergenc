$( document ).ready(function() {

  var forBlockHTML = '<div class="panel panel-default block" id="fl">\
  <div class="panel-heading">\
  <h3 class="panel-title"><input class="block-number number" type="number"\
  name="blocknumber" value="1" min="1" max="50"> Kere Yap: </h3>\
  </div>\
  <div class="panel-body forBlock">\
  \
  </div>\
  </div>';

  var moveForwardHTML = '<div class="panel panel-default block" id="mf">\
      <div class="panel-body">\
        <input class="block-number number" type="number"\
           name="blocknumber" value="1" min="1" max="50">İleriye Adım At\
      </div>\
    </div>';

  var moveBackwardHTML = '<div class="panel panel-default block" id="mb">\
      <div class="panel-body">\
        <input class="block-number number" type="number"\
           name="blocknumber" value="1" min="1" max="50"> Geriye Adım At\
      </div>\
    </div>';

  var turnLeftHTML = '<div class="panel panel-default block" id="tl">\
      <div class="panel-body">\
        Sola Dön \
      </div>\
    </div>';

  var turnRightHTML = '<div class="panel panel-default block" id="tr">\
      <div class="panel-body">\
        Sağa Dön \
      </div>\
    </div>';

  var waitHTML = '<div class="panel panel-default block" id="wt">\
      <div class="panel-body">\
          <input class="block-number number" type="number"\
           name="blocknumber" value="1" min="1" max="50"> Kere Bekle\
      </div>\
    </div>';

  var ifelseHTML = '<div class="panel panel-default block " id="ifelse">\
        <div class="panel-heading">\
        <h3 class="panel-title">If There is a {wall,water,trap,tree,clay} </h3>\
      </div>\
      <div class="panel-body ifBlock">\
      </div>\
             <div class="panel-heading">\
        <h3 class="panel-title ">If Not </h3>\
      </div>\
        <div class="panel-body elseBlock">\
      </div>\
      <div class="panel-footer"></div>\
    </div>';

  var clone, before,parent, itemId, maxBlocks;

  function customClone(item){
    var copy = "";

    if(itemId === "fl"){
        if(forCounter < maxBlocks.forblock){
          copy = forBlockHTML;
          forCounter++;


        }
      }
    else if(itemId === "mf"){
      if(moveForwardCounter < maxBlocks.moveForward){
          copy = moveForwardHTML;
          moveForwardCounter++;
          if(moveForwardCounter === maxBlocks.moveForward){
            $(itemId).addClass('hide');
          }

        }
    }
    else if(itemId === "mb"){
      if(moveBackwardCounter < maxBlocks.moveBackward){
          copy = moveBackwardHTML;
          moveBackwardCounter++;
          if(moveBackwardCounter === maxBlocks.moveBackward){
            $(itemId).addClass('hide');
          }

        }
    }
    else if(itemId === "tr"){
      if(turnRightCounter < maxBlocks.turnRight){
          copy = turnRightHTML;
          turnRightCounter++;
          if(turnRightCounter === maxBlocks.turnRight){
            $(itemId).addClass('hide');
          }

        }
    }
    else if(itemId === "tl"){
      if(turnLeftCounter < maxBlocks.turnLeft){
          copy = turnLeftHTML;
          turnLeftCounter++;
          if(turnLeftCounter === maxBlocks.turnLeft){
            $(itemId).addClass('hide');
          }

        }
    }
    else if(itemId === "wt"){
      if(waitCounter < maxBlocks.wait){
          copy = waitHTML;
          waitCounter++;
          if(waitCounter === maxBlocks.wait){
            $(itemId).addClass('hide');
          }

        }
    }
    else if(itemId === "ifelse"){
      if(ifElseCounter < maxBlocks.ifelse){
          copy = ifelseHTML;
          ifElseCounter++;
          if(ifElseCounter === maxBlocks.ifelse){
            $(itemId).addClass('hide');
          }

        }
    }


    return copy;
  }

  $(".forBlock").sortable({
    tolerance:"pointer",
    connectWith: '#secondList,.ifBlock,.elseBlock,#firstList',
    placeholder: "highlight",
    start: function (event, ui) {
      ui.item.toggleClass("highlight");
    },
    stop: function (event, ui) {
      ui.item.toggleClass("highlight");
    }
  });

  $(".ifBlock").sortable({
    appendTo: 'body',
    tolerance:"pointer",
    connectWith: '#secondList, .forBlock, .elseBlock, #firstList',
    placeholder: "highlight",
    start: function (event, ui) {
      ui.item.toggleClass("highlight");
    },
    stop: function (event, ui) {
      ui.item.toggleClass("highlight");


    },

  });

  $(".elseBlock").sortable({
    accept: ".block",
    appendTo: 'body',
    tolerance:"pointer",
    connectWith: '#secondList, #firstList, .forBlock, .ifBlock',
    placeholder: "highlight",
    start: function (event, ui) {
      ui.item.toggleClass("highlight");
      startElement = $(this);
    },
    stop: function (event, ui) {
      ui.item.toggleClass("highlight");
    },
  });

  $('#firstList').sortable({
    appendTo: 'body',
    cancel: '.disabled',
    tolerance:"pointer",
    connectWith: '#secondList, .ifBlock, .forBlock, .elseBlock',
    placeholder: "highlight",
    helper: 'clone',
    start: function (event, ui) {
      ui.item.toggleClass("highlight");
      startElement = $(this);
      itemId = ui.item.attr("id");
      maxBlocks = levels[currentLevelIndex].maxBlocks;
      clone = customClone(ui.item);
      before = $(ui.item).prev();
      parent = $(ui.item).parent();

    },
    stop: function (event, ui) {
      ui.item.toggleClass("highlight");
      $('.placeholder').hide();


      if (before.length)
        before.after(clone);
      else
        parent.prepend(clone);

      $(".forBlock").sortable({
        tolerance:"pointer",
        connectWith: '#secondList,.ifBlock,.elseBlock,#firstList',
        placeholder: "highlight",
        start: function (event, ui) {
          ui.item.toggleClass("highlight");
        },
        stop: function (event, ui) {
          ui.item.toggleClass("highlight");
        }
      });

      $(".ifBlock").sortable({
    appendTo: 'body',
    tolerance:"pointer",
    connectWith: '#secondList, .forBlock, .elseBlock, #firstList',
    placeholder: "highlight",
    start: function (event, ui) {
      ui.item.toggleClass("highlight");
    },
    stop: function (event, ui) {
      ui.item.toggleClass("highlight");


    },

  });

  $(".elseBlock").sortable({
    accept: ".block",
    appendTo: 'body',
    tolerance:"pointer",
    connectWith: '#secondList, #firstList, .forBlock, .ifBlock',
    placeholder: "highlight",
    start: function (event, ui) {
      ui.item.toggleClass("highlight");
      startElement = $(this);
    },
    stop: function (event, ui) {
      ui.item.toggleClass("highlight");
    },
  });
    },
    receive: function(event, ui){
      ui.item.remove();
      var id = ui.item.attr("id");
      setTimeout(function() {$("#firstList").children("#"+id).removeClass("disabled");}, 100);
      if(id === "tr") turnRightCounter--;
      else if(id === "tl") turnLeftCounter--;
      else if(id === "mf") moveForwardCounter--;
      else if(id === "mb") moveBackwardCounter--;
      else if(id === "wt") waitCounter--;
      else if(id === "ifelse") ifElseCounter--;
      else if(id === "fl") forCounter--;
    }



        });

  $('#secondList').sortable({
    appendTo: 'body',
    connectWith: '#firstList, .forBlock, .ifBlock, .elseBlock',
    hoverClass: "ui-state-active",
    placeholder: "highlight",
    tolerance:"pointer",
    start: function (event, ui) {
      ui.item.toggleClass("highlight");
      startElement = $(this);
    },
    stop: function (event, ui) {
      ui.item.toggleClass("highlight");
      $('.placeholder').hide();
    },
    receive: function(event, ui){
      var id = ui.item.attr("id");
      if(forCounter === maxBlocks.forblock){
            setTimeout(function() {
              $("#firstList").children("#fl").addClass("disabled");
          }, 100);
          }
     if(waitCounter === maxBlocks.wait){
        setTimeout(function() {
              $("#firstList").children("#wt").addClass("disabled");
          }, 100);
      }
     if(ifElseCounter === maxBlocks.ifelse){
        setTimeout(function() {
              $("#firstList").children("#ifelse").addClass("disabled");
          }, 100);
      }
     if(moveForwardCounter === maxBlocks.moveForward){
        setTimeout(function() {
              $("#firstList").children("#mf").addClass("disabled");
          }, 100);
      }
     if(moveBackwardCounter === maxBlocks.moveBackward){
        setTimeout(function() {
              $("#firstList").children("#mb").addClass("disabled");
          }, 100);
      }
     if(turnLeftCounter === maxBlocks.turnLeft){
        setTimeout(function() {
              $("#firstList").children("#tl").addClass("disabled");
          }, 100);
      }
     if(turnRightCounter === maxBlocks.turnRight){
        setTimeout(function() {
              $("#firstList").children("#tr").addClass("disabled");
          }, 100);
      }

    }


            });
});
