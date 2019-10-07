export default {
  methods: {
    async send () {
      this.processing = true;

      const validated = await this.$validator.validate();
      if (!validated) {
        this.processing = false;
        return;
      }

      const invitations = this.$refs.assignment.getInvitations();
      if (invitations.length) {
        this.$root.$emit('invite-assigned-users', invitations);
        this.processing = false;
        return;
      }

      await this[this.continue]();
    }
  }
};
