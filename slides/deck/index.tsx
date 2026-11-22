import { defineDeck } from 'beatdeck';
import '../themes/mareas.css';
import './deck.css';
import { config } from './deck.config';
import { SCENES } from './scenes';
import { Open } from './scenes/01-Open';
import { Before } from './scenes/02-Before';
import { Limits } from './scenes/03-Limits';
import { After } from './scenes/04-After';
import { Rules } from './scenes/05-Rules';
import { Documents } from './scenes/06-Documents';
import { Routine } from './scenes/07-Routine';
import { Verified } from './scenes/08-Verified';
import { Closing } from './scenes/09-Closing';

/** Every layer of the stage, back to front. All stay mounted; each shows itself for its own scene. */
function Stage() {
  return (
    <>
      <Open />
      <Before />
      <Limits />
      <After />
      <Rules />
      <Documents />
      <Routine />
      <Verified />
      <Closing />
    </>
  );
}

export default defineDeck({
  id: 'mareas-asesores-que-hemos-hecho',
  title: config.title,
  lang: 'es',
  scenes: SCENES,
  Stage,
  // Only the calm standby is pure black; the rest uses the theme background.
  isBlack: (s) => s.scene === 0 && s.beat === 0,
  fonts: ['400 100px "Inter Variable"', '600 100px "Inter Variable"', '400 32px "JetBrains Mono Variable"'],
});
