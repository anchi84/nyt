class Response extends React.Component {
            
            constructor(props) {
                super(props);
                this.state = {urls: []};
            }

            componentDidMount() {
                $.ajax({
                    url: "https://api.nytimes.com/svc/archive/v1/2016/1.json?api-key=be3ab30bcbd64f3492955d2aa48b0567",
                    method: 'GET',
                }).done((result)=> {
                            // var res = result.response.docs.slice(0,20);
                            this.setState({urls: result.response.docs});
                            console.log(result);
                         }).fail(function(err) {
                            throw err;
                    });
            }

            render() {
                const urls = this.state.urls.slice(0, 20);
                return (urls.map(url => <a href={url.web_url}>{url.headline.main}<br/></a>));
            }
}

ReactDOM.render(<Response/>, document.getElementById('root'));