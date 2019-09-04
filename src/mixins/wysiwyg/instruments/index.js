import Estimate from './estimate';
import Tools from './tools';
import Comments from './comments';
import Special from './special';

export default {
  mixins: [
    Estimate,
    Tools,
    Special,
    Comments
  ]
};
