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

// legend setup
const legendGroup = svg
  .append('g')
  .attr('transform', `translate(${dims.width + 40}, 30)`);

const legend = d3
  .legendColor()
  .shape('circle')
  .shapePadding(10)
  .scale(color);

// update function
const update = data => {
  // update color scale domain
  color.domain(data.map(d => d.name));

  // update and call legend
  legendGroup.call(legend);
  legendGroup.selectAll('text').attr('fill', 'white');

  // join enhanced (pie) data to path elements
  const paths = graph.selectAll('path').data(pie(data));

  // handel exit selection
  paths
    .exit()
    .transition()
    .duration(750)
    .attrTween('d', arcTweenExit)
    .remove();

  // handle the current DOM path updates
  paths
    .attr('d', arcPath)
    .transition()
    .duration(750)
    .attrTween('d', arcTweenUpdate);

  // handel enter selection
  paths
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('fill', d => color(d.data.name))
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
    // apply a function to each entery to set current path on it
    .each(function(d) {
      this._current = d;
    })
    //apply a tween animation
    .transition()
    .duration(750)
    .attrTween('d', arcTweenEnter);

  // setup event listeners
  graph
    .selectAll('path')
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('click', handleClick);
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
  // create a function that returns a range of values
  // between the ending angle nd starting angle of each wedge
  let i = d3.interpolate(d.endAngle, d.startAngle);

  // return a function that takes a ticker value t and
  // sets the startAngle using a value corresponding to the ticker value
  // and then creates a new arcPath and returns it
  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

const arcTweenExit = d => {
  let i = d3.interpolate(d.startAngle, d.endAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// use function keyword so we can use 'this' keyword inside
function arcTweenUpdate(d) {
  // interpolate between the two objects
  let i = d3.interpolate(this._current, d);

  // update the current prop with new updated data
  this._current = d;

  return function(t) {
    return arcPath(i(t));
  };
}

// event handlers
const handleMouseOver = (d, i, n) => {
  d3.select(n[i])
    .transition('changeSliceFill')
    .duration(300)
    .attr('fill', '#fff');
};

const handleMouseOut = (d, i, n) => {
  d3.select(n[i])
    .transition('changeSliceFill')
    .duration(300)
    .attr('fill', color(d.data.name));
};

const handleClick = d => {
  const id = d.data.id;
  db.collection('expenses')
    .doc(id)
    .delete();
};
