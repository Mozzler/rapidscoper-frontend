import Estimate from './estimate';
import Tools from './tools';
import Comments from './comments';
import Special from './special';
import Hovering from './hovering';
import CustomPhrase from './custom-phrase';

export default {
  mixins: [
    Estimate,
    Tools,
    Special,
    Comments,
    Hovering,
    CustomPhrase
  ]
};
