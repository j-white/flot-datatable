function init(plot) {

    plot.makeTableHolder = function(){
        var placeholder = plot.getPlaceholder();
        var tabplace = $('<div class="tabplace" style="width: '+placeholder[0].clientWidth+'px;"><div class="tab" id="graphTab">Graph</div><div class="tab" id="dataTab">Data</div></div>');
        var T = $('<div title="Doubleclick to copy" class="tdata" style="width: '+placeholder[0].clientWidth+'px; height: '+placeholder[0].clientHeight+'px; padding: 0px; position: relative; overflow: scroll; background: white; z-index: 10; display: none;">'+makeTable()+'</div>');

        $(placeholder)
            .wrap("<div class='wrapper'></div>")
            .before(tabplace)
            .append(T);
        bindTabs(tabplace, T);
        bindTable(T);
    }

    function makeTable(){
        var D = plot.getData();
     // if D.length > 0            ----  catch errors
        var ftt = d3.format(".4f");
        var T = '<table><tr><th>'+(D[0].xaxis.options.axisLabel ? D[0].xaxis.options.axisLabel : 'x')+'</th>', t = '';  // if no x - label name: x
        for (var j = 0; j < D.length; j++) {
            T += '<th>'+(D[j].yaxis.options.axisLabel ? D[j].yaxis.options.axisLabel : 'y'+j)+'</th>';   // create 1st header row, if no y - label name: yN
        }
        T += '</tr>';
        for (var i = 0; i < D[0].data.length; i++) {                  // for each x
            t='<tr><th>'+ftt(D[0].data[i][0])+'</th>'    // 1st colunm, x-value
            for (var j = 0; j < D.length; j++) {         // for each series
                t += '<td>'+ftt(D[j].data[i][1])+'</td>' // add y-data
            };
            t += '</tr>';
            T += t;
        };
        T += '</table>';
        return T
    }
    function bindTabs(tabs, table){
        tabs.click(function(e){
            switch (e.target.id) {
                case 'graphTab': {table.hide();  break;}

                case 'dataTab':  {table.show();}
            };
        });
    }
    function bindTable(table){
        table.bind('dblclick', function(e) {
            copyTable(e, table);
        });
    }

    function copyTable(e, table){
        console.log(table.get());

            var selection = window.getSelection(),
            range = document.createRange();
            range.selectNode(table.get()[0]);
            selection.removeAllRanges();
            selection.addRange(range);
            /*if(document.execCommand){
                document.execCommand("Copy");
                selection.removeAllRanges();
                showtooltip(e,'Copied', 1000);
            } else { showtooltip(e,'Copy the selection', 2000); }*/

    }

    function showtooltip(e, show, time){
        var tooltip = $('<div id="copied"/>').html(show);
        var posx = e.clientX +window.pageXOffset +'px'; //Left Position of Mouse Pointer
        var posy = e.clientY + window.pageYOffset - 30 + 'px'; //Top Position of Mouse
        tooltip.css({
            'position': 'absolute',
            'left': posx,
            'top': posy,
            'z-index': 20,
            'border': '1px solid black',
            'padding': '3px',
            'border-radius': '4px 4px 4px 0',
            'background':'#DDDDDD'
        });
        $('body').append(tooltip);
        setTimeout(function(){ $(tooltip).remove()}, time);

    }
}