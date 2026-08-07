import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!parsed.success) {
      const issueMessages = parsed.error.issues.map(
        (issue) => `${issue.path.filter((p) => p !== "body" && p !== "query" && p !== "params").join(".") || "field"}: ${issue.message}`
      );
      throw new ApiError(400, "Validation Error", issueMessages);
    }

    if (parsed.data.body) req.body = parsed.data.body;
    if (parsed.data.query) req.query = parsed.data.query;
    if (parsed.data.params) req.params = parsed.data.params;

    next();
  } catch (error) {
    next(error);
  }
};

export default validate;