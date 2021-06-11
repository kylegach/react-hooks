// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonForm,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  React.useEffect(() => {
    if (!pokemonName) {
      setState({status: 'idle'})
      return
    }

    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState(prevState => ({
          ...prevState,
          pokemon: pokemonData,
          status: 'resolved',
        }))
      })
      .catch(error => {
        setState({error, status: 'rejected'})
      })
  }, [pokemonName])

  const {status, pokemon, error} = state

  if (status === 'rejected') {
    throw error
  }

  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  return 'Submit a pokemon'
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

class ErrorBoundary extends React.Component {
  state = {error: null}

  static defaultProps = {
    FallbackComponent: ErrorFallback,
  }

  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    const {FallbackComponent} = this.props
    const {error} = this.state

    if (error) {
      return <FallbackComponent error={error} />
    }

    return this.props.children
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
