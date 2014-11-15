/* <Form/>
 * <DisplayArea/>
 *
*/

var App = React.createClass({
    
    getInitialState: function() {
        return {text: ""}
    },

    requestGoogleWord: function(phrase) {
        askGoogleForWord(phrase)
        .done(function(rs) {
            console.log("google rs", rs)
            var newWord = parseGoogleResponse(rs)
            this.setState({text: updatedText(this.state.text, newWord)})
        }.bind(this))
        .fail(function (err) { throw new Error(err) })
    },

    reset: function() {
        this.setState({text: ""})
    },

    handleNewWord: function(word) {
        var updated = updatedText(this.state.text, word)
        console.log("last sentence", updated, lastSentence(updated))
        this.setState({text: updated})
        if (word == "reset") return this.reset()
        else return this.requestGoogleWord(lastSentence(updated))
    },

    render: function() {
        return (
            <div className="app">
                <div className="inner-border">
                    <div className="terminal-display">
                        <DisplayArea sentence={this.state.text}/>
                        <SubmitForm submitFunc={this.handleNewWord} />
                    </div>
                </div>
            </div>
        )
    }
})

var SubmitForm = React.createClass({
    
    getInitialState: function() {
        return {spaces: "", currentInput: "&nbsp;", focused:true}
    },

    addWord: function(e) {
        // TODO: Handle http post
        e.preventDefault()
        var word = this.getWord()
        this.refs.newWord.getDOMNode().value = ''
        return this.props.submitFunc(word)
    },

    getWord: function() {
        return this.refs.newWord.getDOMNode().value.trim()
    },

    focus: function() {
        this.setState({focused:true})
        this.refs.newWord.getDOMNode().focus()
    },

    blur: function() {
        this.setState({focused:false})
    },

    checkPos: function(e) {
        var pos = e.target.selectionStart
        this.setState({spaces: spaces(pos + 1), currentInput: this.getWord()})
    },

    render: function() {
        var cx = React.addons.classSet
        var cursorClasses = cx({
            'terminal-cursor':true,
            'focused':this.state.focused
        })
        return (
            <form className="submit-form" onClick={this.focus} onSubmit={this.addWord}>
                <p>Enter the next word in your sentence.</p>
                <p>Type "reset" to start over.</p>
                <p className={cursorClasses} dangerouslySetInnerHTML={{__html: this.state.spaces + "&#x2588;"}}></p>
                <p className='terminal-cursor' dangerouslySetInnerHTML={{__html: this.state.spaces + "_"}}></p>
                <p className="terminal-input" dangerouslySetInnerHTML={{__html: this.state.currentInput + "&nbsp;"}}></p>
                <input className="hidden-input" type="text" ref="newWord" onKeyUp={this.checkPos} onBlur={this.blur} autoFocus/>
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





function lastSentence(text) {
    var sentences = _.compact(text.split("."))
    return sentences[sentences.length - 1]
}

function joinWords(text, word) {
    if (!text) return word
    else return text + ' ' + word
}

function updatedText(text, newWord) {
    if (!newWord) return text + ". "
    else return joinWords(text, newWord)
}

function spaces(length) {
    return Array(length).join("&nbsp;")  //Hacky way to get array of spaces of a given length  
}

function askGoogleForWord(str) {
    var encodedStr = encodeURIComponent(str + " ")  // extra space so that we don't get parts of words, eg. "insidious" as a response for "in"
    var url = "http://suggestqueries.google.com/complete/search?client=chrome&q="+encodedStr
    return $.ajax({
        url: url,
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
    })
}

function parseGoogleResponse(rs) {
    var oldPhrase = rs[0]
    var newWordIndex = _.compact(oldPhrase.split(' ')).length
    if (rs[1] && rs[1][0] && _.compact(rs[1][0].split(' '))[newWordIndex]) 
        return _.compact(rs[1][0].split(' '))[newWordIndex]
    else return null
}




