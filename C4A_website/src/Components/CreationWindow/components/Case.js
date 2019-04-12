import React, { Component } from 'react';

class Case extends Component {

    constructor() {
        super();
        this.state = {
            style: null
        }
    }

    setStyle(color) {
        if(this.props.size) {
            var style = {
                backgroundColor: color,
                gridColumn: this.props.size.column + 1,
                gridRow: this.props.size.line + 1,
                zIndex: 4,
                opacity: "0.33"
            };
            this.setState({
                style: style
            })
        }
    }

    componentWillMount() {
        this.setStyle("darkgrey");
    }

    render() {
        return (
            <div style={this.state.style} className="case" onMouseOver={this.setStyle.bind(this, "black")} onMouseDown={this.setStyle.bind(this, "green")} onMouseLeave={this.setStyle.bind(this, "darkgrey")}>
            </div>
        );
    }
}

export default Case;