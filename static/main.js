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

const margin = {top: 20, right: 20, bottom: 170, left: 70};

const svg_width = canvas_width - margin.left - margin.right;
const svg_height = canvas_height - margin.top - margin.bottom;



const scatter_svg = d3.select('#canvas')
    .append('svg')
    .attr('width', canvas_width)
    .attr('height', canvas_height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


const y_axis = scatter_svg.append('g')
const x_axis = scatter_svg.append('g')
                        .attr('transform', `translate(0, ${svg_height})`)


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



    y_axis.call(d3.axisLeft(y));
    x_axis.call(d3.axisBottom(x));

   
    scatter_svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.carat))
        .attr('cy', d => y(d.price))
        .attr('r', 5)
        .attr('fill', 'green')
        .on('mouseover', function (event, d) {  // Use a regular function here
            d3.select(this).attr('fill', 'blue');  // 'this' now correctly refers to the circle element
        })
        .on('mouseout', function (event, d) {  // Optionally handle mouseout to reset the color
            d3.select(this).attr('fill', 'red');
        });

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
            const x_attr = d3.select(this).property('value');
            update_scatter_plot(data, x_attr, 'price');
        });

    d3.select('#y-select')
        .on('change', function () {
            const y_attr = d3.select(this).property('value');
            update_scatter_plot(data, 'carat', y_attr);
        });

    d3.select('#filter_color')
        .on('change', function () {
            const filter_color = d3.select(this).property('value');
            update_scatter_plot(data, 'carat', 'price', filter_color);
        });


}

function update_scatter_plot(data, x_attr, y_attr, filter_color='all') {
    console.log('update scatter plot');
    // check if the attributes are numeric or categorical
    const x_is_numeric = !isNaN(data[0][x_attr]);
    const y_is_numeric = !isNaN(data[0][y_attr]);
    console.log(filter_color);
    if (filter_color != 'all')  {
        
        var data_filtered = data.filter(d => d.color === filter_color);
        console.log(data_filtered);
    }
    else {
        var data_filtered = data;
        console.log('all data')
    }


    
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

    scatter_svg.selectAll('circle')
        .data(data_filtered)
        .join('circle')
        .transition()
        .duration(1000)
        .attr('cx', d => x(d[x_attr]))
        .attr('cy', d => y(d[y_attr]))
        .attr('r', 5)
        .attr('fill', 'green')
        .on('mouseover', function (event, d) {  // Use a regular function here
            d3.select(event.target).attr('fill', 'blue');  // 'this' now correctly refers to the circle element
        })
        .on('mouseout', function (event, d) {  // Optionally handle mouseout to reset the color
            d3.select(event.target).attr('fill', 'red');
        });


    

}

init_scatter_plot();