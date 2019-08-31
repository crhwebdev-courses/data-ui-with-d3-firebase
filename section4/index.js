//select html element where d3 will do its magic
const svg = d3.select('svg');

//get data from json file
d3.json('menu.json').then(data => {
  //create scale for y value -
  //this will scale the values in the domain (data set values of 0 to 1000)
  //to fit the range 0 to 50
  const y = d3
    .scaleLinear()
    .domain([0, 1000])
    .range([0, 500]);

  // join the data to rects
  const rects = svg.selectAll('rect').data(data);

  rects
    .attr('width', 50)
    .attr('height', d => y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d, i) => i * 70)
    .attr('y', d => 500 - y(d.orders));

  // append the enter selection to the DOM
  rects
    .enter()
    .append('rect')
    .attr('width', 50)
    .attr('height', d => y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d, i) => i * 70)
    .attr('y', d => 500 - y(d.orders));
});
