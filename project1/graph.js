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

// create funtion to generate pie chart angles using d3 pie function - will
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

const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

// create ordinal scale
const color = d3.scaleOrdinal(d3['schemeSet3']);

// update function
const update = data => {
  // update color scale domain
  color.domain(data.map(d => d.name));

  // join enhanced (pie) data to path elements
  const paths = graph.selectAll('path').data(pie(data));

  // handel exit selection
  paths.exit().remove();

  // handle the current DOM path updates
  paths.attr('d', arcPath);

  // handel enter selection
  paths
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('d', arcPath)
    .attr('fill', d => color(d.data.name))
    .attr('stroke', '#fff')
    .attr('stroke-width', 3);
};

// data array and firestore
var data = [];

db.collection('expenses').onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id === doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});

// create a custom animation for the pie chart
const arcTweenEnter = d => {
  // create a functin that returns a range of values
  // between the ending angle nd starting angle of each wedge
  let i = d3.interpoloate(d.endAngle, d.startAngle);

  // return a function that takes a ticker value t and
  // sets the startAngle using a value corresponding to the ticker value
  return function(t) {
    d.startAngle = i(t);
  };
};
