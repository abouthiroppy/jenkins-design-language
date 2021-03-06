import React, {Component, PropTypes} from 'react';
import { action, storiesOf } from '@kadira/storybook';
import {PipelineGraph, defaultLayout} from '../components/PipelineGraph';

import { StatusIndicator } from '../components';
const pipelineStageState = StatusIndicator.validResultValues;

storiesOf('PipelineGraph', module)
    .add('Mixed', renderMultiParallelPipeline)
    .add('Fat', renderFlatPipelineFat)
    .add('Legend', renderFlatPipeline)
    .add('Constructor', renderConstructomatic)
    .add('Listeners', renderListenersPipeline)
    .add('Parallel', renderParallelPipeline)
    .add('Parallel (Deep)', renderParallelPipelineDeep);

function renderFlatPipeline() {

    const stages = [
        makeNode("Success", [], pipelineStageState.success),
        makeNode("Failure", [], pipelineStageState.failure),
        makeNode("Running", [], pipelineStageState.running),
        makeNode("Slow", [], pipelineStageState.running, 150),
        makeNode("Queued", [], pipelineStageState.queued),
        makeNode("Unstable", [], pipelineStageState.unstable),
        makeNode("Aborted", [], pipelineStageState.aborted),
        makeNode("Not Built", [], pipelineStageState.not_built),
        makeNode("Bad data", [], "this is not my office")

    ];

    // Reduce spacing just to make this graph smaller
    const layout = { nodeSpacingH: 90 };

    return <div><PipelineGraph stages={stages} layout={layout}/></div>;
}

function renderFlatPipelineFat() {

    const stages = [
        makeNode("Success", [], pipelineStageState.success),
        makeNode("Failure", [], pipelineStageState.failure),
        makeNode("Running", [
            makeNode("Job 1", [], pipelineStageState.running),
            makeNode("Job 2", [], pipelineStageState.running),
            makeNode("Job 3", [], pipelineStageState.running)
        ]),
        makeNode("Queued", [
            makeNode("Job 4", [], pipelineStageState.queued),
            makeNode("Job 5", [], pipelineStageState.queued),
            makeNode("Job 6", [], pipelineStageState.queued),
            makeNode("Job 7", [], pipelineStageState.queued),
            makeNode("Job 8", [], pipelineStageState.queued)
        ]),
        makeNode("Not Built", [], pipelineStageState.not_built),
        makeNode("Bad data", [], "this is not my office")
    ];

    const layout = {
        connectorStrokeWidth: 10,
        nodeRadius: 20,
        curveRadius: 10,
    };

    return (
        <div style={{ padding: 10 }}>
            <h1>Same data, different layout</h1>
            <h3>Normal</h3>
            <PipelineGraph stages={stages}/>
            <h3>Fat</h3>
            <PipelineGraph stages={stages} layout={layout}/>
        </div>
    );
}


function renderConstructomatic() {

    const stages = [
        makeNode("Success", [], pipelineStageState.success),
        makeNode("Failure", [], pipelineStageState.failure),
        makeNode("Running", [
            makeNode("Job 1", [], pipelineStageState.running),
            makeNode("Job 2", [], pipelineStageState.running),
            makeNode("Job 3", [], pipelineStageState.running)
        ]),
        makeNode("Queued", [
            makeNode("Job 4", [], pipelineStageState.queued),
            makeNode("This is Job number 5", [], pipelineStageState.queued),
            makeNode("Job 6", [], pipelineStageState.queued),
            makeNode("Job 7", [], pipelineStageState.queued),
            makeNode("Job 8", [], pipelineStageState.queued)
        ]),
        makeNode("Not Built", [], pipelineStageState.not_built),
        makeNode("Bad data", [], "this is not my office")
    ];

    return <PipelineGraphConstructionKit stages={stages}/>;
}

function renderListenersPipeline() {

    const stages = [
        makeNode("Build", [], pipelineStageState.success),
        makeNode("Test", [], pipelineStageState.success),
        makeNode("Browser Tests", [
            makeNode("Internet Explorer", [], pipelineStageState.queued),
            makeNode("Chrome", [], pipelineStageState.queued)
        ]),
        makeNode("Dev"),
        makeNode("Staging"),
        makeNode("Production")
    ];

    return <div><PipelineGraph stages={stages} onNodeClick={nodeName => action('Clicked', nodeName)}/></div>;
}
function renderParallelPipeline() {

    const stages = [
        makeNode("Build"),
        makeNode("Test"),
        makeNode("Browser Tests", [
            makeNode("Internet Explorer"),
            makeNode("Chrome")
        ]),
        makeNode("Dev but with long label"),
        makeNode("Staging"),
        makeNode("Production")
    ];

    return (
        <div>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
                consequatur corporis dolores, dolorum eius explicabo hic impedit
                laborum magni non qui quibusdam sapiente sed sit velit veritatis vero.
                Error, quibusdam!
            </p>
            <PipelineGraph stages={stages}/>
        </div>
    );
}

