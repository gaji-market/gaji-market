import React from 'react';

import { useGetPokemonByNameQuery } from 'services/tempApi';

export default function Test() {
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur');

  if (isLoading) {
    return <h1>..LOADING</h1>;
  }

  if (error) {
    return <h1>ERROR!!</h1>;
  }

  return <div>{JSON.stringify(data)}</div>;
}
