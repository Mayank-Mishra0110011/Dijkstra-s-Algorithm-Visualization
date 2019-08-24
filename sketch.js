let graph,
    start,
    end,
    traverse = false,
    p,
    Q = [],
    distn = [],
    prev = [],
    u,
    S = [],
    n = 30;

function setup() {
    createCanvas(windowWidth, windowHeight);
    graph = new Graph(n);
    for (let i = 0; i < graph.nodes; i++) {
        graph.addNode(i, {
            x: floor(random(50, window.innerWidth - 20)),
            y: floor(random(50, window.innerHeight - 20))
        });
    }
    connectGraphRandomly(graph);
    p = createElement(
        "p",
        "Before you press start, Click on any node to select the start node"
    );
    p.position(10, 0);
    const b = createButton("Start");
    const rst = createButton("Reset");
    const inc = createButton("Increase Number of Nodes");
    const dec = createButton("Decrease Number of Nodes");
    b.position(450, 15);
    rst.position(550, 15);
    inc.position(650, 15);
    dec.position(850, 15);
    b.mouseClicked(startTraversal);
    rst.mouseClicked(reset);
    inc.mouseClicked(increaseNodes);
    dec.mouseClicked(decreaseNodes);
}

function draw() {
    background(255);
    if (traverse) {
        if (Q.length > 0) {
            u = minDistance(Q, distn);
            for (let i = 0; i < Q.length; i++) {
                if (Q[i] == u) {
                    Q.splice(i, 1);
                }
            }
            const unode = graph.adjacencyList.get(u);
            unode.stroke = color(0, 200, 200);
            unode.neighbors.forEach(v => {
                const alt = distn[u] + cost(graph, u, v);
                if (alt < distn[v]) {
                    distn[v] = alt;
                    prev[v] = u;
                }
            });
            console.log(Q.length);
        } else {
            console.log("done");
            u = end;
            if (prev[u] || u == source) {
                while (u) {
                    S.unshift(u);
                    u = prev[u];
                }
            }
            traverse = false;
        }
    }
    graph.draw();
}

function connectGraphRandomly(graph) {
    for (let i = 0; i < graph.nodes; i++) {
        for (let j = 0; j < graph.nodes; j++) {
            if (random() < 0.1 && i != j) {
                if (
                    !graph.adjacencyList.get(j).neighbors.includes(i) &&
                    !graph.adjacencyList.get(i).neighbors.includes(j)
                ) {
                    graph.addEdge(i, j);
                }
            }
        }
    }
}

class Graph {
    constructor(nodes) {
        this.nodes = nodes;
        this.adjacencyList = new Map();
    }

    addNode(nodeName, position) {
        this.adjacencyList.set(nodeName, { position: position, neighbors: [] });
    }

    addEdge(initial, final) {
        this.adjacencyList.get(initial).neighbors.push(final);
        this.adjacencyList.get(final).neighbors.push(initial);
    }

    draw() {
        strokeWeight(5);
        for (let i = 0; i < this.nodes; i++) {
            const x = this.adjacencyList.get(i).position.x;
            const y = this.adjacencyList.get(i).position.y;
            stroke(0);
            if (this.adjacencyList.get(i).startStroke) {
                stroke(this.adjacencyList.get(i).startStroke);
            } else if (this.adjacencyList.get(i).endStroke) {
                stroke(this.adjacencyList.get(i).endStroke);
            }
            point(x, y);
        }
        strokeWeight(0.1);
        for (let i = 0; i < this.nodes; i++) {
            const x1 = this.adjacencyList.get(i).position.x;
            const y1 = this.adjacencyList.get(i).position.y;
            for (let neighbor of this.adjacencyList.get(i).neighbors) {
                const x2 = this.adjacencyList.get(neighbor).position.x;
                const y2 = this.adjacencyList.get(neighbor).position.y;
                if ((i == start || S.includes(i)) && S.includes(neighbor)) {
                    strokeWeight(0.3);
                    stroke(224, 17, 95);
                } else {
                    strokeWeight(0.1);
                    if (this.adjacencyList.get(i).stroke) {
                        stroke(this.adjacencyList.get(i).stroke);
                    } else {
                        stroke(0);
                    }
                }
                line(x1, y1, x2, y2);
            }
        }
    }
}

function cost(graph, u, v) {
    u = graph.adjacencyList.get(u);
    v = graph.adjacencyList.get(v);
    return dist(u.position.x, u.position.y, v.position.x, v.position.y);
}

function minDistance(Q, dist) {
    let min = Infinity,
        minNode;
    for (let i = 0; i < Q.length; i++) {
        if (dist[Q[i]] < min) {
            min = dist[Q[i]];
            minNode = Q[i];
        }
    }
    return minNode;
}

function mouseClicked() {
    if (!start || !end) {
        for (let i = 0; i < graph.nodes; i++) {
            let n = graph.adjacencyList.get(i);
            if (dist(n.position.x, n.position.y, mouseX, mouseY) < 5) {
                if (!start) {
                    n.startStroke = color(0, 225, 0);
                    start = i;
                    p.elt.innerText =
                        "Before you press start, Click on any node to select the end node";
                } else {
                    n.endStroke = color(0, 0, 255);
                    end = i;
                    p.elt.innerText = `We're all set! Press start to find the shortest path`;
                    for (let i = 0; i < graph.nodes; i++) {
                        distn[i] = Infinity;
                        prev[i] = null;
                    }
                    distn[start] = 0;
                    for (let i = 0; i < graph.nodes; i++) {
                        Q.push(i);
                    }
                    u = start;
                }
            }
        }
    }
}

function startTraversal() {
    if (start == undefined) {
        alert("You must Select a start node first");
    } else if (end == undefined) {
        alert("You must Select an end node first");
    } else if (!traverse) {
        traverse = true;
    }
}

function reset() {
    p.elt.innerText =
        "Before you press start, Click on any node to select the start node";
    start = undefined;
    end = undefined;
    S = [];
    Q = [];
    distn = [];
    prev = [];
    graph = new Graph(n);
    for (let i = 0; i < graph.nodes; i++) {
        graph.addNode(i, {
            x: floor(random(50, window.innerWidth - 20)),
            y: floor(random(50, window.innerHeight - 20))
        });
    }
    connectGraphRandomly(graph);
}

function increaseNodes() {
    n += 10;
    reset();
}

function decreaseNodes() {
    n -= 10;
    reset();
}
