const validationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);

      if (error) {
        console.log("error", error);
        return res.status(400).json({ message: "validation is unsuccessful" });
      }

      return next();
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "validation is unsuccessful" });
    }
  };
};

export default validationMiddleware;
