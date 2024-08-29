import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';


console.log('main.js loaded');

const canvas = document.getElementById('canvas');

console.log(canvas.style.width);

let canvas_width;
let canvas_height;

canvas.style.width? canvas_width = canvas.style.width: canvas_width = 800;
canvas.style.height? canvas_height = canvas.style.height: canvas_height = 600;

//convert to vh to px
// canvas_width = parseInt(canvas_width);
// canvas_height = parseInt(canvas_height);

const margin = {top: 20, right: 20, bottom: 70, left: 70};

const svg_width = canvas_width - margin.left - margin.right;
const svg_height = canvas_height - margin.top - margin.bottom;

var hue_select


const scatter_svg = d3.select('#canvas')
    .append('svg')
    .attr('width', canvas_width)
    .attr('height', canvas_height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


const y_axis = scatter_svg.append('g')
const x_axis = scatter_svg.append('g')
                        .attr('transform', `translate(0, ${svg_height})`)

const legend = scatter_svg.append('g')
                        .attr('transform', `translate(${svg_width - 100}, ${svg_height/2+50})`);



async function load_data() {
    const data = await d3.json('/data');
    
    return data;
}

async function init_scatter_plot() {
    const data = await load_data();

    var y = d3.scaleLinear()
    .domain([d3.min(data, (d) => d.price), d3.max(data, (d) => d.price)])
    .range([svg_height, 0]);

    var x = d3.scaleLinear()
        .domain([d3.min(data, d => d.carat), d3.max(data, d => d.carat)])
        .range([0, svg_width]);
  

    scatter_svg.append('text')
        .attr('x', svg_width / 2)
        .attr('y', svg_height + 50)
        .attr('text-anchor', 'middle')
        .attr('id', 'x_label')
        .text('Carat');

    scatter_svg.append('text')
        .attr('x', -svg_height / 2)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('id', 'y_label')
        .text('Price');
    
    
    d3.select('#x-select')
        .on('change', function () {
            update_scatter_plot(data);
        });

    d3.select('#y-select')
        .on('change', function () {
            update_scatter_plot(data);
        });

    d3.select('#filter_color')
        .on('change', function () {
            update_scatter_plot(data);
        });

    d3.select('#filter_clarity')
        .on('change', function () {
            update_scatter_plot(data);
        });

    d3.select('#filter_cut')
        .on('change', function () {
            update_scatter_plot(data);
        });

    d3.select('#hue')
        .on('change', function () {
            update_hue(data);
        });

    update_hue(data);
    update_scatter_plot(data);

}

function update_scatter_plot(data) {
    const x_attr = d3.select("#x-select").property('value');
    const y_attr = d3.select("#y-select").property('value');
    console.log(d3.select("#y-select"))

    console.log('update scatter plot');
    // check if the attributes are numeric or categorical
    const x_is_numeric = !isNaN(data[0][x_attr]);
    const y_is_numeric = !isNaN(data[0][y_attr]);

    const data_filtered = data_filter(data);
    
    d3.select('#x_label').text(x_attr);
    d3.select('#y_label').text(y_attr);

    if (x_is_numeric) {
        var x = d3.scaleLinear()
            .domain([d3.min(data_filtered, d => d[x_attr]), d3.max(data_filtered, d => d[x_attr])])
            .range([0, svg_width]);
    } else {
        var x = d3.scaleBand()
            .domain(data_filtered.map(d => d[x_attr]))
            .range([0, svg_width])
            .padding(0.1);
    }

    if (y_is_numeric) {
        var y = d3.scaleLinear()
            .domain([d3.min(data_filtered, d => d[y_attr]), d3.max(data_filtered, d => d[y_attr])])
            .range([svg_height, 0]);

    } else {
        var y = d3.scaleBand()
            .domain(data_filtered.map(d => d[y_attr]))
            .range([svg_height, 0])
            .padding(0.1);
    }


    y_axis.transition().call(d3.axisLeft(y));
    x_axis.transition().call(d3.axisBottom(x));

    const hue_item = d3.select('#hue').property('value');
    console.log(hue_select)

    const circles = scatter_svg.selectAll('circle')
        .data(data_filtered)
        .join('circle')
        .attr('fill', d => hue_select(d[hue_item]))
        // .attr('fill', 'green')
        // .on('mouseover', function (event, d) {  // Use a regular function here
        //     d3.select(event.target).attr('fill', 'blue');  // 'this' now correctly refers to the circle element
        // })
        // .on('mouseout', function (event, d) {  // Optionally handle mouseout to reset the color
        //     d3.select(event.target).attr('fill', 'red');
        // })
        .transition()
        .duration(1000)
        .attr('cx', d => x(d[x_attr]))
        .attr('cy', d => y(d[y_attr]))
        .attr('r', 4)
        .attr('opacity', 0.8);

    

}

function data_filter(data) {
    const filter_color = d3.select('#filter_color').property('value');
    const filter_clarity = d3.select('#filter_clarity').property('value');
    const filter_cut = d3.select('#filter_cut').property('value');
    // console.log(filter_color);
    if (filter_color != 'all')  {
        var data_filtered = data.filter(d => d.color === filter_color);
        console.log(data_filtered);
    }
    else {
        var data_filtered = data;
        // console.log('all data')
    }

    if (filter_clarity != 'all') {
        data_filtered = data_filtered.filter(d => d.clarity === filter_clarity);
    }
    
    if (filter_cut != 'all') {
        data_filtered = data_filtered.filter(d => d.cut === filter_cut);
    }
    
    return data_filtered;
}

function update_hue(data) {
    // const filter_data = data_filter(data);
    const hue_item = d3.select('#hue').property('value');    
  
    if (hue_item === 'color') {
        hue_select = d3.scaleOrdinal()
            .domain(['D', 'E', 'F', 'G', 'H', 'I', 'J'])
            .range(d3.schemeCategory10);
    } else if (hue_item === 'cut') {
        hue_select = d3.scaleOrdinal()
            .domain(['Ideal', 'Premium', 'Very Good', 'Good', 'Fair'])
            .range(d3.schemeCategory10);
    }
    else if (hue_item === 'clarity') {
        hue_select = d3.scaleOrdinal()
            .domain(['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1'])
            .range(d3.schemeCategory10);
            }
    else if (hue_item == "None"){
        return // to do
    }
    console.log(hue_item);
    scatter_svg.selectAll('circle')
        // .transition()
        // .duration(1000)
        .attr('fill', d => hue_select(d[hue_item]));

    // update legend
    legend.selectAll('rect').remove();
    legend.selectAll('text').remove();

    const legend_items = hue_select.domain();
    const legend_height = 20;
    const legend_width = 20;

    legend.selectAll('rect')
        .data(legend_items)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * legend_height)
        .attr('width', legend_width)
        .attr('height', legend_height)
        .attr('fill', d => hue_select(d));

    legend.selectAll('text')
        .data(legend_items)
        .enter()
        .append('text')
        .attr('x', legend_width + 5)
        .attr('y', (d, i) => i * legend_height + legend_height / 2)
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .text(d => d);

}

init_scatter_plot();