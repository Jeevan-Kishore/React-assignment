import React, {Component} from "react";
import  * as jQuery from 'jquery';
const Fuse =  require('fuse-js-latest');
import Pagination from './Pagination.jsx';
import 'bootstrap';
export default class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            filteredMovieList : [],
            searchValue : '',
            fuse : '',
            pageOfItems: [],
            exampleItems : []
        };

    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
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
        return jQuery.getJSON('https://cors-anywhere.herokuapp.com/http://netflixroulette.net/api/api.php?director=Quentin')
            .then((data) => {
                this.setState({ movies: data });
                this.setState({ filteredMovieList: data });
                this.selectChanged('rating');
            });
    }

    selectChanged(key){
        const sortedList = this.state.filteredMovieList.sort((a,b) => b[key] - a[key]);
        this.setState({filteredMovieList : sortedList});
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
        this.setState({filteredMovieList: result !== 0 ? result : []});
    }

    render() {
        const movies = this.state.filteredMovieList.map((movie, index) => {
            return <div className="card movie-content col-4" key={movie.show_id}>
                <div className="row">
                    <img className="movie-poster card-img-top col-12" src={movie.poster} alt="Movie poster" />
                </div>

                <div className="card-block">
                    <h4 className="card-title">{movie.show_title}</h4>
                    <p className="card-text">{movie.summary}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Rating : {Number.parseFloat(movie.rating)}</li>
                    <li className="list-group-item">Year : {movie.release_year}</li>
                    <li className="list-group-item">Category : {movie.category}</li>
                    <li className="list-group-item">Cast : {movie.show_cast}</li>
                    <li className="list-group-item">Director : {movie.director}</li>
                    <li className="list-group-item">Time : {movie.runtime}</li>
                </ul>
            </div>
        });

        return <div id="layout-content" className="layout-content-wrapper">
            <div className="searchBarWrapper row">
                <div className="input-group col-6">
                    <span className="input-group-addon" id="basic-addon3">Search</span>
                    <input type="text" className="form-control" id="basic-url" onChange={(event) => this.searchInputChange(event)} aria-describedby="basic-addon3" />
                </div>
                <div className="col-6">
                    <div className="dropdown show">
                        <a className="btn btn-primary dropdown-toggle" href="#" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Sort
                        </a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('rating')}>rating</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('unit')}>unit</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('show_id')}>show_id</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('show_title')}>show_title</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('release_year')}>release_year</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('category')}>category</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('show_cast')}>show_cast</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('director')}>director</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('summary')}>summary</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('poster')}>poster</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('mediatype')}>mediatype</a>
                            <a className="dropdown-item md-pointer" onClick={() => this.selectChanged('runtime')}>runtime</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel-list row">{movies}</div>
            <div>
                <Pagination items={this.state.filteredMovieList} onChangePage={(pageOfItems) => this.onChangePage(pageOfItems)} />
            </div>
        </div>
    }
}
