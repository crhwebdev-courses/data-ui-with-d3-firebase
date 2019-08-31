//select html element where d3 will do its magic
const svg = d3.select('svg');

//get data from json file
d3.json('menu.json').then(data => {
  // join the data to rects
  const rects = svg.selectAll('rect').data(data);

  rects
    .attr('width', 50)
    .attr('height', d => d.orders)
    .attr('fill', 'orange')
    .attr('x', (d, i) => i * 70);
});
