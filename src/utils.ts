export const dvhToPx = (dvh: number) => {
  // Convert dynamic viewport height (dvh) to pixels
  const vh = window.innerHeight * (dvh / 100)
  return vh
}

export const dvwToPx = (dvw: number) => {
  // Convert dynamic viewport width (dvw) to pixels
  const vw = window.innerWidth * (dvw / 100)
  return vw
}
