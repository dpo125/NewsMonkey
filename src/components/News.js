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
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
      error: false
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(10);
    this.setState({ loading: true, error: false });

    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=2540c236e51d43cbbcdb2cce350f0472&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);

      if (!data.ok) throw new Error("Network response was not ok");
      this.props.setProgress(40);

      let parsedData = await data.json();

      if (!parsedData.articles || parsedData.articles.length === 0) {
        this.setState({ articles: [], totalResults: 0, loading: false });
      } else {
        this.setState({
          articles: parsedData.articles,
          totalResults: parsedData.totalResults,
          loading: false,
        });
      }

      this.props.setProgress(100);
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false, error: true });
      this.props.setProgress(100);
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
      const nextPage = this.state.page + 1;
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=2540c236e51d43cbbcdb2cce350f0472&page=${nextPage}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json();

      this.setState({
        articles: this.state.articles.concat(parsedData.articles || []),
        totalResults: parsedData.totalResults || this.state.totalResults,
        page: nextPage,
      });
    } catch (error) {
      console.error("Error loading more news:", error);
    }
  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: '30px 0px' }}>
          NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines
        </h1>

        {this.state.error && (
          <h3 className="text-center text-danger">Error loading news. Please try again later.</h3>
        )}

        <InfiniteScroll
          dataLength={this.state.articles ? this.state.articles.length : 0}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length < this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            {this.state.loading && <Spinner />}
            {!this.state.loading && this.state.articles.length === 0 && !this.state.error && (
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
