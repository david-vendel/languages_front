import React, {Component} from 'react';
import axios from 'axios';
import {Table, Grid, Box} from "./styled-components/AllStyledComponents";


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            keys: [],
            values: [],
            choice: 0,
            backs:['','','',''],
            correct: 0,
            incorrect: 0,
        }
    }

    componentDidMount() {
        this.refresh()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    // console.log("this.props", this.props)
    //     if (this.props.id !== prevProps.id) {
    //         setTimeout(() => {this.refresh()}, 100)
    //     }
    }

    refresh = async () => {
        console.log("refresh",);
        // const URL = `http://localhost:8000/get-all`;
        let randoms = "";
        [0,1,2,3].forEach(a => {
            randoms = randoms + Math.floor(Math.random() * 1000) + ","
        });
        randoms = randoms.slice(0,-1);

        const URL = `http://localhost:8000/get/${randoms}`;

        const response = await axios.get(URL, {});

        let data = response.data;
        console.log("all data",data, typeof data);

        let keys = [];
        let values = [];

        data.forEach(d => {
            keys.push(d.split(" ")[0]);
            let helpera = d.split(" ");
            helpera.shift();
            values.push(helpera.join(" "))
        });

        console.log("keys", keys);
        console.log("keys", values);

        const choice = Math.floor(Math.random() * keys.length);
        let backs = ['','','',''];

        this.setState({
            data,
            keys,
            values,
            choice,
            backs,
        })
    };

    clickedWord = (e,i) => {
        let backs = ['','','',''];
        console.log("clicked ",i, typeof  i);
        if (i === this.state.choice) {
            backs[i] = 'green';
            console.log("backs",backs)
            this.setState({
                backs,
                correct: this.state.correct + 1
            })
        } else {
            backs[i] = 'red';
            this.setState({
                backs,
                incorrect: this.state.incorrect + 1
        })
        }

        setTimeout(() => {this.refresh()} ,500)
    };

    render() {
        console.log("this.state.data",this.state.data);
        console.log("this.state.backs",this.state.backs);

        return (
            <div style={{paddingTop:15, paddingBottom:10, maxWidth:600, margin:"0 auto"}}>
                <div style={{margin: 10, padding: 10}}>{this.state.correct}  /  {this.state.incorrect} </div>
                {/*<button style={{marginBottom:10}} onClick={this.refresh}>Refresh</button>*/}
                <div style={{fontSize: "200%", marginBottom: 20}}>{this.state.keys[ this.state.choice ]}</div>
                <Grid >




                {this.state.values.map ((d,i) => {

                return (
                        <Box key={i}
                            style={{paddingLeft:10, backgroundColor: this.state.backs[i]}} onClick = { (e) => {this.clickedWord(e,i)} }>
                            {d}
                        </Box>
                )
                })}
                </Grid>


            </div>
        )
    }
}