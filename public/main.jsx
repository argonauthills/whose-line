/* <Form/>
 * <DisplayArea/>
 *
*/

var testSentence = "Hello world. This is a real sentence."
var App = React.createClass({
    getInitialState: function() {
        return {data: testSentence}
    },
    handleNewWord: function(word) {
        console.log('handleNewWord', word)
        return this.setState({data: this.state.data + word})
    },
    render: function() {
        return (
            <div className="app">
                <SubmitForm submitFunc={this.handleNewWord} />
                <DisplayArea sentence={this.state.data}/>
            </div>
        )
    }
})

var SubmitForm = React.createClass({
    addWord: function(e) {
        // TODO: Handle http post
        e.preventDefault()
        var word = this.refs.newWord.getDOMNode().value.trim()
        console.log('addWord', word)
        return this.props.submitFunc(word)
    },
    render: function() {
        return (
            <form className="submit-form" onSubmit={this.addWord}>
                <input type="text" ref="newWord" />
            </form>
        )
    }
})

var DisplayArea = React.createClass({
    render: function() {
        return (
            <div className="display-area">{this.props.sentence}</div>
        )
    }
})

React.render(
    <App/>,
    document.getElementById('content')
);

console.log("works!")
