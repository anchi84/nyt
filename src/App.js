import React from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

/*class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}*/

class Response extends React.Component {
            
    constructor(props) {
            super(props);
            this.state = {
                articles: [],
                msg: "",
                selectedArticle: {
                    new_desk: "",
                    snippet: "",
                    pub_date: "",
                    web_url: "",
                    byline: {
                        original: ""
                    },
                    headline: {
                        main: ""
                    }
                }     
            };
            this.refresh = this.refresh.bind(this);
            this.handleImgClick = this.handleImgClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.year != nextProps.year || this.props.month != nextProps.month) {
            this.refresh(nextProps.year, nextProps.month);
        }                
    }

    refresh(y, m){
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        console.log("current year " +currentYear);
        const currentMonth = currentDate.getMonth() + 1;
        console.log("current month " +currentMonth);

        if(y < 1851 || (y == 1851 && m < 9)) {
            this.setState({msg: "You can search articles going back to September, 1851! Try again!"})
        } else if( y > currentYear || (y == currentYear && m > currentMonth)) {
            this.setState({msg: "Try with that date in the future! Now try again with existing one!"})
        } else {
            this.setState({msg: ""})
            $.ajax({
            url: "https://api.nytimes.com/svc/archive/v1/"+y +"/" +m +".json?api-key=be3ab30bcbd64f3492955d2aa48b0567",
            method: 'GET'
            }).done((result)=> {
                    this.setState({articles: result.response.docs});
                    console.log("Hello from NYT");
                    console.log(result);
            }).fail(function(err) {
                        // console.log(err);
                        throw err;
            });
        }
    }

    componentDidMount() {
        this.refresh(this.props.year, this.props.month);
    }

    handleImgClick(item) {
        console.log("hello from handleImgClick");
        this.setState({selectedArticle: item});
    }

    render() {
        console.log('render');
        const articles = this.state.articles.slice(0, 20);
        // return (articles.map((article,index) => <a href={article.web_url} target="_blank" key={index}>{article.headline.main}<br/></a>));   
            
        return (
            <div className="response">
                <div className="master">
                    <Articles articles={articles} msg={this.state.msg} onImgClick={this.handleImgClick} selectedID={this.state.selectedArticle._id}/>
                </div>
                <div className="split"/>
                <div className="details">
                    <ArticleDetails article={this.state.selectedArticle}/>
                </div>
            </div>
        );
    }
}

class Articles extends React.Component {
    render() {
        const onImgClick = this.props.onImgClick;
        const selectedID = this.props.selectedID;
        return (
            <div> 
                <p className="msg">{this.props.msg}</p>
                { 
                    this.props.articles.map(
                        (article, index) => <Url key={article.web_url}
                                            article={article} 
                                            url={article.web_url} 
                                            clickHandler={onImgClick}
                                            selectedID={selectedID}/>
                    )
                }
            </div>
        );
    }       
}

class Url extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        $.ajax({
        url: "https://api.linkpreview.net?key=5a8c62f97676dad065b7f42514cf709a26b3bb95f39ee&q="+this.props.url,
        // url: "https://api.linkpreview.net?key=123456&q=https://www.google.com",
        method: 'GET'
        }).done((result)=> {
            this.setState({data: result});
            console.log("Hello from LinkPreview");
            console.log(result);
        }).fail(function(err) {
            throw err;
        });
    }

    render() {
        // return <p><a href={this.props.url} target="_blank">{this.props.url}</a></p>;
        const clickHandler = this.props.clickHandler;
        return (  
            <div className={"preview" + (this.props.selectedID === this.props.article._id ? " selected-article":"")}>
                <h2>{this.state.data.title}</h2>
                <img className="article-image" src={this.state.data.image} onClick={()=>clickHandler(this.props.article)} alt="NY Times Article" width="60%"/>
                <p>{this.state.data.description}</p>
            </div>
        )
    }
}

const ArticleDetails = (props) => {
    const article = props.article;
    console.log("hello from ArticleDetails");
    return (
        <div>
            <p>Click on image to see article details!</p>
            {/*<p>{JSON.stringify(article, null, '\t')}</p>*/}
            <h2>{article.new_desk}</h2>
            <p>{article.snippet}</p>
            <p>{article.byline ? article.byline.original : ""}</p>
            <p>{article.pub_date.split("T")[0].replace(/-/g, "/")}</p>
            <a href={article.web_url} target="_blank">{article.headline.main}</a>
        </div>
    );
}

$('#find').click(function() {

    var date = document.getElementById('date').value;
    console.log(date);
    var year = date.split("-")[0];
    var month = date.split("-")[1];
    if(month[0] == "0") {
        month = month[1];
    }
    console.log(year);
    console.log(month);

    const root = document.getElementById('root');
    ReactDOM.render(<Response year={year} month={month} />,  root);    
});

$('#date').attr('value', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    if(currentMonth < 10) {
        currentMonth = "0" +currentMonth;
    } 
    return currentDate.getFullYear() +'-' +currentMonth;
});

export default Response;
