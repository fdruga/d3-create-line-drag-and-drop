const width = 960;
const height = 500;

// mouse event vars
let selectedNode = null;
let selectedLink = null;
let mousedownLink = null;
let mousedownNode = null;
let mouseupNode = null;

function resetMouseVars() {
  mousedownNode = null;
  mouseupNode = null;
  mousedownLink = null;
}

const svg = d3
  .select("body")
  .append("svg")
  .on("contextmenu", () => {
    d3.event.preventDefault();
  })
  .attr("width", width)
  .attr("height", height);

const nodesNew = [
  { id: 0, name: "1", x: 100, y: 100 },
  { id: 1, name: "2", x: 200, y: 200 },
  { id: 2, name: "3", x: 100, y: 200 },
  { id: 3, name: "4", x: 200, y: 100 },
];

const container = svg.append("svg:g").attr("class", "container");

const dragLine = svg
  .append("svg:path")
  .attr("class", "link dragline hidden")
  .attr("d", "M0,0L0,0");

let circle = svg
  .select("g.container")
  .selectAll("g")
  .data(nodesNew)
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

        const target = mouseupNode;
      });
  });

function mousedown() {
  console.log("ON MOUSE DOWN");
}

function mousemove() {
  console.log("MOUSE MOVE");
  if (!mousedownNode) return;

  // update drag line
  dragLine.attr(
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

svg
  .on("mousedown", mousedown)
  .on("mousemove", mousemove)
  .on("mouseup", mouseup);
