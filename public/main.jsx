/* <Form/>
 * <DisplayArea/>
 *
*/

var App = React.createClass({
    getInitialState: function() {
        return {data: ""}
    },
    requestGoogleWord: function(phrase) {
        var wordsToSend = lastFewWords(joinWords(this.state.data, phrase))
        var encodedPhrase = encodeURIComponent(wordsToSend)
        var url="http://suggestqueries.google.com/complete/search?client=chrome&q="+encodedPhrase
        $.ajax({
            url: url,
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(rs) {
                this.setState({data: joinWords(this.state.data, parseNextGoogleWord(rs, this.state.data))})
            }.bind(this),
            error: function(error) {
                console.log('error',error)
            }.bind(this),
        })
    },
    handleNewWord: function(word) {
        this.setState({data: joinWords(this.state.data, word)})
        console.log('handleNewWord', word)
        return this.requestGoogleWord(word)
    },
    render: function() {
        return (
            <div className="app">
                <div className="inner-border">
                    <div className="terminal-display">
                        <DisplayArea sentence={this.state.data}/>
                        <SubmitForm submitFunc={this.handleNewWord} />
                    </div>
                </div>
            </div>
        )
    }
})

var SubmitForm = React.createClass({
    getInitialState: function() {
        return {spaces: "", currentInput: ""}
    },
    addWord: function(e) {
        // TODO: Handle http post
        e.preventDefault()
        var word = this.getWord()
        this.refs.newWord.getDOMNode().value = ''
        console.log('addWord', word)
        return this.props.submitFunc(word)
    },
    getWord: function() {
        return this.refs.newWord.getDOMNode().value.trim()
    },
    focus: function() {
        this.refs.newWord.getDOMNode().focus()
    },
    checkPos: function(e) {
        var pos = e.target.selectionStart
        var spaces = Array(pos + 1).join("&nbsp;")  //Hacky way to get array of spaces of a given length   
        this.setState({spaces: spaces, currentInput: this.getWord()})

        console.log("spaces", spaces, this.state.spaces)
    },
    render: function() {
        return (
            <form className="submit-form" onClick={this.focus} onSubmit={this.addWord}>
                <p>Enter the next word in your sentence.</p>
                <p>Type "reset" to start over.</p>
                <p className="terminal-cursor" dangerouslySetInnerHTML={{__html: this.state.spaces + "&#x2588;"}}></p>
                <p className="terminal-input" dangerouslySetInnerHTML={{__html: this.state.currentInput}}></p>
                <input className="hidden-input" type="text" ref="newWord" onKeyUp={this.checkPos} autofocus/>
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

function parseNextGoogleWord(response) {
    console.log('response', response)
    var oldLength = response[0].split(' ').length
    var newWord = response[1][0].split(' ')[oldLength]
    console.log('oldLength',oldLength,'newWord',newWord)
    return newWord
}

function lastFewWords(string) {
    //var splitWords = string.split(' ')
    //var lastWords = splitWords.slice(Math.max(splitWords.length - 5, 0))
    //var x = lastWords.join(' ')
    //console.log('words sent', x)
    //return x
    console.log('string', string)
    return string
}

function joinWords(phrase, word) {
    if (!phrase) return word
    else return phrase + ' ' + word
}
