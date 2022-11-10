import React from 'react';
import Form from './Form';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { resultJson: '' };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.defaultValue = `{
          "blocks": [
           {
            "key": "1kdsb",
            "text": "Default text from App component",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
           },
           {
            "key": "2ipln",
            "text": "",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
           },
           {
            "key": "2glph",
            "text": "Formetted and with emojis 👍",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
           }
          ],
          "entityMap": {}
         }`;
    }
    handleFormSubmit(json) {
        this.setState({ resultJson: json });
    }
    render() {
        return (
            <div>
                <Form
                    content={this.defaultValue}
                    handleSubmit={this.handleFormSubmit}
                />
                <pre>{this.state.resultJson}</pre>
            </div>
        );
    }
}

export default App;
