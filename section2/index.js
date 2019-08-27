//use a d3 selector to select the div with class canvas
const canvas = d3.select('.canvas');

//append an svg to the canvas
const svg = canvas.append('svg');

svg.attr('height', 600).attr('width', 600);

//create a d3 group
const group = svg.append('g');

//append shapes to svg container
group
  .append('rect')
  .attr('width', 200)
  .attr('height', 100)
  .attr('fill', 'blue')
  .attr('x', 20)
  .attr('y', 20);
group
  .append('circle')
  .attr('r', 50)
  .attr('cx', 300)
  .attr('cy', 70)
  .attr('fill', 'pink');
group
  .append('line')
  .attr('x1', 370)
  .attr('x2', 400)
  .attr('y1', 20)
  .attr('y2', 120)
  .attr('stroke', 'red');

group
  .append('text')
  .attr('x', 20)
  .attr('y', 200)
  .attr('fill', 'grey')
  .text('Hello, Ninjas!')
  .style('font-family', 'arial')
  .style('font-size', 50);
