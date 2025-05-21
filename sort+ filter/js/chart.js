

function createArrGraph(data, key, states) {

    groupObj = d3.group(data, d => d[key]);
    let arrGraph =[];
    for(let entry of groupObj) {
        let minMax = d3.extent(entry[1].map(d => d['budget']));
        let result = [];

        //инимум максимум в зависимости от флагов
        if (states[0]) result.push(d3.min(minMax)); // мин
        if (states[1]) result.push((d3.max(minMax)+d3.min(minMax))/2);// среднее
        if (states[2]) result.push(d3.max(minMax))

        arrGraph.push({ labelX: entry[0], values: result }); // объект с меткой и значениями

    }
    return arrGraph;
}

//отрисовка графика
function drawGraph(data) {
    let keyX='';
    //выбор keyX, по какому значению будем строить по оси OX
    if(document.getElementById('typeRadio').checked) {
        keyX='type';
    }
    if(document.getElementById('yearRadio').checked){
        keyX="year"
        data.sort((first, second) =>{
            let firstNum=Number(first["year"]);
            let secondNum=Number(second["year"]);
            return firstNum-secondNum;
        })
    }
    if(document.getElementById('countryRadio').checked){
        keyX='country'
    }

    const states = [
        document.getElementById('chbMinBudget').checked,
        document.getElementById('chbAvgBudget').checked,
        document.getElementById('chbMaxBudget').checked
    ]

    let flag = states.some(i => i); //проверяем выбрано ли значение

    //данные для графика
    let arrGraph = createArrGraph(data, keyX, states);

    //инициализация свг
    let svg = d3.select("svg");
    console.log(flag)
    if (!flag) {
        //ошибкв
        svg.selectAll('*').remove();
        document.getElementById('error').innerHTML='Выберите значение по оси OY'
        return
    }
    svg.selectAll('*').remove(); // очищаем график
    document.getElementById('error').innerHTML=''

    svg.style("width", 800)
       .style("height", 400);

    //параметры области графика
    let attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    };

    //создаем оси
    const [scX, scY] = createAxis(svg, arrGraph, attr_area);

    //график
    if(document.getElementById('selectTypeGraph').value==0) {
        createChart(svg, arrGraph, scX, scY, attr_area, ["blue", "green", "red"])
    }
    if(document.getElementById('selectTypeGraph').value==1){
        createGist(svg, arrGraph, scX, scY, attr_area, ["blue", "green", "red"])
    }
    if(document.getElementById('selectTypeGraph').value==2){
        createLine(svg, arrGraph, scX, scY, attr_area, ["blue", "green", "red"])
    }
}

//создание осей графика
function createAxis(svg, data, attr_area) {
    const flatValues = data.flatMap(d => d.values);
    const [min, max] = d3.extent(flatValues);

    // Шкала X с небольшим отступом
    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.2);

    // Шкала Y, начинающаяся с 0
    let scaleY = d3.scaleLinear()
        .domain([0, Math.ceil(max * 1.15)]) // Всегда начинаем с 0
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    // Ось X
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(d3.axisBottom(scaleX))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    // Ось Y
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(d3.axisLeft(scaleY));

    return [scaleX, scaleY];
}

//построение на графике
function createChart(svg, data, scaleX, scaleY, attr_area, color) {
    const r = 4;
    for(let i=0; i<data[0].values.length; i++) {
            let shift=i-1
            svg.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("r", r)
                .attr("cx", d => scaleX(d.labelX) +shift + scaleX.bandwidth() / 2)
                .attr("cy", d => scaleY(d.values[i]))
                .attr("transform", `translate(${attr_area.marginX},
                ${attr_area.marginY})`)
                .style("fill", color[i])
    }
}

function createGist(svg, data, scaleX, scaleY, attr_area, color) {
    const barGroupWidth = scaleX.bandwidth();
    const barWidth = barGroupWidth / (data[0].values.length + 1) * 0.8;
    const zeroY = scaleY(0); // Y-координата нулевого значения (основание столбцов)

    // Очищаем предыдущие элементы
    svg.selectAll(".bar-group").remove();

    // Создаем группу для всех столбцов
    const barGroup = svg.append("g")
        .attr("class", "bar-group")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`);

    // Рисуем столбцы для каждого значения (min/avg/max)
    data[0].values.forEach((_, i) => {
        barGroup.selectAll(`.bar-${i}`)
            .data(data)
            .enter()
            .append("rect")
            .attr("class", `bar-${i}`)
            .attr("x", d => scaleX(d.labelX) + i * (barWidth + barWidth * 0.2))
            .attr("y", d => scaleY(d.values[i]))
            .attr("width", barWidth)
            .attr("height", d => zeroY - scaleY(d.values[i])) // Высота от значения до оси X
            .attr("fill", color[i]);
    });
}


function createLine(svg, data, scaleX, scaleY, attr_area, color) {
    for(let i=0; i<data[0].values.length; i++){
    let shift=i-1
    let path=''
    data.forEach((item, index) =>{
        if(index===0) path+=`M${scaleX(item.labelX) + shift + scaleX.bandwidth()/2},${scaleY(item.values[i])} `
        else path+=`L${scaleX(item.labelX) + shift + scaleX.bandwidth()/2},${scaleY(item.values[i])} `
    })
    path=path.trim()

    let line=d3.line()
        .x(d=>d.x)
        .y(d=>d.y)
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("transform", `translate(${attr_area.marginX},
        ${attr_area.marginY})`)
        .style("stroke", color[i])
        .style("stroke-width", 3)
    }
}

// удал ошибки при изменении чекбоксов
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("minis").addEventListener("change", function () {
        d3.select("input[name='oyvalue']").node().parentNode.classList.remove("error");
    });
    document.getElementById("maxis").addEventListener("change", function () {
        d3.select("input[name='oyvalue']").node().parentNode.classList.remove("error");
    });
});

// убираем сообщение об ошибке при изменении любого чекбокса OY
document.addEventListener("DOMContentLoaded", function () {
  ['chbMinBudget', 'chbAvgBudget', 'chbMaxBudget'].forEach(id => {
    const cb = document.getElementById(id);
    cb.addEventListener('change', () => {
      document.getElementById('error').innerHTML = '';
    });
  });
});