import React, {Component} from 'react';

import getRouter from './router/router';
import './app.scss';
export default class App extends Component {
    render() {
        return (
            <div>
                {getRouter()}
            </div>
        )
    }
}