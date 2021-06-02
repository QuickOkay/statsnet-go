console.log(d3)
const loadImage = async (path) =>
    new Promise((resolve, reject) => {
        const tex = new Image();
        tex.addEventListener('load', async () => {
            resolve(tex);
        });
        tex.addEventListener('error', (e) => {
            console.log(`Failed to load image '${path}'`, e);
            reject(e);
        });
        tex.src = path;
    });
const radius = 30;
let simulation,
    nodes,
    links,
    count,
    root,
    img,
    whiteImg,
    currentNode,
    clickedNode,
    loadingData = false;
const parent = d3.select('#graph');
const graphCanvas = parent
    .append('canvas')
    .attr('width', parent.node().clientWidth - 12)
    .attr('height', parent.node().clientHeight)
    .node();

const pointerPos = { x: -1e12, y: -1e12 };
const tooltip = parent.append('div').attr('class', 'svg-tooltip').node();
const results = d3.select('#results').style('display', 'none'),
    resultsWrapper = results.append('div').attr('class', 'shadow p-3 mb-5 bg-white rounded results_wrapper flex-row');
const graphWidth = graphCanvas.clientWidth,
    graphHeight = graphCanvas.clientHeight;
const context = graphCanvas.getContext('2d');
let transform = d3.zoomIdentity;
const initSimulation = (nodes, links, count) =>
    d3
        .forceSimulation(nodes)
        .force(
            'link',
            d3
                .forceLink(links)
                .id((d) => d.id)
                .distance(count < 7 ? 100 : count < 15 ? 150 : 250)
        )
        .force('charge', d3.forceManyBody().strength(-500))
        .force('colide', d3.forceCollide().radius(count < 7 ? radius * 3 : radius * 2))
        .force('x', d3.forceX(graphCanvas.parentNode.clientWidth / 2))
        .force('y', d3.forceY(graphCanvas.parentNode.clientHeight / 2))
        .alphaTarget(0)
        .alphaDecay(0.05)
        .on('tick', simulationUpdate);
const zoomed = (ev) => {
    transform = ev.transform;
    simulationUpdate();
};
const getOffset = (el) => {
    const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};
function dragsubject(ev) {
    var i,
        x = transform.invertX(ev.x),
        y = transform.invertY(ev.y),
        dx,
        dy;
    for (i = nodes.length - 1; i >= 0; --i) {
        let node = nodes[i];
        dx = x - node.x;
        dy = y - node.y;

        if (dx * dx + dy * dy < radius * radius) {
            node.x = transform.applyX(node.x);
            node.y = transform.applyY(node.y);

            return node;
        }
    }
}
const dragStarted = (ev, d) => {
    if (!ev.active) {
        simulation.alphaTarget(0.3).restart();
    }
    ev.subject.fx = transform.invertX(ev.x);
    ev.subject.fy = transform.invertY(ev.y);
};
const dragged = (ev, d) => {
    ev.subject.fx = transform.invertX(ev.x);
    ev.subject.fy = transform.invertY(ev.y);
};

const dragEnded = (ev, d) => {
    if (!ev.active) simulation.alphaTarget(0);
};

function drawLink(d) {
    let start = d.source;
    let end = d.target;
    let relLink = { x: end.x - start.x, y: end.y - start.y };
    if (typeof start !== 'object' || typeof end !== 'object') return;
    let textPos = Object.assign(
        ...['x', 'y'].map((c) => ({
            [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
        }))
    );

    //calculate length of line
    const length = Math.sqrt(Math.pow(parseInt(relLink.y), 2) + Math.pow(parseInt(relLink.x), 2));
    const scale = (length - radius) / length;
    const offsetX = end.x - start.x - (end.x - start.x) * scale; //calc offset for circle
    const offsetY = end.y - start.y - (end.y - start.y) * scale;

    let textAngle = Math.atan2(relLink.y, relLink.x);
    let label = d.target.data.connection_type === 'officer' ? 'Руководитель' : 'Компания';
    if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
    if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);
    //get width of text
    let textWidth = context.measureText(label).width;
    //set dimension for text bg
    const bckgDimensions = [textWidth, 16].map((n) => n + 16 * 0.8);

    context.strokeStyle = '#978fb9';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(start.x + offsetX, start.y + offsetY);
    context.lineTo(end.x - offsetX, end.y - offsetY);
    context.stroke();

    context.translate(textPos.x, textPos.y);
    context.rotate(textAngle);
    context.fillStyle = 'rgba(255, 255, 255)';
    context.fillRect(-bckgDimensions[0] / 2, -bckgDimensions[1] / 2, ...bckgDimensions);

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'darkgrey';
    context.font = '16px';
    context.fillText(label, 0, 0);
}

