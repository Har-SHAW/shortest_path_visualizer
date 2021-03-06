import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // rows: 23,
      // cols: 55,
      rows: (window.innerHeight*0.87)/25,
      cols: window.innerWidth/25,
      data: [],
      colorData: [],
      keepSou: false,
      keepDest: false,
      keepBlock: false,
      source: "0 0",
      repeat: 4,
      isMouse: false,
      disable: false,
    };
  }
  animate(data, prev, rr, cc) {
    this.setState({
      disable: true,
    });
    for (let i = 0; i <= data.length; i++) {
      if (i === data.length) {
        setTimeout(() => {
          this.animatePath(prev, rr, cc);
        }, 20 * i + 3500);
        return;
      }
      setTimeout(() => {
        const lst = data[i];
        if (
          document.getElementById(`node-${lst[0]}-${lst[1]}`).className ===
          "cell"
        )
          document.getElementById(`node-${lst[0]}-${lst[1]}`).className =
            "cell animate";
      }, 20 * i);
    }
  }

  animatePath(prev, rr, cc) {
    let src = this.state.source;
    let ans = `${rr} ${cc}`;
    let arr = [];
    while (ans !== src) {
      let f = parseInt(ans.split(" ")[0]);
      let e = parseInt(ans.split(" ")[1]);
      ans = prev[f][e];
      arr.push(`node-${f}-${e}`);
    }
    for (let i = 0; i < arr.length; i++) {
      setTimeout(() => {
        if (document.getElementById(arr[i]).className === "cell animate")
          document.getElementById(arr[i]).className = "cell spath";
      }, 50 * i);
    }
    this.setState({
      disable: false,
    });
  }

  componentDidMount() {
    let acdata = [];
    for (var i = 0; i < this.state.rows; i++) {
      let tmp = [];
      for (var j = 0; j < this.state.cols; j++) {
        tmp.push(0);
      }
      acdata.push(tmp);
    }

    let s = new Map();
    s[1] = "grey";
    s[-1] = "red";
    s[0] = "white";
    let data = [];
    acdata.forEach((lst) => {
      let tmp = [];
      lst.forEach((e) => {
        tmp.push(s[e]);
      });
      data.push(tmp);
    });
    this.setState({
      colorData: data,
      data: acdata,
    });
  }

  BFSSearch(arr) {
    var rows = this.state.rows;
    var cols = this.state.cols;
    var rep = this.state.repeat;
    var src = this.state.source;
    var animation = [];
    var prev = [];
    var x = [];
    var y = [];
    let d1 = [1, 0, -1, 0, -1, -1, +1, +1];
    let d2 = [0, 1, 0, -1, +1, -1, -1, +1];
    var visited = [];
    for (var i = 0; i < rows; i++) {
      var tmp = [];
      for (var j = 0; j < cols; j++) {
        tmp.push(0);
      }
      visited.push(tmp);
    }
    for (i = 0; i < rows; i++) {
      tmp = [];
      for (j = 0; j < cols; j++) {
        tmp.push(src);
      }
      prev.push(tmp);
    }
    x.push(parseInt(src.split(" ")[0]));
    y.push(parseInt(src.split(" ")[1]));
    var layers = 1;
    var nodes = 0;
    var found = 0;
    while (found === 0 && x.length > 0) {
      var r = x.shift();
      var c = y.shift();
      for (i = 0; i < rep; i++) {
        var rr = r + d1[i];
        var cc = c + d2[i];
        if (rr < 0 || rr >= rows) continue;
        if (cc < 0 || cc >= cols) continue;
        if (visited[rr][cc] === 1) continue;
        if (arr[rr][cc] === 1) continue;
        visited[rr][cc] = 1;
        animation.push([rr, cc]);
        x.push(rr);
        y.push(cc);
        prev[rr][cc] = `${r} ${c}`;
        nodes++;
        if (arr[rr][cc] === -1) {
          found = 1;
          console.log("found");
          this.animate(animation, prev, rr, cc);
          break;
        }
      }
      layers--;
      if (layers === 0) {
        layers = nodes;
        nodes = 0;
      }
    }
  }

  render() {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "10vh",
            justifyContent: "space-around",
            paddingTop: "1vh",
            paddingBottom: "1vh",
            borderBottom: "1px solid grey",
            alignItems: "center",
            backgroundColor: "grey"
          }}
        >
          <div
            className="butOff"
            onClick={() => {
              if (!this.state.disable) {
                for (let i = 0; i < this.state.rows; i++) {
                  for (let j = 0; j < this.state.cols; j++) {
                    if (
                      document.getElementById(`node-${i}-${j}`).className ===
                        "cell animate" ||
                      document.getElementById(`node-${i}-${j}`).className ===
                        "cell spath"
                    ) {
                      document.getElementById(`node-${i}-${j}`).className =
                        "cell";
                    }
                  }
                }

                this.BFSSearch(this.state.data);
              }
            }}
          >
            Start
          </div>
          <div
            id="keepsource"
            className="butOff"
            onClick={() => {
              this.setState({
                keepSou: true,
                keepDest: false,
                keepBlock: false,
                erase: false,
                // colorBlock: "white",
                // colorSou: "yellow",
                // colorDest: "white",
                // colorEra: "white",
              });
              if (document.getElementById("keepsource").className === "butOn") {
                document.getElementById("keepsource").className = "butOff";
              } else {
                document.getElementById("keepsource").className = "butOn";
                document.getElementById("keepdestination").className = "butOff";
                document.getElementById("keepblocks").className = "butOff";
                document.getElementById("keeperase").className = "butOff";
              }
            }}
          >
            Keep Source
          </div>
          <div
            id="keepdestination"
            className="butOff"
            onClick={() => {
              this.setState({
                keepSou: false,
                keepDest: true,
                keepBlock: false,
                erase: false,
                colorBlock: "white",
                colorSou: "white",
                colorDest: "yellow",
                colorEra: "white",
              });
              if (
                document.getElementById("keepdestination").className === "butOn"
              ) {
                document.getElementById("keepdestination").className = "butOff";
              } else {
                document.getElementById("keepdestination").className = "butOn";
                document.getElementById("keepsource").className = "butOff";
                document.getElementById("keepblocks").className = "butOff";
                document.getElementById("keeperase").className = "butOff";
              }
            }}
          >
            Keep Destiation
          </div>
          <div
            id="keepblocks"
            className="butOff"
            onClick={() => {
              this.setState({
                keepSou: false,
                keepDest: false,
                keepBlock: true,
                erase: false,
                colorBlock: "yellow",
                colorSou: "white",
                colorDest: "white",
                colorEra: "white",
              });
              if (document.getElementById("keepblocks").className === "butOn") {
                document.getElementById("keepblocks").className = "butOff";
              } else {
                document.getElementById("keepdestination").className = "butOff";
                document.getElementById("keepsource").className = "butOff";
                document.getElementById("keepblocks").className = "butOn";
                document.getElementById("keeperase").className = "butOff";
              }
            }}
          >
            Keep Blocks
          </div>
          <div
            id="enableDia"
            className="butOff"
            onClick={() => {
              if (!this.state.disable) {
                var rep = this.state.repeat;
                if (rep === 4) {
                  this.setState({
                    repeat: 8,
                    colorDia: "yellow",
                  });
                } else {
                  this.setState({
                    repeat: 4,
                    colorDia: "white",
                  });
                }
                if (
                  document.getElementById("enableDia").className === "butOn"
                ) {
                  document.getElementById("enableDia").className = "butOff";
                } else {
                  document.getElementById("enableDia").className = "butOn";
                }
              }
            }}
          >
            Enable Diagonal
          </div>
          <div
            className="butOff"
            onClick={() => {
              if (!this.state.disable) {
                let acdata = [];
                for (var i = 0; i < this.state.rows; i++) {
                  let tmp = [];
                  for (var j = 0; j < this.state.cols; j++) {
                    tmp.push(0);
                    document.getElementById(`node-${i}-${j}`).className =
                      "cell";
                  }
                  acdata.push(tmp);
                }
                this.setState({
                  data: acdata,
                  source: "0 0",
                });
              }
            }}
          >
            Reset
          </div>
          <div
            id="keeperase"
            className="butOff"
            onClick={() => {
              this.setState({
                keepSou: false,
                keepDest: false,
                keepBlock: false,
                erase: true,
                colorBlock: "white",
                colorSou: "white",
                colorDest: "white",
                colorEra: "yellow",
              });
              if (document.getElementById("keeperase").className === "butOn") {
                document.getElementById("keeperase").className = "butOff";
              } else {
                document.getElementById("keepdestination").className = "butOff";
                document.getElementById("keepsource").className = "butOff";
                document.getElementById("keepblocks").className = "butOff";
                document.getElementById("keeperase").className = "butOn";
              }
            }}
          >
            Erase
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {this.state.colorData.map((cdata, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "row" }}>
              {cdata.map((color, j) => (
                <div
                  id={`node-${i}-${j}`}
                  key={`node-${i}-${j}`}
                  onClick={() => {
                    if (!this.state.disable) {
                      console.log(`node-${i}-${j}`);
                      if (this.state.keepBlock) {
                        let lst = this.state.data;
                        lst[i][j] = 1;
                        this.setState({
                          data: lst,
                        });

                        document.getElementById(`node-${i}-${j}`).className =
                          "cell block";
                      } else if (this.state.keepDest) {
                        let lst = this.state.data;
                        lst[i][j] = -1;
                        this.setState({
                          data: lst,
                        });
                        document.getElementById(`node-${i}-${j}`).className =
                          "cell destination";
                      } else if (this.state.keepSou) {
                        document.getElementById(
                          `node-${this.state.source.split(" ")[0]}-${
                            this.state.source.split(" ")[1]
                          }`
                        ).className = "cell";
                        this.setState({
                          source: `${i} ${j}`,
                        });
                        document.getElementById(`node-${i}-${j}`).className =
                          "cell source";
                      } else if (this.state.erase) {
                        var f1 = this.state.data;
                        f1[i][j] = 0;
                        this.setState({
                          data: f1,
                        });
                        document.getElementById(`node-${i}-${j}`).className =
                          "cell";
                      }
                    }
                  }}
                  className="cell"
                  onMouseDown={() => {
                    this.setState({
                      isMouse: true,
                    });
                  }}
                  onMouseUp={() => {
                    if (!this.state.disable) {
                      let arr = this.state.data;
                      for (let i = 0; i < this.state.rows; i++) {
                        for (let j = 0; j < this.state.cols; j++) {
                          if (
                            document.getElementById(`node-${i}-${j}`)
                              .className === "cell block"
                          ) {
                            arr[i][j] = 1;
                          } else if (
                            document.getElementById(`node-${i}-${j}`)
                              .className === "cell"
                          ) {
                            arr[i][j] = 0;
                          }
                        }
                      }
                      this.setState({
                        isMouse: false,
                        data: arr,
                      });
                    }
                  }}
                  onMouseEnter={() => {
                    if (!this.state.disable) {
                      if (this.state.isMouse && this.state.keepBlock) {
                        document.getElementById(`node-${i}-${j}`).className =
                          "cell block";
                      } else if (this.state.isMouse && this.state.erase) {
                        document.getElementById(`node-${i}-${j}`).className =
                          "cell";
                      }
                    }
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
