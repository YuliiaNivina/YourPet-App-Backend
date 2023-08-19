const ctrlWrapper = (ctrl) => {
  const decorator = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return decorator;
};

module.exports = ctrlWrapper;
