
var bar = (g, margin, w, h, rawData) => {
    // Data preprocessing
    let data = rawData.map(d => {
        d.HBPRate = d.data.filter(k => k.HBP == '1').length * 100 / d.totalNum;
        return d;
    });
    // Init svg
    g.selectAll("g").remove();
    g = g.append("g");
    // Define X scale
    let x = d3.scaleBand()
        .domain(d3.range(data.length))
        .rangeRound([margin.left, w - margin.right])
        .paddingInner(0.5);
    // Define Y scale
    let y = d3.scaleLinear()
        .range([h - margin.bottom, margin.top])
        .domain([0, d3.max(data, d => d.HBPRate)]);
    // X axis 
    let x_axis = d3.axisBottom(x).tickFormat(d => {
        return data[d].year;
    });
    g.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${h - margin.bottom})`)
        .call(x_axis);
    // Y axis 
    let y_axis = d3.axisLeft(y).ticks(h / 50);
    g.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left - 3},0)`)
        .call(y_axis);
    // Draw x title
    g.append("g")
        .attr("transform", `translate(${w / 2.}, ${h - margin.bottom * 1.5 / 3.})`)
        .append("text")
        .attr("class", 'x-axis-title')
        .text("Year");
    // Draw y title
    g.append("g")
        .attr("transform", `translate(${margin.left / 2.}, ${margin.top * 1.5 / 2.})`)
        .append("g")
        .append("text")
        .attr("class", 'y-axis-title')
        .text('HBP Prevalence(%)');
    // Draw bars
    g.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", function (d, i) {
            return x(i);
        })
        .attr("y", function (d) {
            return y(d.HBPRate);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return h - margin.bottom - y(d.HBPRate);
        })
        .attr("fill", d3.schemeTableau10[3])
        .on("mousemove", (e, d) => {
            let html = `<label>HBP: ${d.data.filter(k => k.HBP == '1').length}</label>`;
            html += `<br /> Male vs. Female: ${d.data.filter(k => k.RIAGENDR == '1').length}/${d.data.filter(k => k.RIAGENDR == '2').length}`
            html += `<br /> HBP Male vs. HBP Female: ${d.data.filter(k => k.RIAGENDR == '1' && k.HBP == '1').length}/${d.data.filter(k => k.RIAGENDR == '2' && k.HBP == '1').length}`;
            d3.select("#tooltip").html(html)
                .style("left", e.x + 15 + "px")
                .style("top", e.y + 15 + "px")
                .style("display", "")
                ;
        })
        .on("mouseout", () => {
            d3.select("#tooltip")
                .style("display", "none");
        })
}

var getPieData = (rawData, type) => {
    let select_year = document.getElementById("year-select").value;
    let data = [];
    rawData.filter(d => d.year == select_year).forEach(d => {
        data = data.concat(d.data);
    });
    data = data.filter(d => d.HBP == '1');

    res = [];
    if (type == 'age') {
        data = data.map(d => {
            d.RIDAGEYR = + d.RIDAGEYR;
            return d;
        })
        res.push({ "name": "20-39", "value": data.filter(d => (d.RIDAGEYR >= 20 && d.RIDAGEYR <= 39)).length });
        res.push({ "name": "40-59", "value": data.filter(d => (d.RIDAGEYR >= 40 && d.RIDAGEYR <= 59)).length });
        res.push({ "name": "60-79", "value": data.filter(d => (d.RIDAGEYR >= 60 && d.RIDAGEYR <= 79)).length });
        res.push({ "name": ">=80", "value": data.filter(d => (d.RIDAGEYR >= 80)).length });
    }
    if (type == 'edu') {
        res.push({ "name": 'Less Than 9th Grade', "value": data.filter(d => d.DMDEDUC2 == '1').length });
        res.push({ "name": '9-11th Grade', "value": data.filter(d => d.DMDEDUC2 == '2').length });
        res.push({ "name": 'High School Grad/GED or Equivalent', "value": data.filter(d => d.DMDEDUC2 == '3').length });
        res.push({ "name": 'Some College or AA degree', "value": data.filter(d => d.DMDEDUC2 == '4').length });
        res.push({ "name": 'College Graduate or above', "value": data.filter(d => d.DMDEDUC2 == '5').length });
    }
    if (type == 'income') {
        res.push({ "name": '$0 to $4,999', "value": data.filter(d => d.INDFMIN2 == '1').length });
        res.push({ "name": '$5,000 to $9,999', "value": data.filter(d => d.INDFMIN2 == '2').length });
        res.push({ "name": '$10,000 to $14,9998', "value": data.filter(d => d.INDFMIN2 == '3').length });
        res.push({ "name": '$15,000 to $19,999', "value": data.filter(d => d.INDFMIN2 == '4').length });
        res.push({ "name": '$20,000 to $24,9999', "value": data.filter(d => d.INDFMIN2 == '5').length });
        res.push({ "name": '$25,000 to $34,999', "value": data.filter(d => d.INDFMIN2 == '6').length });
        res.push({ "name": '$35,000 to $44,999', "value": data.filter(d => d.INDFMIN2 == '7').length });
        res.push({ "name": '$45,000 to $54,999', "value": data.filter(d => d.INDFMIN2 == '8').length });
        res.push({ "name": '$55,000 to $64,999', "value": data.filter(d => d.INDFMIN2 == '9').length });
        res.push({ "name": '$65,000 to $74,999', "value": data.filter(d => d.INDFMIN2 == '10').length });
        res.push({ "name": '$75,000 to $99,999', "value": data.filter(d => d.INDFMIN2 == '14').length });
        res.push({ "name": '$100,000 and Over', "value": data.filter(d => d.INDFMIN2 == '15').length });
    }
    if (type == 'race') {
        res.push({ "name": 'Mexican American', "value": data.filter(d => d.RIDRETH3 == '1').length });
        res.push({ "name": 'Other Hispanic', "value": data.filter(d => d.RIDRETH3 == '2').length });
        res.push({ "name": 'Non-Hispanic White', "value": data.filter(d => d.RIDRETH3 == '3').length });
        res.push({ "name": 'Non-Hispanic Black', "value": data.filter(d => d.RIDRETH3 == '4').length });
        res.push({ "name": 'Non-Hispanic Asian', "value": data.filter(d => d.RIDRETH3 == '6').length });
        res.push({ "name": 'Other Race', "value": data.filter(d => d.RIDRETH3 == '7').length });
    }
    return res;
}

