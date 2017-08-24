import React, {Component} from "react";
import  * as $ from 'jquery';
import StarRating from 'react-star-rating';
const Fuse =  require('fuse-js-latest');
import 'react-star-rating/dist/css/react-star-rating.min.css';
export default class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            filteredMovieList : [],
            searchValue : '',
            fuse : ''
        };
    }

    componentDidMount() {
        this.MovieList();
    }

    getInitialState(){
        return {
            movies : []
        }
    }

    MovieList() {
        return $.getJSON('https://cors-anywhere.herokuapp.com/http://netflixroulette.net/api/api.php?director=Quentin')
            .then((data) => {
                this.setState({ movies: data });
                this.setState({ filteredMovieList: data });
            });
    }



    searchInputChange(event){
        const options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ["unit", "show_id", "show_title", "release_year", "rating", "category", "show_cast", "director", "summary", "poster", "mediatype", "runtime"]
        };
        this.setState({searchValue: event.target.value});
        this.setState({fuse : new Fuse(this.state.movies, options)});
        const result = this.state.fuse.search(this.state.searchValue);
        //this.setState({filteredMovieList: result !== 0 ? result : []});
        console.log(this.state);
    }

    render() {
        console.log('props', this.props);
        const movies = this.state.filteredMovieList.map((movie, index) => {
            return <div className="card movie-content col-4" key={movie.show_id}>
                <div className="row">
                    <img className="movie-poster card-img-top col-8" src={movie.poster} alt="Movie poster" />
                </div>

                <div className="card-block">
                    <h4 className="card-title">{movie.show_title}</h4>
                    <p className="card-text">{movie.summary}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><StarRating name="react-star-rating" rating={Number.parseFloat(movie.rating)} disabled={true} editing={false} caption="Rating" totalStars={5} /></li>
                    <li className="list-group-item">{movie.release_year}</li>
                    <li className="list-group-item">{movie.category}</li>
                    <li className="list-group-item">{movie.show_cast}</li>
                    <li className="list-group-item">{movie.director}</li>
                    <li className="list-group-item">{movie.runtime}</li>
                </ul>
            </div>
        });

        return <div id="layout-content" className="layout-content-wrapper">
            <div className="searchBarWrapper">
                <input type="text" onChange={this.searchInputChange.bind(this)}/>
            </div>
            <div className="panel-list row">{ movies }</div>
        </div>
    }
}
