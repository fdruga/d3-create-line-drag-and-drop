const width = 960;
const height = 500;

const circles = [
  { id: 0, name: "1", x: 100, y: 100 },
  { id: 1, name: "2", x: 200, y: 200 },
  { id: 2, name: "3", x: 100, y: 200 },
  { id: 3, name: "4", x: 200, y: 100 },
];

const lines = [];

// mouse event vars
let selectedNode = null;
let selectedLink = null;
let mousedownLink = null;
let mousedownNode = null;
let mouseupNode = null;

console.log("Yes it works");

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const circlesContainer = svg.append("svg:g").attr("class", "circles-container");
const linesContainer = svg.append("svg:g").attr("class", "lines-container");

const dragLine = svg
  .append("svg:path")
  .attr("class", "link dragline hidden")
  .attr("d", "M0,0L0,0");

svg
  .select("g.circles-container")
  .selectAll("g")
  .data(circles)
  .join((enter) => {
    const circle = enter.append("circle");

    circle
      .style("transform", (d) => {
        return `translate(${d.x}px, ${d.y}px)`;
      })
      .attr("r", (d) => `20`)
      .classed("circle-new", true)
      .on("mousedown", (d) => {
        mousedownNode = d;

        // reposition drag line
        dragLine
          .classed("hidden", false)
          .attr(
            "d",
            `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`
          );
      })
      .on("mouseup", function (d) {
        mouseupNode = d;

        if (mouseupNode === mousedownNode) {
          resetMouseVars();
          return;
        }

        lines.push({
          sourceX: mousedownNode.x,
          sourceY: mousedownNode.y,
          targetX: mouseupNode.x,
          targetY: mousedownNode.y,
        });

        drawLines();
      });
  });

function drawLines() {
  svg
    .select("g.lines-container")
    .selectAll("g")
    .data(lines)
    .join((enter) => {
      const line = enter.append("path");

      console.log("APPEND NEW LINE");
      // TODO: Solve bug when connecting diagonally will conect the first two nodes

      line
        .attr("class", "link dragline")
        .attr(
          "d",
          (d) => `M${d.sourceX},${d.sourceY}L${d.targetX},${d.targetY}`
        );
    });
}

function mousemove() {
  if (!mousedownNode) return;

  console.log("update drag line");
  // update drag line
  dragLine
    .attr("class", "link dragline")
    .attr(
      "d",
      `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${
        d3.mouse(this)[1]
      }`
    );
}

function mouseup() {
  console.log("MOUSE UP");
  if (mousedownNode) {
    // hide drag line
    dragLine.classed("hidden", true).style("marker-end", "");
  }

  // because :active only works in WebKit?
  svg.classed("active", false);

  // clear mouse event vars
  resetMouseVars();
}

svg.on("mousemove", mousemove).on("mouseup", mouseup);

function resetMouseVars() {
  mousedownNode = null;
  mouseupNode = null;
  mousedownLink = null;
}
