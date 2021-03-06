// // function used for updating x-scale const upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
      d3.max(data, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating y-scale const upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) - 1,
      d3.max(data, d => d[chosenYAxis]) + 1
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis const upon click on axis label
function renderXAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis const upon click on axis label
function renderYAxes(newYScale, yAxis) {
  let leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// functions used for updating circles group with a transition to
// new circles for both X and Y coordinates
function renderXCircles(chartGroup, newXScale, chosenXaxis) {

  chartGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return chartGroup;
}

function renderYCircles(chartGroup, newYScale, chosenYaxis) {

  chartGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return chartGroup;
}

// functions used for updating circles text with a transition on
// new circles for both X and Y coordinates
function renderXText(chartGroup, newXScale, chosenXaxis) {

  chartGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return chartGroup;
}

function renderYText(chartGroup, newYScale, chosenYaxis) {

  chartGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis])+5);

  return chartGroup;
}

// format number to USD currency
let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// function used for updating circles group with new tooltip
function updatetoolTip(chartGroup, chosenXAxis, chosenYAxis) {

  let xpercentsign = "";
  let xlabel = "";
  if (chosenXAxis === "poverty") {
    xlabel = "Poverty";
    xpercentsign = "%";
  } else if (chosenXAxis === "age"){
    xlabel = "Age";
  } else {
    xlabel = "Income";
  }

  let ypercentsign = "";
  let ylabel = "";
  if (chosenYAxis === "healthcare") {
    ylabel = "Healthcare";
    ypercentsign = "%";
  } else if (chosenYAxis === "smokes"){
    ylabel = "Smokes";
    ypercentsign = "%";
  } else {
    ylabel = "Obesity";
    ypercentsign = "%";
  }

  const toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, -75])
    .html(function(d) {
      if (chosenXAxis === "income"){
        let incomelevel = formatter.format(d[chosenXAxis]);

        return (`${d.state}<br>${xlabel}: ${incomelevel.substring(0, incomelevel.length-3)}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`)
      } else {
        return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`)
      };
    });

  chartGroup.call(toolTip);

  // mouseover event
  chartGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
      // trying to highlight chosen circle
      chartGroup.append("circle")
        .attr("cx", d3.event.pageX)
        .attr("cy", d3.event.pageY)
        .attr("r", 15)
        .attr("stroke", "black")
        .attr("fill", "none");
  })
    // onmouseout event
    .on("mouseout", function(data) {
        toolTip.hide(data, this);
    });

return chartGroup;
}