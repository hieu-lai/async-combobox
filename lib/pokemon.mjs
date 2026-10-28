/** @param {string} name */
export function pokemonDisplayName(name) {
  return (name.charAt(0).toUpperCase() + name.slice(1)).replace(
    /-([mf])$/,
    (_, gender) => ` (${gender.toUpperCase()})`,
  )
}
