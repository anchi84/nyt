class Response extends React.Component {
            
            constructor(props) {
                super(props);
                this.state = {articles: []};
                this.refresh = this.refresh.bind(this);
            }

            componentWillReceiveProps(nextProps){
                this.refresh(nextProps.year, nextProps.month);                
            }

            refresh(y, m){
                $.ajax({
                    url: "https://api.nytimes.com/svc/archive/v1/"+y +"/" +m +".json?api-key=be3ab30bcbd64f3492955d2aa48b0567",
                    method: 'GET',
                }).done((result)=> {
                            this.setState({articles: result.response.docs});
                            console.log(result);
                         }).fail(function(err) {
                            throw err;
                    });

            }

            componentDidMount() {
                this.refresh(this.props.year, this.props.month);
            }

            render() {
                console.log('render');
                const articles = this.state.articles.slice(0, 1);
                // return (articles.map((article,index) => <a href={article.web_url} target="_blank" key={index}>{article.headline.main}<br/></a>));
                return <Articles articles={articles.map(article => article.web_url)}/>;   
            }
}

function Articles(props){
        return (
          <div> 
            {
              props.articles.map(
                (article, index) => <Url key={index} url={article}/>
              )
            }
          </div>
        );
      }

class Url extends React.Component {
    
    constructor(props) {
                super(props);
                this.state = {data: []};
                this.setData = this.setData.bind(this);
    }

    setData(result) {
        console.log(result);
        this.setState({data: result})
    }

    componentDidMount() {
        $.ajax({
        url: "https://api.linkpreview.net?key=123456&q=https://www.google.com",
        success: this.setData
    });

    }

    render() {
        // return <p><a href={this.props.url} target="_blank">{this.props.url}</a></p>;
        return (
            <div>
                <h1>{this.state.data.title}</h1>
                <img src={this.state.data.image} alt="Smiley face" height="200"/>
                <p>{this.state.data.description}</p>
            </div>
        )
    }
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
