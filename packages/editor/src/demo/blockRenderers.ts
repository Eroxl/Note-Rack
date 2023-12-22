import createStyledText from "src/components/extendable/createStyledText";

const blockRenderers = {
  text: createStyledText(),
  h1: createStyledText({
    fontSize: '2em',
    fontWeight: 'bold'
  }),
  h2: createStyledText({
    fontSize: '1.5em',
    fontWeight: 'bold'
  }),
  h3: createStyledText({
    fontSize: '1.17em',
    fontWeight: 'bold'
  }),
  h4: createStyledText({
    fontSize: '1em',
    fontWeight: 'bold'
  }),
  h5: createStyledText({
    fontSize: '0.83em',
    fontWeight: 'bold'
  }),
}

export default blockRenderers;
