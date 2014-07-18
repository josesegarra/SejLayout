
sej_layouts = { layouts: {}, dragging: null };                                                              // Initially there are no layouts

sej_layouts.AddHLayout = function (parent, name, lwidth)
{
    $(parent).html("");                                                                     // Clear DIV parent
    var l={ name: name , kind: "H" };                                                       // Lets create the layout object, with name and kind
    
    l.prev=$("<div style='position: absolute; top: 0px ; bottom: 0px'/>");                  // Lets create left panel
    l.split = $("<div style='position: absolute; top: 0px ; bottom: 0px' />");              // splitter
    l.next = $("<div style='position: absolute; top: 0px ; bottom: 0px'/>");                // and next panel
    l.prev.css("width",lwidth);
    $(parent).append(l.prev);
    l.split.css("width", "5px");
    l.split.css("left", l.prev.outerWidth(true) + "px");
    $(parent).append(l.split);
    l.split.mousedown(function (e0) {
        l.offset = e0.offsetX;
        l.prev_pos = l.prev.offset();
        sej_layouts.dragging = l;
        $("#header").html("Mouse down");
        e0.preventDefault();
    });

    l.next.css("right", "0px");
    l.next.css("left", (l.prev.outerWidth(true) + l.split.outerWidth(true)) + "px");
    $(parent).append(l.next);
    l.Update = sej_layouts.UpdateH;
    this.layouts[name] = l;
    return l;
}

sej_layouts.AddVLayout = function (parent, name, lheight) {
    $(parent).html("");                                                                     // Clear DIV parent
    var l = { name: name, kind: "V" };                                                       // Lets create the layout object, with name and kind

    l.prev = $("<div style='position: absolute; left: 0px ; right: 0px'/>");                  // Lets create left panel
    l.split = $("<div style='position: absolute; left: 0px ; right: 0px' />");              // splitter
    l.next = $("<div style='position: absolute; left: 0px ; right: 0px'/>");                // and next panel
    l.prev.css("height", lheight);
    $(parent).append(l.prev);

    l.split.css("height", "5px");
    l.split.css("top", l.prev.outerHeight(true) + "px");
    $(parent).append(l.split);
    l.split.mousedown(function (e0) {
        l.offset = e0.offsetY;
        l.prev_pos = l.prev.offset();
        sej_layouts.dragging = l;
        e0.preventDefault();
    });

    l.next.css("bottom", "0px");
    l.next.css("top", (l.prev.outerHeight(true) + l.split.outerHeight(true)) + "px");
    $(parent).append(l.next);
    l.Update = sej_layouts.UpdateV;
    this.layouts[name] = l;
    return l;
}

sej_layouts.UpdateH = function () {
    this.prev_pos = this.prev.offset();
    var j = this.prev_pos.left + this.prev.outerWidth(true);
    var p=this.split.parent();
    if (j > (p.offset().left + p.outerWidth(true) - 40)) {
        j = p.offset().left + p.outerWidth(true) - 40;
    }
    var j0 = j +parseInt(this.split.css("marginLeft").replace("px",""));
    this.split.offset({ top: this.split.top, left: j0 });                                            // Position of spliter
    this.next.offset({ top: this.next.top, left: j + this.split.outerWidth(true) });                    // Position of right panel
}

sej_layouts.UpdateV = function () {
    this.prev_pos = this.prev.offset();
    var j = this.prev_pos.top+ this.prev.outerHeight(true);
    var p = this.split.parent();
    if (j > (p.offset().top + p.outerHeight(true) - 40)) {
        j = p.offset().top+ p.outerHeight(true) - 40;
    }
    var j0 = j + parseInt(this.split.css("marginTop").replace("px", ""));
    this.split.offset({ left: this.split.left, top: j0 });                                            // Position of spliter
    this.next.offset({ left: this.next.left, top: j + this.split.outerHeight(true) });                    // Position of right panel
}

sej_layouts.init = function ()
{

    function pH(event,dr) {
        var w = event.pageX - dr.prev_pos.left - dr.offset;                                                       // w=expected width of left panel
        if (w < 20) return;                                                                                 // If w<20 return
        var j = dr.prev_pos.left + w;                                                                 // j=Expected X position of Splitter
        var k = dr.next.offset().left + dr.next.outerWidth(true) - j - dr.split.outerWidth(true);            // k=Expected width of right panel
        if (k<20) return;                                                                                   // if k<20 return 
        dr.prev.width(w);                                                                        // Width of left panel
        dr.Update();
        event.preventDefault();                                                                             // Prevent default handler
    }

    function pV(event, dr) {
        var w = event.pageY - dr.prev_pos.top - dr.offset;                                                       // w=expected width of left panel
        if (w < 20) return;                                                                                 // If w<20 return
        var j = dr.prev_pos.top + w;                                                                 // j=Expected X position of Splitter
        var k = dr.next.offset().top + dr.next.outerHeight(true) - j - dr.split.outerHeight(true);            // k=Expected width of right panel
        if (k < 20) return;                                                                                   // if k<20 return 
        dr.prev.height(w);                                                                        // Width of left panel
        dr.Update();
        event.preventDefault();                                                                             // Prevent default handler
    }

    $(document.body).mousemove(
        function (event) {
            if (sej_layouts.dragging == null) return;
            if (sej_layouts.dragging.kind == "H") return pH(event, sej_layouts.dragging);
            if (sej_layouts.dragging.kind == "V") return pV(event, sej_layouts.dragging);
        });
    $(document.body).mouseup(function () { sej_layouts.dragging = null; });
    $(document.body).resize(function ()
    {
        sej_layouts.layouts.foreach(function (l) { l.Update(); });
    });
}


