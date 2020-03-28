import React from 'react';
import {
    Route,
    Switch,
    withRouter,
} from 'react-router-dom';
import authenticateUser from "./AuthenticateUser";
import Header from "../components/Header";
import App from "../App";
import LoginForm from "../components/LoginForm.js";
import Authenticate from "../components/common/Authenticate";

//classic route plus logout functionality
function CustomRoute ({path, component, doLogout}) {
    return (
        <Route
            path = {path}
            render={ (props) => {
                return (
                    <Header
                        doLogout={doLogout}
                        Component={component}
                        properties={props}
                    />
                )
            } }
        />
    )
}

class Routes extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoggedWithCookies: "?",
        }
    }

    componentDidMount() {
        this.authenticate()
    };

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (this.state.isLoggedWithCookies && )
    // }

    async authenticate() {
        let user = null;
        try {
            user = await authenticateUser();
            this.setState({isLoggedWithCookies: user});
        } catch(err) {
            console.error(err)
        }
    };

    loginSuccess = () => {
        setTimeout(()=>{this.props.history.push("/")},500);
        this.authenticate();
    };

    doLogout = () => {
        this.setState({isLoggedWithCookies: false});
    };

    render() {

        if (this.state.isLoggedWithCookies === "?") {
            return(<div style={{margin:20}} className={"inputOpacity-password"}>Authentication in progress...
                <Authenticate/>
            </div>)
        }

        return (
            <div>
                {this.state.isLoggedWithCookies === false ?
                    <LoginForm
                        loginSuccess={this.loginSuccess}
                        comingFrom={this.props.history.location.pathname}
                    />
                    :
                    <Switch>

                        <CustomRoute path={"/"}
                                     component={App}
                                     doLogout={this.doLogout}/>
                    </Switch>
                }
            </div>
        )
    }
}

export default withRouter(Routes);
