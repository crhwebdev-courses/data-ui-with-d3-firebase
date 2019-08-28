const data = [{ width: 200, height: 100, fill: 'purple' }];

const svg = d3.select('svg');

//example of including data and deriving attributes from the data
const rect = svg
  //select dom element
  .select('rect')
  //include data
  .data(data)
  //set attributes
  .attr('width', d => d.width)
  .attr('height', d => d.height)
  .attr('fill', d => d.fill);
