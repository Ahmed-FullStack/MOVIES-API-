const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
	cors({
		origin: 'http://localhost:3001',
	})
)

mongoose.connect('mongodb://localhost:27017/movies')

const MoviesSchema = new mongoose.Schema({
	movieTitle: {
		type: String,
		required: true,
	},
	movieOpeningTitle: String,
	movieReleaseDate: String,
})

const Movie = mongoose.model('Movie', MoviesSchema)

const movieOne = new Movie({
	movieTitle: 'A New Hope',
	movieOpeningTitle:
		"It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
	movieReleaseDate: '1977-05-2',
})

const movieTwo = new Movie({
	movieTitle: 'The Empire Strikes Back',
	movieOpeningTitle:
		'It is a dark time for the\r\nRebellion. Although the Death\r\nStar has been destroyed,\r\nImperial troops have driven the\r\nRebel forces from their hidden\r\nbase and pursued them across\r\nthe galaxy.\r\n\r\nEvading the dreaded Imperial\r\nStarfleet, a group of freedom\r\nfighters led by Luke Skywalker\r\nhas established a new secret\r\nbase on the remote ice world\r\nof Hoth.\r\n\r\nThe evil lord Darth Vader,\r\nobsessed with finding young\r\nSkywalker, has dispatched\r\nthousands of remote probes into\r\nthe far reaches of space....',
	movieReleaseDate: '1980-05-17',
})

const defaultMovies = [movieOne, movieTwo]

app
	.route('/')
	.get((req, res) => {
		Movie.find({}, (error, foundMovies) => {
			if (foundMovies.length === 0) {
				Movie.insertMany(defaultMovies, err => {
					if (!err) {
						res.redirect('/')
					}
				})
			} else {
				res.json(foundMovies)
			}
		})
	})
	.post((req, res) => {
		const MovieTitle = req.body.movieTitle
		const MovieOpeningTitle = req.body.movieOpeningTitle
		const MovieReleaseDate = req.body.movieReleaseDate
		const newMovie = new Movie({
			movieTitle: MovieTitle,
			movieOpeningTitle: MovieOpeningTitle,
			movieReleaseDate: MovieReleaseDate,
		})

		newMovie.save(err => {
			if (!err) {
				res.redirect('/')
			}
		})
	})
	.delete((req, res) => {
		Movie.findByIdAndDelete({ _id: req.body.id }, (err, foundList) => {
			if (!err) {
				res.json({ status: `ok` })
			}
		})
	})
app.listen(3000)
