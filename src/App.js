import React, { Component } from 'react'
import fetch from './fetch'
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import './App.css'
import API_TOKEN from './config';

const initialState = {
    url: null,
    options: null,
    data: null,
    error: null,
    loading: false,
}

class App extends Component {

    constructor(props) {
        super(props)
        this.state = initialState;
        console.log(API_TOKEN);
    }


    performFetchGET = (url) =>
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + API_TOKEN,
            },
        });

    performFetchPOST = (url) =>
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: 'Bearer ' + API_TOKEN,
            },
            body: JSON.stringify(
                {
                    user_id: 2,
                    title: 'via Fetchful',
                    public: true,
                    tempo: 80,
                    sequence_length: 16,
                    step_sequence: [
                        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0],
                    ],
                    mp3: ''
                }

            )
        });


    handleClickFetch = (e) => {

        const server = 'http://localhost:8000';
        // adjust endpoint 
        // const endpoint = '/api/compositions/1'; // GET
        const endpoint = '/api/compositions'; // POST

        const url = server + endpoint;
        // this.performFetchGET(url)
        this.performFetchPOST(url)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    return res.json().then(err => Promise.reject(err))
                }
            })
            .then(data => this.setState({ data, loading: false }))
            .catch(error => this.setState({ error, loading: false }))
    }

    componentDidMount() {
        fetch.subscribe(
            ({ url, options }) => this.setState({ url, options, loading: true })
        )
    }

    componentDidUpdate() {
        setImmediate(() => Prism.highlightAll())
    }

    render() {
        return (
            <div className='App'>
                <h1>Fetchful</h1>
                <section className='Buttons'>
                    <button
                        className='success'
                        onClick={this.handleClickFetch}>
                        fetch
          </button>
                    {' '}
                    <button
                        className='warning'
                        onClick={() => this.setState(initialState)}>
                        clear
          </button>
                </section>
                <section className='card Request'>
                    <header>
                        <h3>Request Options</h3>
                        <p>
                            <strong className='url-label'>URL:</strong>
                            {' '}
                            <span className='url'>
                                {this.state.url}
                            </span>
                        </p>
                    </header>
                    <pre><code className='language-json'>
                        {JSON.stringify(this.state.options, null, 2)}
                    </code></pre>
                    {this.state.loading ? <h4>Request loading....</h4> : null}
                </section>
                <section className='card Error'>
                    <header>
                        <h3>Error</h3>
                    </header>
                    <pre><code className='language-json'>
                        {JSON.stringify(this.state.error, null, 2)}
                    </code></pre>
                </section>
                <section className='card Response'>
                    <header>
                        <h3>Response</h3>
                        <p>
                            <strong className='url-label'>Length:</strong>
                            {' '}
                            <span className='url'>
                                {this.state.data ? this.state.data.length : null}
                            </span>
                        </p>
                    </header>
                    <pre><code className='language-json'>
                        {JSON.stringify(this.state.data, null, 2)}
                    </code></pre>
                </section>
            </div>
        )
    }
}

export default App
