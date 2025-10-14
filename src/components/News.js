import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: 'us',
    pageSize: 8,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    try {
      this.props.setProgress(10);
      this.setState({ loading: true });
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=2540c236e51d43cbbcdb2cce350f0472&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);
      this.props.setProgress(30);
      let parsedData = await data.json();
      this.props.setProgress(70);

      this.setState({
        articles: Array.isArray(parsedData.articles) ? parsedData.articles : [],
        totalResults: parsedData.totalResults || 0,
        loading: false,
      });
      this.props.setProgress(100);
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false, articles: [] });
    }
  }

  async componentDidMount() {
    this.updateNews();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.category !== prevProps.category || this.props.country !== prevProps.country) {
      this.setState({ articles: [], loading: true, page: 1 }, () => {
        this.updateNews();
      });
    }
  }

  fetchMoreData = async () => {
    try {
      this.setState({ page: this.state.page + 1 }, async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=2540c236e51d43cbbcdb2cce350f0472&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json();

        this.setState({
          articles: this.state.articles.concat(Array.isArray(parsedData.articles) ? parsedData.articles : []),
          totalResults: parsedData.totalResults || this.state.totalResults
        });
      });
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: '30px 0px' }}>
          NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines
        </h1>

        <InfiniteScroll
          dataLength={this.state.articles ? this.state.articles.length : 0}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            {this.state.loading && <Spinner />}
            {!this.state.loading && this.state.articles.length === 0 && (
              <h3 className="text-center">No news found</h3>
            )}

            <div className="row">
              {!this.state.loading &&
                Array.isArray(this.state.articles) &&
                this.state.articles.map((element) => (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title || ""}
                      description={element.description || ""}
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source?.name || "Unknown"}
                    />
                  </div>
                ))}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;
