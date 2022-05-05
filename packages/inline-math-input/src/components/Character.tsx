import React, { useState, useEffect } from 'react';

import mathSymbols from '../constants/mathSymbols';
import greekCharacters from '../constants/greekCharacters';

interface CharacterProps {
  text: string,
  style?: React.CSSProperties | undefined,
}

const Character: React.FC<CharacterProps> = (props) => {
  const { text, style } = props;
  const [parsedText, setParsedText] = useState(text);

  useEffect(() => {
    let editedText = text;

    greekCharacters.forEach((characterInfo) => {
      const { name, uppercase, lowercase } = characterInfo;

      editedText = editedText.replaceAll(new RegExp(`${name}`, 'gi'), (match) => {
        if (/^[A-Z]/.test(match)) {
          return uppercase;
        }
        return lowercase;
      });
    });

    mathSymbols.forEach((symbolInfo) => {
      const { plaintext, unicode } = symbolInfo;

      editedText = editedText.replaceAll(plaintext, unicode);
    });

    setParsedText(editedText);
  }, [text]);

  return (
    <p
      style={{
        ...style,
      }}
    >
      {parsedText}
    </p>
  );
};

export default Character;
