import React, { Component } from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/snippets/javascript';

import 'brace/theme/monokai';

import "brace/ext/language_tools";
import "brace/ext/searchbox";

import styles from './style.css';
import { Grid, Block, Npc, Pc, Label } from './CodeClasses';
import CustomSlider from './CustomSlider';

class Code extends Component {

  constructor() {
    super();
    this.state = {
      timeout: null,
      nonEditableLines: [],
      editorValue: "",
      infoText: "",
      fromProps: false,
      fromEdit: false,
      fontSize: 14
    }
  }

  changeSizeValue(newSize) {
    this.setState({fontSize: newSize});
  }

  displayGrid(props) {
    var str = this.state.editorValue;
    var regex = /var\s+grid\s+=\s+createGrid\(.*\);{0,1}/g;
    var matching = str.match(regex);
    if(matching != null) {
      var splitted = matching[0].split("(");
      var newStr = "" + splitted[0] + "(" + props.grid.lines + ", " + props.grid.columns + ", " + (props.grid.backgroundId) + ");";
      newStr = this.state.editorValue.replace(matching, newStr);
    }
    else {
      newStr = "var grid = createGrid(" + props.grid.lines + ", " + props.grid.columns + ", " + (props.grid.backgroundId) + ");\n" 
        + this.state.editorValue;
    }

    return newStr;
  }

  getNameForANewElement(newStr, type) {
    for(var i = 0; i < 10000000; i++) {
      var lowered = type.toLowerCase();
      if(newStr.match("\\s" + lowered + i)) {
        continue;
      }
      else {
        return lowered + i;
      }
    }
  }

  getRealBuiltStringForElement(nameElement, element, type) {
    return ("var " + nameElement + " = create" + type + "(" 
    + element.id + ", " 
    + element.rowStart + ", " 
    + element.columnStart + ", " 
    + element.width + ", " 
    + element.height + ", " 
    + (type != "Label" ? element.backgroundId : "'" + element.text + "'") 
    + ");");
  }

  displayElement(element, newStr, type) {
    var nameElement = "";
    var regexCreation = new RegExp("var\\s+.+\\s+=\\s+create" + type + "\\(\\s*" + element.id + "\\s*,\\s*.*\\s*\\);{0,1}", "g");;
    var creationMatching = newStr.match(regexCreation);

    // creation treatment
    if(creationMatching != null) {
      nameElement =  creationMatching[0].split(/\s+|=/)[1];
      var realBuiltStr = this.getRealBuiltStringForElement(nameElement, element, type);
      newStr = newStr.replace(creationMatching[0], realBuiltStr);
    }
    else {
      nameElement = this.getNameForANewElement(newStr, type)
      realBuiltStr = this.getRealBuiltStringForElement(nameElement, element, type);
      newStr = newStr + "\n" + realBuiltStr;
    }

    var regexAdding = new RegExp("grid.add" + type + "\\(\\s*" + nameElement + "\\s*\\);{0,1}", "g");
    var addingMatching = newStr.match(regexAdding);

    // adding treatment
    if(addingMatching != null) {
      return newStr;
    }
    else {
      creationMatching = newStr.match(regexCreation)[0];
      return newStr.replace(creationMatching, creationMatching + ("\ngrid.add" + type + "(" + nameElement + ");\n"));
    }
  }

  displayElements(props, newStr) {

    for (var key in props.blocks) {
      newStr = this.displayElement(props.blocks[key], newStr, "Block");
    }
    for (var key in props.npcs) {
      newStr = this.displayElement(props.npcs[key], newStr, "Npc");
    }
    for (var key in props.pcs) {
      newStr = this.displayElement(props.pcs[key], newStr, "Pc");
    }
    for (var key in props.labels) {
      newStr = this.displayElement(props.labels[key], newStr, "Label");
    }
    return newStr;
  }

  componentWillReceiveProps(props){
    if(this.state.fromEdit === true || this.state.editorValue === undefined) {
      return;
    }

    this.setState({fromProps: true});
    
    var newStr = this.displayGrid(props);
    newStr = this.displayElements(props, newStr);

    this.setState(
      {
        fromProps: false,
        editorValue: newStr
      }
    );
  }

  getBackground(patternId) {
    try {
      return process.env.PUBLIC_URL + 'patterns/' + this.props.patterns[patternId - 1].nom;
    }
    catch(error) {
      return null;
    }
  }

  createGrid(lines, columns, patternId) {
    if(lines > 50 || columns > 50) {
      throw new Error("Max 50 for lines and columns.");
    }

    var background = this.getBackground(patternId);

    let parameters = {
      type: "GRID",
      lines: lines,
      columns: columns,
      background: background,
      backgroundId: patternId
    }

    this.props.changeGridParameters(parameters);

    return new Grid(lines, columns, patternId);
  }

  createBlock(id, row, column, width, height, patternId) {
    return new Block(id, row, column, width, height, patternId);
  }

  createNpc(id, row, column, width, height, patternId) {
    return new Npc(id, row, column, width, height, patternId);
  }

  createPc(id, row, column, width, height, patternId) {
    return new Pc(id, row, column, width, height, patternId);
  }

  createLabel(id, row, column, width, height, text) {
    return new Label(id, row, column, width, height, text);
  }

  getDisplayCode() {
    return `
      var blocks = grid.getBlocks();
      this.props.modifyBlocks(blocks);

    `;
  }

  evalCode() {
    var createGrid = (lines, columns, backgroundId) => this.createGrid(lines, columns, backgroundId);
    var createBlock = (id, row, column, width, height, patternId) => this.createBlock(id, row, column, width, height, patternId);
    var createNpc = (id, row, column, width, height, patternId) => this.createNpc(id, row, column, width, height, patternId);
    var createPc = (id, row, column, width, height, patternId) => this.createPc(id, row, column, width, height, patternId);
    var createLabel = (id, row, column, width, height, text) => this.createLabel(id, row, column, width, height, text);
    // ici les vérification

    try {
      eval(this.state.editorValue + "\ngrid;" + this.getDisplayCode());
      this.setState({infoText: ""});
    }
    catch(error) {
      this.setState({infoText: error.message});
    }
  }

  onChange(newValue, e) {
    if(this.state.fromProps === true) {
      return;
    }
    this.setState({editorValue: newValue});
    clearTimeout(this.state.timeout);
    this.setState({timeout: setTimeout(() => {
      this.setState(
        { 
          fromEdit: true,
        }
      );
  
      this.props.changeParametersWindow({
        type: "NONE"
      });
      
      this.evalCode();
      this.setState({ fromEdit: false });
    }, 1000)})
    if(this.state.fromProps === true) {
      return;
    }
  }

  render() {
    return (
        <div className={styles.code}>
            <h3 className="title">Ici le code</h3>
            <div className="content">
              <AceEditor
              mode="javascript"
              theme="monokai"
              name="code-editor"
              onChange={this.onChange.bind(this)}
              fontSize={this.state.fontSize}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={this.state.editorValue}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                tabSize: 2,
              }}/>
              <div id="info-text">{this.state.infoText}</div>
            </div>
            <CustomSlider className="custom-slider-code" changeSize={this.changeSizeValue.bind(this)} min={5} max={100} default={14}/>
        </div>
    );
  }
}

export default Code;
