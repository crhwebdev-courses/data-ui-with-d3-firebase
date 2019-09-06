//select html element where d3 will do its magic
const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600);

// create margins and dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

//create graph group and center
const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left},${margin.top})`);

//create groups for x and y
const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

//get data from firestore database
db.collection('dishes')
  .get()
  .then(res => {
    const data = res.docs.map(doc => doc.data());

    //return mininum value for orders from dataset
    // const min = d3.min(data, d => d.orders);

    //return maxinum value for orders from dataset
    const max = d3.max(data, d => d.orders);

    //return an array with a mininum and maximum value
    // const extent = d3.extent(data, d => d.orders);

    //create scale for y value -
    //this will scale the values in the domain (data set values of 0 to 1000)
    //to fit the range 0 to 50
    const y = d3
      .scaleLinear()
      .domain([0, max])
      .range([graphHeight, 0]);

    //create a band scale for x value -
    // this will scale the values based on the number of items in the
    // dataset
    const x = d3
      .scaleBand()
      .domain(data.map(item => item.name))
      .range([0, graphWidth])
      .paddingInner(0.2)
      .paddingOuter(0.2);

    // join the data to rects
    const rects = graph.selectAll('rect').data(data);

    rects
      .attr('width', x.bandwidth)
      .attr('height', d => graphHeight - y(d.orders))
      .attr('fill', 'orange')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.orders));

    // append the enter selection to the DOM
    rects
      .enter()
      .append('rect')
      .attr('width', x.bandwidth)
      .attr('height', d => graphHeight - y(d.orders))
      .attr('fill', 'orange')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.orders));

    // create and call the axes using d3 functions
    const xAxis = d3.axisBottom(x);
    const yAxis = d3
      .axisLeft(y)
      .ticks(3)
      .tickFormat(d => `${d} orders`);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .attr('text-anchor', 'end')
      .attr('fill', 'orange');
  });
