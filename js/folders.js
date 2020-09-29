$(function() {
    url = "https://api.index.hu/folder/folders/index.hu";
    $.ajax({
        url: url,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "85IsCGestuf5B6WdaPC6QJl8v94tQuDjwEFqUCt4pp0EeqBJH");
        },
        success: function(answ) {
            //add root <ul> to tree
            $("#treediv").append("<ul id='tree" + answ.data[0].folderId + "'></ul>");
            
            //folders processing
            foldersArr = answ.data[0].children;
            $.each(foldersArr, function (i, folders) {
                foreachOnArray(folders);
            });
            
            //add toggler to tree
            treeToggler();
            
            //search in <a> tags
            $('input[type="text"]').keyup(function() {
                var searchText = $(this).val();
                searchInATags(searchText);
            });
            
            //clicked url to top div
            $("a").each(function () {
                $(this).click(function() {
                    $("#clickedurl").html($(this).attr("href"));
                });
            });
            
            //edit function
            editFolderName();
            
            //save function
            saveFolderName();
        }
    });
});

function foreachOnArray(receivedArr) {
    if (receivedArr.children.length > 0) {
        $("#tree" + receivedArr.parentId).append("<li id='" + receivedArr.folderId + "'><span class='arrow'></span><a href='https://" + receivedArr.siteUrl + receivedArr.path + "' target='contentframe'>" + receivedArr.cim + "</a><span class='edit'></span><span class='save'></span><ul id='tree" + receivedArr.folderId + "' class='closed'>");
        $.each(receivedArr.children, function (i, folders) {
            foreachOnArray(folders);
        });
        $("#tree" + receivedArr.parentId).append("</ul></li>"); 
    } else {
        $("#tree" + receivedArr.parentId).append("<li id='" + receivedArr.folderId + "'><a href='https://" + receivedArr.siteUrl + receivedArr.path + "' target='contentframe'>" + receivedArr.cim + "</a><span class='edit'></span><span class='save'></span></li>");
    }
}

function treeToggler() {
    var toggler = document.getElementsByClassName("arrow");
    var t;
    for (t = 0; t < toggler.length; t++) {
        $(toggler[t]).click(function() {
            allEditableFalse();
            $(this.parentElement).children("ul").toggle();
            if ($(this.parentElement).children("ul").is(":visible")) {
                $(this).addClass("arrow-down");
            } else {
                $(this).removeClass("arrow-down");
            }
        });
    }
}

function searchInATags(searchText) {
    $("a").each(function () {
        if ($(this).text().search(new RegExp(searchText, "i")) < 0) {
            $(this).removeClass("searchResult");
            $(this).parent("li").hide();
            if ($(this).parent().children("span").hasClass("arrow")) {
                $(this).parent().children("span").removeClass("arrow-down");
            }
        } else {
            $(this).addClass("searchResult");
            $(this).parents().show();
            if ($(this).parent().children("span").hasClass("arrow")) {
                $(this).parent().children("span").addClass("arrow-down");
                $(this).children("li").show();
            }
        }
    });
    if (searchText == "") {
        $("a").each(function () {
            $(this).removeClass("searchResult");
        });
    }
}

function editFolderName() {
    var edits = document.getElementsByClassName("edit");
    var e;
    for (e = 0; e < edits.length; e++) {
        $(edits[e]).click(function() {
            allEditableFalse();
            $(this.parentElement).children("a").attr('contentEditable', 'true');
            $(this.parentElement).children("a").focus();
            $(this.parentElement).children("a").css("background-color", "#ffd1b3");
            $(this).hide();
            $(this.parentElement).children("span.save").show();
        });
    }
}

function allEditableFalse() {
    var edits = document.getElementsByClassName("edit");
    var e;
    for (e = 0; e < edits.length; e++) {
        $(edits[e].parentElement).children("a").attr('contentEditable', 'false');
        $(edits[e].parentElement).children("a").css("background-color", "#fff");
        $(edits[e].parentElement).children("span.save").hide();
        $(edits[e]).show();
    }
}

function saveFolderName() {
    var saves = document.getElementsByClassName("save");
    var s;
    for (s = 0; s < saves.length; s++) {
        $(saves[s]).click(function() {
            allEditableFalse();
        });
    }
}