export default {
  methods: {
    checkIntersection (m1, m2, resulted) {
      resulted += m1[0];
      m2[0] = m2[0].slice(m1[0].length);
      m1.shift();

      if (!m2[0].length) {
        m2.shift();
      }
      return resulted;
    },
    checkCommentId (arr, resulted) {
      resulted += arr[0];
      arr.shift();
      return resulted;
    },
    findShard (m1, m2, resulted) {
      if (m2[0].includes('commentId')) {
        return this.checkCommentId(m2, resulted);
      }
      if (m1[0].includes('commentId')) {
        return this.checkCommentId(m1, resulted);
      }
      if (m2[0].includes(m1[0])) {
        return this.checkIntersection(m1, m2, resulted);
      }
      if (m1[0].includes(m2[0])) {
        return this.checkIntersection(m2, m1, resulted);
      }
    },
    simplify (mp) {
      return mp
        .replace(/&nbsp;|\u00a0/g, ' ')
        .replace(' >', '>')
        .split(/(\[\/?commentId=.*?])/g);
    },
    stick (originalMarkup, updatedMarkup) {
      const m1 = this.simplify(originalMarkup.replace(/ contenteditable="false"/g, ''));
      const m2 = this.simplify(updatedMarkup);

      let resulted = '';
      let i = 0;
      while (m1.length && m2.length) {
        if (i > 20) {
          break;
        }
        resulted = this.findShard(m1, m2, resulted);
        i++;
      }

      return updatedMarkup;
    }
  }
};