function renderMultiParallelPipeline() {

    const stages = [
        makeNode("Build", [], pipelineStageState.success),
        makeNode("Test", [
            makeNode("JUnit", [], pipelineStageState.success),
            makeNode("DBUnit", [], pipelineStageState.success),
            makeNode("Jasmine", [], pipelineStageState.success)
        ]),
        makeNode("Browser Tests", [
            makeNode("Firefox", [], pipelineStageState.success),
            makeNode("Edge", [], pipelineStageState.failure),
            makeNode("Safari", [], pipelineStageState.running, 60),
            makeNode("Chrome", [], pipelineStageState.running, 120)
        ]),
        makeNode("Dev"),
        makeNode("Staging"),
        makeNode("Production")
    ];

    return <div><PipelineGraph stages={stages}/></div>;
}

function renderParallelPipelineDeep() {

    const stages = [
        makeNode("Build", [], pipelineStageState.success),
        makeNode("Test", [], pipelineStageState.success),
        makeNode("Browser Tests", [
            makeNode("Internet Explorer", [], pipelineStageState.success),
            makeNode("Firefox", [], pipelineStageState.running),
            makeNode("Edge", [], pipelineStageState.failure),
            makeNode("Safari", [], pipelineStageState.running),
            makeNode("LOLpera", [], pipelineStageState.queued),
            makeNode("Chrome", [], pipelineStageState.queued)
        ]),
        makeNode("Dev", [], pipelineStageState.not_built),
        makeNode("Staging", [], pipelineStageState.not_built),
        makeNode("Production", [], pipelineStageState.not_built)
    ];

    return <div><PipelineGraph stages={stages}/></div>;
}

let __id = 1;

/// Simple helper for data generation
function makeNode(name, children = [], state = pipelineStageState.not_built, completePercent) {
    completePercent = completePercent || ((state == pipelineStageState.running) ? Math.floor(Math.random() * 60 + 20) : 50);
    const id = __id++;
    return {name, children, state, completePercent, id};
}

/// Wrap a PipelineGraph with some controls to tweak the layout properties
class PipelineGraphConstructionKit extends Component {
    constructor(props) {
        super(props);
        this.state = {layout: defaultLayout};
    }

    control(label, property, min, max) {
        const value = this.state.layout[property];

        const changed = (e) => {
            const value = e.target.value;

            const layout = Object.assign({}, this.state.layout);
            layout[property] = parseInt(value);

            this.setState({layout});
        };

        return (
            <tr>
                <td>{label}</td>
                <td><input type="range" min={min} max={max} defaultValue={value} onChange={changed}/></td>
                <td>{value}</td>
            </tr>
        );
    }

    render() {

        const wrapperStyle = {
            margin: "5px",
            padding: "10px",
            border: "dashed 1px #ccc",
            borderRadius: "10px"
        };

        const tableStyle = {
            width: "auto",
            borderSpacing: "5px",
            borderCollapse: "separate"
        };

        const controlDivStyle = {
            display: "flex",
            justifyContent: "center"
        };

        return (
            <div style={wrapperStyle}>
                <h1>PipelineGraph Construct-o-matic&trade;</h1>
                <div style={controlDivStyle}>
                    <table style={tableStyle}>
                        <tbody>
                        {this.control("Line Thickness", "connectorStrokeWidth", 1, 20)}
                        {this.control("Curve Radius", "curveRadius", 0, 50)}
                        {this.control("H Spacing", "nodeSpacingH", 10, 200)}
                        {this.control("V Spacing", "nodeSpacingV", 10, 200)}
                        </tbody>
                    </table>
                    <table style={tableStyle}>
                        <tbody>
                        {this.control("Node radius", "nodeRadius", 5, 40)}
                        {this.control("Big Label offset", "labelOffsetV", 0, 100)}
                        {this.control("Small Label offset", "smallLabelOffsetV", 0, 100)}
                        </tbody>
                    </table>
                </div>
                <PipelineGraph stages={this.props.stages}
                               layout={this.state.layout}
                               onNodeClick={this.props.onNodeClick}/>
            </div>
        );
    }
}

PipelineGraphConstructionKit.propTypes = {
    stages: PropTypes.array,
    onNodeClick: PropTypes.func
};
