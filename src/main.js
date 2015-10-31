function getLabelForXAxis(series, options) {
    if (series.xaxis.options.axisLabel) {
        return series.xaxis.options.axisLabel;
    }
    return options.datatable.xaxis.label;
}

function getLabelForYAxis(series, options, suffix) {
    if (series.label !== undefined && series.label !== null) {
        return series.label;
    }
    if (series.yaxis.options.axisLabel) {
        return series.yaxis.options.axisLabel;
    }
    return options.datatable.yaxis.label + suffix;
}

function createTable(allSeries, options, useRawValues) {

    var identity = function(e) { return e;},
        xformat = useRawValues ? identity : options.datatable.xaxis.format,
        yformat = useRawValues ? identity : options.datatable.yaxis.format;

    var T = '<tr><th align="left">' + getLabelForXAxis(allSeries[0], options) + '</th>',
        t = '',
        i, j, N, M;

    for (j = 0, N = allSeries.length; j < N; j++) {
        if (allSeries[j].nodatatable) {
            continue;
        }
        T += '<th align="left">' + getLabelForYAxis(allSeries[j], options, j) + '</th>';
    }

    T += '</tr>';
    for (i = 0, N = allSeries[0].data.length; i < N; i++) {      // for each x
        t = '<tr><td nowrap>' + xformat(allSeries[0].data[i][0]) + '</td>';    // 1st colunm, x-value
        for (j = 0, M = allSeries.length; j < M; j++) {         // for each series
            if (allSeries[j].nodatatable) {
                continue;
            }
            t += '<td nowrap>' + yformat(allSeries[j].data[i][1]) + '</td>'; // add y-data
        }
        t += '</tr>';
        T += t;
    }

    return T;
}

function init(plot) {

    // Add the styles
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".flot-datatable-tab { display: inline; border: 1px solid black; border-bottom: 0; padding: 2px 5px 2px 5px; margin-left: 3px; border-radius: 4px 4px 0 0; cursor: pointer; } .flot-datatable-tab:hover { background-color: #DDDDDD; }";
    document.head.insertBefore(css, document.head.firstChild);

    plot.hooks.drawOverlay.push(function (plot) {
        var placeholder = plot.getPlaceholder();
        // Render the tabs on the first call
        if (placeholder.parent().find("#dataTab").length > 0) {
            return;
        }

        var tabplace = $('<div class="tabplace" style="width:' + placeholder[0].clientWidth + 'px;padding-left:' + (placeholder[0].clientWidth - 101) + 'px;"><div class="flot-datatable-tab" id="graphTab">Graph</div><div class="flot-datatable-tab" id="dataTab">Data</div></div>');
        var panel = $('<div title="Doubleclick to copy" class="tdata" style="width: ' + placeholder[0].clientWidth + 'px; height: ' + placeholder[0].clientHeight + 'px; padding: 0px; position: relative; overflow: scroll; background: white; z-index: 10; display: none;">' +
            '<input type="checkbox" name="raw" value="raw">Raw values<br>' +
            '<table style="width: 100%"></table>' +
            '</div>');

        $(placeholder)
            .wrap("<div class='wrapper'></div>")
            .before(tabplace)
            .append(panel);

        var checkbox = panel.find(":checkbox");
        var table = panel.find("table");

        var redrawTable = function() {
            table.html(createTable(plot.getData(), plot.getOptions(), checkbox.is(':checked')));
        };
        redrawTable();

        bindTabs(tabplace, panel);
        bindCheckbox(checkbox, redrawTable);
        bindTable(table);
    });

    function bindTabs(tabs, table) {
        tabs.click(function (e) {
            switch (e.target.id) {
                case 'graphTab':
                    table.hide();
                    break;
                case 'dataTab':
                    table.show();
                    break;
            }
        });
    }

    function bindCheckbox(checkbox, redrawTable) {
        checkbox.change(function() {
            redrawTable();
        });
    }

    function bindTable(table) {
        table.bind('dblclick', function () {
            highlightTableRows(table);
        });
    }

    function highlightTableRows(table) {
        var selection = window.getSelection(),
            range = document.createRange();
        range.selectNode(table.get()[0]);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}