var pie = (g, margin, w, h, data) => {
    g.selectAll("g").remove();
    let radius = Math.min(w - margin.left - margin.right, h - margin.top - margin.bottom) / 2;
    let gPie = g.append("g")
        .attr("transform", `translate(${w / 2.}, ${h / 2.})`);

    let total = d3.sum(data, d => d.value);

    // pie 
    let pie = d3.pie()
        .value(function (d) { return d.value; });

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    gPie.selectAll("path")
        .data(pie(data))
        .join('path')
        .attr('d', arc)
        .attr('fill', (d,i)=>{
            return d3.schemeTableau10[ d.index % 10 ];
        })
        .attr("stroke", "white")
        .attr("opacity", 0.5)
        .style("stroke-width", "1px")
        .style("opacity", 1)
        .on("mousemove", (e, d) => {
            let html = `<label>Name: ${d.data.name}</label>`;
            html += `<br /> <label>HBP Num: ${d.data.value}</label>`
            html += `<br /> <label>Percentage: ${(d.data.value * 100 / total).toFixed(1)}%</label>`
            d3.select("#tooltip").html(html)
                .style("left", e.x + 15 + "px")
                .style("top", e.y + 15 + "px")
                .style("display", "")
                ;
        })
        .on("mouseout", () => {
            d3.select("#tooltip")
                .style("display", "none");
        })
}

var linechart = (g, margin, w, h, data, x, y, xtitle, ytitle, offsetx) => {
    g.selectAll("g").remove();
    // Processing data
    data = data.map(d => {
        return { 'x': +d[x], 'y': +d[y] };
    });
    data.sort((a, b) => a.x - b.x);

    let X = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x))
        .range([margin.left, w - margin.right]);

    let Y = d3.scaleLinear()
        .domain([0, 1])
        .range([h - margin.bottom, margin.top]);

    let line = d3.line()
        .x(d => X(d.x))
        .y(d => Y(d.y));

    let xa = d3.axisBottom(X).ticks(w / 80);
    g.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${h - margin.bottom})`)
        .call(xa);

    let ya = d3.axisLeft(Y).ticks(h / 50);
    g.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left - 3},0)`)
        .call(ya);

    g.append("g")
        .attr("transform", `translate(${w / 2.}, ${h - margin.bottom + 35})`)
        .append("text")
        .attr("class", 'x-axis-title')
        .text(xtitle);

    g.append("g")
        .attr("transform", `translate(${margin.left / 2.}, ${h / 2.})`)
        .append("g")
        .append("text")
        .attr("transform", 'rotate(-90)')
        .attr("class", 'y-axis-title')
        .text(ytitle)
        .style("text-anchor", "middle");

    // Draw line
    g.append("g")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", d3.schemeTableau10[3])
        .attr("stroke-width", 2);

    // Movemove function
    g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", h)
        .attr("width", w)
        .attr("opacity", 0);
    let l = g.append("line")
        .attr("y1", 0)
        .attr("y2", Y.range()[0])
        .attr("fill", "none")
        .attr("stroke", d3.schemeTableau10[3])
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "5 5")
        .attr("opacity", 0)
        ;

    let gety = (x) => {
        let dis = data.map(d => [d.y, Math.abs(x - d.x)]);
        return dis.sort((a, b) => a[1] - b[1])[0][0];
    }

    g.on("mousemove", (e, d) => {
        let x = e.offsetX - offsetx;
        let v = Math.round(X.invert(x));
        let y = gety(v);
        v = v > X.domain()[1] ? X.domain()[1] : v;
        if (v >= X.domain()[0] && v <= X.domain()[1]) {
            l
                .attr("y1", Y(y))
                .attr("x1", X(v))
                .attr("x2", X(v))
                .attr("opacity", 1)
                ;
            let html = `<label>${xtitle}: ${v}</label>`;
            html += `<br /> <label>${ytitle}: ${y.toFixed(2)}</label>`
            d3.select("#tooltip").html(html)
                .style("left", e.x + 15 + "px")
                .style("top", e.offsetY + 15 + "px")
                .style("display", "")
                ;
        }
        else {
            l.attr("opacity", 0);
            d3.select("#tooltip")
                .style("display", "none");
        }

    })
        .on("mouseout", (e, d) => {
            l.attr("opacity", 0);
            d3.select("#tooltip")
                .style("display", "none");
        });
}

