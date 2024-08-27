import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';


console.log('main.js loaded');

const canvas = document.getElementById('canvas');

console.log(canvas.style.width);

let canvas_width;
let canvas_height;

canvas.style.width? canvas_width = canvas.style.width: canvas_width = 800;
canvas.style.height? canvas_height = canvas.style.height: canvas_height = 600;

const scatter_svg = d3.select('#canvas')
    .append('svg')
    .attr('width', canvas_width)
    .attr('height', canvas_height)
    .style('border', '1px solid black');


d3.json('/data').then(data => {
    
 
    console.log(data);
    init_scatter_plot(data);

    });


function init_scatter_plot(data) {
    const y = d3.scaleLinear()
    .domain([d3.min(data, (d) => d.price), d3.max(data, (d) => d.price)])
    .range([0, canvas_height]);

    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.carat), d3.max(data, d => d.carat)])
        .range([0, canvas_width]);

    scatter_svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.carat))
        .attr('cy', d => y(d.price))
        .attr('r', 5)
        .attr('fill', 'red')
        .on('mouseover', function (event, d) {  // Use a regular function here
            d3.select(this).attr('fill', 'blue');  // 'this' now correctly refers to the circle element
        })
        .on('mouseout', function (event, d) {  // Optionally handle mouseout to reset the color
            d3.select(this).attr('fill', 'red');
        });

}