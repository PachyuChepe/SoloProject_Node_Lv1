const userItemMiddleware = (schema) => {
  schema.pre("save", async function (next) {
    if (!this.userItemId) {
      try {
        const maxUserItemId = await this.constructor.findOne({}, { userItemId: 1 }, { sort: { userItemId: -1 } });
        this.userItemId = maxUserItemId ? maxUserItemId.userItemId + 1 : 1;
      } catch (error) {
        return next(error);
      }
    }
    next();
  });
};

module.exports = userItemMiddleware;
