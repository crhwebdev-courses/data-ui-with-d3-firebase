const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

//create svg element and assign appropriate width and height
const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', dims.width + 150)
  .attr('height', dims.height + 150);

//create a group for the pie chart and move it towards the center of the svg element
const graph = svg
  .append('g')
  .attr('transform', `translate(${cent.x}, ${cent.y})`);

// create funtion to generate pie chart using d3 pie function - will
// use the cost element from data that is passed in to create chart
const pie = d3
  .pie()
  .sort(null)
  .value(d => d.cost);

const angles = pie([
  { name: 'rent', cost: 500 },
  { name: 'bills', cost: 300 },
  { name: 'gaming', cost: 200 }
]);

console.log(angles);
