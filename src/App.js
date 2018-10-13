import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    hits: null
  };

  onSearch = event => {
    event.preventDefault();
    const { value } = this.input;
    if (value === "") {
      return;
    }

    const cachedHits = localStorage.getItem(value);
    if (cachedHits) {
      this.setState({ hits: JSON.parse(cachedHits) });
    }

    fetch(`https://hn.algolia.com/api/v1/search?query=${value}`)
      .then(response => response.json())
      .then(result => this.onSetResult(result, value));
  };

  onSetResult = (result, key) => {
    localStorage.setItem(key, JSON.stringify(result.hits));
    this.setState({ hits: result.hits });
  };

  render() {
    return (
      <React.Fragment>
        <h1>Search Hacker News with Local Storage</h1>
        <p>
          There shouldn't be a second network request, when you search for
          something twice.
        </p>
        <form onSubmit={this.onSearch}>
          <input type="text" ref={node => (this.input = node)} />
          <button type="submit">Search</button>
        </form>
        {this.state.hits &&
          this.state.hits.map(item => (
            <div key={item.objectID}>{item.title}</div>
          ))}
      </React.Fragment>
    );
  }
}

export default App;
