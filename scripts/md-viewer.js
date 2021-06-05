let md = window.markdownit().set({
    html: true,
    typographer: false,
    quotes: '“”‘’'
});
markdownitMathjax({
    beforeMath: "$",
    afterMath: "$"
})(md);
$("#preview").html(DOMPurify.sanitize(md.render($("#text-input").val())));

/* codes below are adopted from https://codepen.io/jtojnar/full/Juiop */
String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
}
let ToC =
    "<nav role='navigation' class='table-of-contents'>" +
    "<h2>Contents:</h2>" +
    "<ul>";

let newLine, el, title, link, attr,
    level = 0,
    baseLevel = 0,
    count = 0;

$("#preview h1, #preview h2, #preview h3, #preview h4").each(function() {
    count++;
    el = $(this);
    title = el.text();
    attr = title.toLowerCase().split(" ").join("-");

    $(this).attr("id", attr);
    link = "#" + attr;

    let prevLevel = level || 0;
    level = this.nodeName.substr(1);
    if (!baseLevel) { // make sure you start with highest level of heading or it won't work
        baseLevel = level;
    }
    if (prevLevel == 0) {
        newLine = '<li>';
    } else if (level == prevLevel) {
        newLine = '</li><li>';
    } else if (level > prevLevel) {
        newLine = '<ul><li>'.repeat(level - prevLevel);
    } else if (level < prevLevel) {
        newLine = '</li></ul>'.repeat(prevLevel - level) +
            '</li><li>';
    }
    newLine += "<a href='" + link + "'>" + title + "</a>";

    ToC += newLine;

});

ToC += '</li></ul>'.repeat(level - baseLevel) + "</li>" + "</ul>" + "</nav>";

$("#toc").html(ToC);

if (count < 2) {
    $("#toc").hide();
    $(".markdown-body").css({
        "width": "100%",
        "padding-left": "0%"
    });
} else {
    $("#toc").show();
    $(".markdown-body").css({
        "width": "80%",
        "padding-left": "20%"
    });
}