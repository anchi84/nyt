class Response extends React.Component {
            
            constructor(props) {
                super(props);
                this.state = {articles: []};
            }

            componentDidMount() {
                var date = document.getElementById('date').value;
                console.log(date);
                var year = date.split("-")[0];
                var month = date.split("-")[1];
                if(month[0] == "0") {
                    month = month[1];
                }
                console.log(year);
                console.log(month);
                $.ajax({
                    url: "https://api.nytimes.com/svc/archive/v1/"+year +"/" +month +".json?api-key=be3ab30bcbd64f3492955d2aa48b0567",
                    method: 'GET',
                }).done((result)=> {
                            this.setState({articles: result.response.docs});
                            console.log(result);
                         }).fail(function(err) {
                            throw err;
                    });
            }

            render() {
                const articles = this.state.articles.slice(0, 20);
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

function Url(props){
    return <p><a href={props.url} target="_blank">{props.url}</a></p>;
}

$('#find').click(function() {
        const root = document.getElementById('root');
        ReactDOM.render(<Response/>,  root);
});
