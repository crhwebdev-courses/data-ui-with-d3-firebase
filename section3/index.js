const data = [
  { width: 200, height: 100, fill: 'purple' },
  { width: 100, height: 60, fill: 'pink' },
  { width: 50, height: 30, fill: 'red' }
];

const svg = d3.select('svg');

//example of including data and deriving attributes from the data
const rects = svg
  //select multiple elements
  .selectAll('rect')
  //join data to rects
  .data(data)
  //enter part of cycle where virtual nodes can be updated
  .enter()
  //create a node for each data point
  .append('rect')
  //set attributes
  .attr('width', d => d.width)
  .attr('height', d => d.height)
  .attr('fill', d => d.fill);
