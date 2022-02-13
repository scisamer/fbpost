function addList(id,email,run,n,status) {
    var _s = run,color;

    if(run) {
        _s = "stop";

        var btn = {txt:'stop',class:'btn-outline-warning'}

    }  else
    {
        _s = "start";

        var btn = {txt:'start',class:'btn-outline-success'}
}

        if(status == 'stop') color = 'red'; else color = 'green';


    var html ='<div id="'+ id  +'" class="div1"> \
        <span style="color: '+ color +'; right: 332px; font-size: 20px" class="size">'+ status +'</span>\
        <span style="font-size: 20px; color: #000000;">'+ email  +'</span>\
<div id="bus" style="display: inline; left: 220px;" class="size">\
\
        <button type="button" class="btn '+  btn.class +' cursor stop" data-user="'+ id +'" data-send='+ _s +'>'+ btn.txt +'</button>\
        <button type="button" class="btn btn-outline-danger cursor del" data-user="'+ id +'">delete</button>\
        </div>\
\   <div style="display: inline">\
\ <span id="succ">'+n+'</span>\
</div>\
\
        </div>';

    var $html = $(html);

    $("#main").append($html);
}



$(function ($) {
    $('#new').on('click',function (e) {
        $('#exampleModal').modal();
    });
});


function reset() {
    var obs = ['#post_id', '.c1'];

    for (var i in obs)
        $(obs[i]).val('');
}