function main() {
    Promise.all(
        [
            d3.dsv(",", "./Data1112.csv"),
            d3.dsv(",", "./Data1314.csv"),
            d3.dsv(",", "./Data1516.csv"),
            d3.dsv(",", "./Data1718.csv"),
            d3.dsv(",", "./logisticregression.csv")
        ]
    )
        .then(function (data) {
            let [data_1112, data_1314, data_1516, data_1718, logisticregression] = data;
            let rawData = [
                { "year": '2011/2012', "data": data_1112, "totalNum": data_1112.length },
                { "year": '2013/2014', "data": data_1314, "totalNum": data_1314.length },
                { "year": '2015/2016', "data": data_1516, "totalNum": data_1516.length },
                { "year": '2017/2018', "data": data_1718, "totalNum": data_1718.length },
            ];
            // Svg 
            let svg = d3.select("#svg");
            let width = document.getElementById("svg").clientWidth;
            let height = document.getElementById("svg").clientHeight;
            // Margin 
            let margin = {
                left: 80,
                right: 30,
                top: 30,
                bottom: 70
            };
            // Draw bar chart
            let g_bar = svg.append("g");
            let w_bar = width / 2.0;
            let h_bar = height / 2.0;
            bar(g_bar, margin, w_bar, h_bar, rawData);
            // Draw pie chart
            let select_type = 'age';
            let g_pie = svg.append("g").attr("transform", `translate(${width / 2.}, 0)`);
            let w_pie = width / 2.0;
            let h_pie = height / 2.;
            pie(
                g_pie,
                margin,
                w_pie,
                h_pie,
                getPieData(rawData, select_type)
            );
            d3.selectAll(".sel")
                .on("change", (e) => {
                    select_type = e.target.value;
                    pie(
                        g_pie,
                        margin,
                        w_pie,
                        h_pie,
                        getPieData(rawData, select_type)
                    )
                });
            d3.select("#year-select")
                .on("change", (e) => {
                    pie(
                        g_pie,
                        margin,
                        w_pie,
                        h_pie,
                        getPieData(rawData, select_type)
                    )
                });
            // Draw line chart 
            let g_lineLBDHDD = svg.append("g").attr("transform", `translate(0, ${height / 2.})`);
            let w_LBDHDD = width * 1.0 / 3;
            let h_LBDHDD = height / 2.;
            linechart(
                g_lineLBDHDD,
                margin,
                w_LBDHDD,
                h_LBDHDD,
                logisticregression,
                'LBDHDD',
                'LBDHDD_SCORE',
                'HDL(mg/dL)',
                'Probability of HBP',
                0
            );

            let g_lineLBXTR = svg.append("g").attr("transform", `translate(${w_LBDHDD}, ${height / 2.})`);
            let w_LBXTR = width * 1.0 / 3;
            let h_LBXTR = height / 2.;
            linechart(
                g_lineLBXTR,
                margin,
                w_LBXTR,
                h_LBXTR,
                logisticregression,
                'LBXTR',
                'LBXTR_SCORE',
                'Triglyceride (mg/dL)',
                'Probability of HBP',
                w_LBDHDD
            );

            let g_lineLBDLDL = svg.append("g").attr("transform", `translate(${w_LBDHDD + w_LBXTR}, ${height / 2.})`);
            let w_LBDLDL = width * 1.0 / 3;
            let h_LBDLDL = height / 2.;
            linechart(
                g_lineLBDLDL,
                margin,
                w_LBDLDL,
                h_LBDLDL,
                logisticregression,
                'LBDLDL',
                'LBDLDL_SCORE',
                'LDL(mg/dL)',
                'Probability of HBP',
                w_LBDHDD + w_LBXTR
            );
        }
        )
};

main();