async function drawNode(d) {
    context.fillStyle = 'white';
    context.beginPath();

    context.arc(d.x, d.y, radius, 0, 2 * Math.PI, false);
    context.fill();
    context.drawImage(d.data.entity_type === 'company' ? img[0] : img[1], 0, 0, 24, 24, d.x - 12, d.y - 12, 24, 24);
    context.fillStyle = 'black';
    context.font = '16px';
    context.fillText(d.data.name.length > 15 ? d.data.name.substring(0, 15) + '...' : d.data.name, d.x - 60, d.y + 40);
    if (currentNode === d) {
        context.beginPath();
        context.arc(currentNode.x, currentNode.y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = currentNode.data.entity_type === 'company' ? '#7f76A9' : '#25af9b';
        context.fill();
        context.drawImage(
            currentNode.data.entity_type === 'company' ? whiteImg[0] : whiteImg[1],
            0,
            0,
            24,
            24,
            d.x - 12,
            d.y - 12,
            24,
            24
        );
        context.fillStyle = 'black';
        context.font = '16px';
        context.fillText(
            currentNode.data.name.length > 15 ? currentNode.data.name.substring(0, 15) + '...' : currentNode.data.name,
            d.x - 60,
            d.y + 40
        );
    }
}

const simulationUpdate = () => {
    context.clearRect(0, 0, graphWidth, graphHeight);
    context.save();
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
    nodes.forEach(drawNode);
    links.forEach(drawLink);
    context.restore();
};
const solve = (obj, parent) => {
    return [
        { ...obj, parent: parent },
        ...(obj.children || []).map((el) => solve(el, obj.name)),
    ];
};
const initChart = async (level) => {
    let body = {"jurisdiction":"KZ","identifier":"151040025245","company_id":24401779,"from":0,"size":5,"company_name":"Шсл","query":"Шсл","level":3};
    img = await Promise.all([loadImage('/img/company.svg'), loadImage('/img/person.svg')]);
    whiteImg = await Promise.all([loadImage('/img/white_company.svg'), loadImage('/img/white_person.svg')]);
    loadingData = true;
    const resp = await fetch('/api/global/connections', {
        method: 'POST',
        headers: {
            'X-TOKEN': 'drRN54UheELrwsNr2KjyAjBQKaU34RBc',
            'Content-Type': 'application/json',
            Accept: '*/*'
        },
        body: JSON.stringify(body)
    });
    const json = await resp.json();
    if (json.error) {
        loadingData = false;
        return {
            errorMessage: 'Произшла ошибка',
            errorForDeveloper: json.error,
            end: false
        };
    } else {
        loadingData = false;
        const { data } = json;
        // data.splice(0,1);
        const hierarchyData = {name:'root', children:[]},
            levels=["parent_id"];

        data.forEach(d=>{
            let depthCursor = hierarchyData.children;
            levels.forEach((prop, depth)=>{
                let idx;
                depthCursor.forEach((child,i)=>{
                    if(d[prop]===child.parent_id) idx = i;

                })
                if ( isNaN(idx) ) {
                    depthCursor.push({ name : d[prop], children : []});
                    idx = depthCursor.length - 1;
                }

                depthCursor = depthCursor[idx].children;
                // This is a leaf, so add the last element to the specified branch
                if ( depth === levels.length - 1 ) depthCursor.push({ parent_id : d.parent_id });
            })
        })

        console.log(hierarchyData);
        const childrenAccessorFn = (el) => {
            // console.log(el);
                return             Array.isArray(el) && el.map(e=>e && Array.from(e))
            // return el.value && Array.from(el.value);
        };
        const arrayForRender = data.filter((el) => el.id !== el.parent_id);
        const rollupData = d3.rollup(arrayForRender, (d) => ({ ...d }), d=> d.parent_id);
        const hierchData = d3.hierarchy([null,rollupData], childrenAccessorFn);
        console.log(rollupData, hierchData)
        // hierchData.splice(0,1)
        hierchData.data.splice(0,1);
        // root = d3.hierarchy(arrayForRender);
        count = hierchData.copy().count().value;

        nodes = hierchData.descendants();
        links = hierchData.links();
        console.log(nodes, links);
        // simulation = initSimulation(nodes, links, count);
        //
        // d3.select(graphCanvas)
        //     .call(
        //         d3
        //             .drag()
        //             .subject(dragsubject)
        //             .on('start', (ev, d) => dragStarted(ev, d))
        //             .on('drag', (ev, d) => dragged(ev, d))
        //             .on('end', (ev, d) => dragEnded(ev, d))
        //     )
        //     .call(
        //         d3
        //             .zoom()
        //             .scaleExtent([1 / 10, 8])
        //             .on('zoom', zoomed)
        //     )
        //     .on('mousemove', (ev) => {
        //         let p = d3.pointer(ev);
        //
        //         let zp = transform.invert(p);
        //
        //         const offset = getOffset(parent.node());
        //         tooltip.innerHTML = '';
        //         currentNode = null;
        //         nodes.forEach((d) => {
        //             if (zp[0] + radius >= d.x && zp[0] - radius <= d.x && zp[1] + radius > d.y && zp[1] - radius <= d.y) {
        //                 currentNode = d;
        //                 // console.log(d);
        //                 pointerPos.x = ev.pageX - offset.left;
        //                 pointerPos.y = ev.pageY - offset.top;
        //                 tooltip.style.top = `${pointerPos.y}px`;
        //                 tooltip.style.left = `${pointerPos.x}px`;
        //
        //                 tooltip.innerHTML = `<p>${d.data.name}</p>`;
        //             }
        //             simulationUpdate();
        //         });
        //     })
        //     .on('click', (ev) => {
        //         let p = d3.pointer(ev);
        //
        //         let zp = transform.invert(p);
        //
        //         clickedNode = {};
        //         nodes.forEach((d) => {
        //             if (zp[0] + radius >= d.x && zp[0] - radius <= d.x && zp[1] + radius > d.y && zp[1] - radius <= d.y) {
        //                 clickedNode = d;
        //             }
        //         });
        //         if (
        //             zp[0] + radius >= clickedNode.x &&
        //             zp[0] - radius <= clickedNode.x &&
        //             zp[1] + radius > clickedNode.y &&
        //             zp[1] - radius <= clickedNode.y
        //         ) {
        //             console.log('click on node');
        //             resultsWrapper.html('');
        //             results.style('display', 'block');
        //             resultsWrapper
        //                 .append('div')
        //                 .attr('class', () => (clickedNode.data.entity_type === 'company' ? 'img company' : 'img person'))
        //                 .html(() => {
        //                     return clickedNode.data.entity_type === 'company'
        //                         ? `<img src="${whiteImg[0].src}"/>`
        //                         : `<img src="${whiteImg[1].src}"/>`;
        //                 });
        //
        //             resultsWrapper
        //                 .append('div')
        //                 .attr('class', 'name_wrapper ml-4 ')
        //                 .append('a')
        //                 .attr('class', 'h7 name')
        //                 .attr(
        //                     'href',
        //                     () => `//dev.statsnet.co/companies/${clickedNode.data.jurisdiction.toLowerCase()}/${clickedNode.data.id}`
        //                 )
        //                 .attr('target', '_blank')
        //                 .html(() => {
        //                     return clickedNode.data.name;
        //                 });
        //
        //             resultsWrapper
        //                 .append('div')
        //                 .attr('class', 'country_wrapper mt-2 col-6')
        //                 .append('p')
        //                 .attr('class', 'text-left-center')
        //                 .html(() =>`<span class="font-weight-bold">Страна: </span>${clickedNode.data.jurisdiction === 'KZ' ? 'Казахстан' : clickedNode.data.jurisdiction}`);
        //
        //             resultsWrapper
        //                 .append('div')
        //                 .attr('class', 'count_wrapper mt-2 col-6')
        //                 .append('p')
        //                 .attr('class', 'text-left-center')
        //                 .html(() => `<span class="font-weight-bold">Связей: </span> ${clickedNode.copy().count().value}`);
        //         } else {
        //             results.style('display', 'none');
        //             resultsWrapper.html('');
        //         }
        //     });

        return {
            errorMessage: null,
            errorForDeveloper: null,
            end: true
        };
    }
};
initChart(1);
document.querySelector('#inputForm #radio1').checked = true;

document.querySelector('#inputForm').addEventListener('change', async (e) => {
    e.preventDefault();
    const level = e.target.value;

    while (loadingData) {
        document.querySelectorAll('#inputForm>input').forEach((inp) => {
            inp.disabled = true;
        });
    }

    initChart(parseInt(level));
});

